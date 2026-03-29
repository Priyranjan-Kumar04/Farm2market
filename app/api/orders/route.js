import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request){
    try {
        const { userId, has } = getAuth(request)
        if(!userId){
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const { addressId, items, couponCode, paymentMethod } = await request.json()

        // Validate required fields
        if(!addressId || !paymentMethod || !items || !Array.isArray(items) || items.length === 0){
            return NextResponse.json({ error: "Missing order details. Please fill all required fields." }, { status: 400 }); 
        }

        let coupon = null;

        // Check coupon validity with better error handling
        if (couponCode) {
            try {
                coupon = await prisma.coupon.findUnique({
                    where: {code: couponCode }
                })
                if (!coupon){
                    return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 })
                }
            } catch (dbError) {
                console.error("Database error:", dbError);
                return NextResponse.json({ error: "Database error occurred" }, { status: 500 })
            }
        }

        // Check user eligibility for coupon
        if (couponCode) {
            const isPlusMember = has({plan: 'plus'})
            if (coupon.forNewUser) {
                const userOrders = await prisma.order.findMany({where: {userId}})
                if(userOrders.length > 0){
                    return NextResponse.json({ error: "This coupon is valid for new users only" }, { status: 400 })
                }
            }
            if (coupon.forMember && !isPlusMember){
                return NextResponse.json({ error: "This coupon is valid for members only" }, { status: 400 })
            }
        }

        // Group orders by storeId using a Map
        const ordersByStore = new Map()

        // Check product availability with better error handling
        for(const item of items){
            try {
                const product = await prisma.product.findUnique({where: {id: item.id}})
                
                if(!product){
                    return NextResponse.json({ 
                        error: `Product ${item.id} not found` 
                    }, { status: 404 })
                }
                
                if(product.quantity < item.quantity){
                    return NextResponse.json({ 
                        error: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}` 
                    }, { status: 400 })
                }
                
                const storeId = product.storeId
                if(!ordersByStore.has(storeId)){
                    ordersByStore.set(storeId, [])
                }
                ordersByStore.get(storeId).push({...item, price: product.price})
            } catch (productError) {
                console.error("Product fetch error:", productError);
                return NextResponse.json({ 
                    error: "Error fetching product details" 
                }, { status: 500 })
            }
         }

        let orderIds = [];
        let fullAmount = 0;
        let isShippingFeeAdded = false;

        // Create orders with better error handling
        try {
            for(const [storeId, sellerItems] of ordersByStore.entries()){
                let total = sellerItems.reduce((acc, item)=>acc + (item.price * item.quantity), 0)

                if(couponCode){
                    total -= (total * coupon.discount) / 100;
                }
                
                if(!has({plan: 'plus'}) && !isShippingFeeAdded){
                    total += 5;
                    isShippingFeeAdded = true
                }

                fullAmount += parseFloat(total.toFixed(2))

                const order = await prisma.order.create({
                    data: {
                        userId,
                         storeId,
                         addressId,
                         total: parseFloat(total.toFixed(2)),
                         paymentMethod,
                         isCouponUsed: coupon ? true : false,
                         coupon: coupon ? coupon : {},
                          orderItems: {
                            create: sellerItems.map(item =>({
                                productId: item.id,
                                quantity: item.quantity,
                                price: item.price
                            }))
                          }
                    }
                })
                orderIds.push(order.id)
            }
        } catch (orderError) {
            console.error("Order creation error:", orderError);
            return NextResponse.json({ 
                error: "Failed to create order. Please try again." 
            }, { status: 500 })
        }

        // Update product quantities only for COD orders with better error handling
        if(paymentMethod !== 'STRIPE'){
            try {
                await prisma.$transaction(async (tx) => {
                    for(const item of items){
                        const updatedProduct = await tx.product.update({
                            where: {id: item.id},
                            data: {
                                quantity: {
                                    decrement: item.quantity
                                }
                            }
                        })
                        
                        // Update inStock status based on remaining quantity
                        if(updatedProduct.quantity <= 0){
                            await tx.product.update({
                                where: {id: item.id},
                                data: {inStock: false}
                            })
                        }
                    }
                })
            } catch (inventoryError) {
                console.error("Inventory update error:", inventoryError);
                // Don't fail the order, just log the error
            }
        }

        // Process Stripe payment with better error handling
        if(paymentMethod === 'STRIPE'){
            try {
                const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
                const origin = await request.headers.get('origin')

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items:[{
                        price_data:{
                            currency: 'usd',
                            product_data:{
                                name: 'Farm2Market Order'
                            },
                            unit_amount: Math.round(fullAmount * 100)
                        },
                    quantity: 1
                    }],
                    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // current time + 30 minutes
                    mode: 'payment',
                    success_url: `${origin}/loading?nextUrl=orders`,
                    cancel_url: `${origin}/cart`,
                    metadata: {
                        orderIds: orderIds.join(','),
                        userId,
                        appId: 'Farm2Market'
                    }
                })

                return NextResponse.json({session})
            } catch (stripeError) {
                console.error("Stripe error:", stripeError);
                return NextResponse.json({ 
                    error: "Payment processing failed. Please try again." 
                }, { status: 500 })
            }
        }

        // Clear cart with better error handling
        try {
            await prisma.user.update({
                where: {id: userId},
                data: {cart : {}}
            })
        } catch (clearCartError) {
            console.error("Clear cart error:", clearCartError);
            // Don't fail the order, just log the error
        }

        return NextResponse.json({message: 'Orders Placed Successfully'})
    } catch (error) {
        console.error("Order API error:", error);
        return NextResponse.json({ 
            error: error.code || "An unexpected error occurred. Please try again." 
        }, { status: 500 })
    }
}

// Get all orders for a user
export async function GET(request){
    try {
        const { userId } = getAuth(request)
        const orders = await prisma.order.findMany({
            where: {userId, OR: [
                {paymentMethod: PaymentMethod.COD},
                {AND: [{paymentMethod: PaymentMethod.STRIPE}, {isPaid: true}]}
            ]},
            include: {
                orderItems: {include: {product: true}},
                address: true
            },
            orderBy: {createdAt: 'desc'}
        })

        return NextResponse.json({orders})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}