import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request){
    try {
        const body = await request.text()
        const sig = request.headers.get('stripe-signature')

        const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)

        const handlePaymentIntent = async (paymentIntentId, isPaid) => {
            const session = await stripe.checkout.sessions.list({
                payment_intent: paymentIntentId
            })

            const {orderIds, userId, appId} = session.data[0].metadata
            
            if (appId !== 'Farm2Market'){
                return NextResponse.json({received: true, message: 'Invalid app id'})
            }

            const orderIdsArray = orderIds.split(',')

            if(isPaid){
                // mark order as paid and update inventory
                await prisma.$transaction(async (tx) => {
                    await Promise.all(orderIdsArray.map(async (orderId) => {
                        const order = await tx.order.update({
                            where: {id: orderId},
                            data: {isPaid: true},
                            include: {orderItems: true}
                        })

                        // Update product quantities for successful Stripe payments
                        for(const item of order.orderItems){
                            const updatedProduct = await tx.product.update({
                                where: {id: item.productId},
                                data: {
                                    quantity: {
                                        decrement: item.quantity
                                    }
                                }
                            })
                            
                            // Update inStock status based on remaining quantity
                            if(updatedProduct.quantity <= 0){
                                await tx.product.update({
                                    where: {id: item.productId},
                                    data: {inStock: false}
                                })
                            }
                        }
                    }))
                })
                
                // delete cart from user
                await prisma.user.update({
                    where: {id: userId},
                    data: {cart : {}}
                })
            }else{
                 // Get order items to restore inventory and delete orders
                 await prisma.$transaction(async (tx) => {
                    const orders = await tx.order.findMany({
                        where: {id: {in: orderIdsArray}},
                        include: {orderItems: true}
                     })

                     // Restore inventory for failed payments
                     for(const order of orders){
                        for(const item of order.orderItems){
                            await tx.product.update({
                                where: {id: item.productId},
                                data: {
                                    quantity: {
                                        increment: item.quantity
                                    },
                                    inStock: true // Restore inStock status when inventory is restored
                                }
                            })
                        }
                     }

                     // delete order from db
                     await Promise.all(orderIdsArray.map(async (orderId) => {
                        await tx.order.delete({
                            where: {id: orderId}
                        })
                     }))
                 })
            }
        }

    
        switch (event.type) {
            case 'payment_intent.succeeded': {
                await handlePaymentIntent(event.data.object.id, true)
                break;
            }

            case 'payment_intent.canceled': {
                await handlePaymentIntent(event.data.object.id, false)
                break;
            }
        
            default:
                console.log('Unhandled event type:', event.type)
                break;
        }

        return NextResponse.json({received: true})
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

export const config = {
    api: {bodyparser: false }
}