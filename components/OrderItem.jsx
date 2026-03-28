'use client'
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";

const OrderItem = ({ order }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';
    const [ratingModal, setRatingModal] = useState(null);

    const { ratings } = useSelector(state => state.rating);

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                    <Image
                                        className="h-14 w-auto"
                                        src={item.product.images[0]}
                                        alt="product_img"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p>{currency}{item.price} Qty : {item.quantity} </p>
                                    <p className="mb-1">{new Date(order.createdAt).toDateString()}</p>
                                    <div>
                                        {ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId).rating} />
                                            : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className={`text-green-500 hover:bg-green-50 transition ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                        }</div>
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center max-md:hidden">{currency}{order.total}</td>

                <td className="text-left max-md:hidden">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div
                        className={`flex items-center justify-center gap-1 rounded-full p-1 ${order.status === 'confirmed'
                            ? 'text-yellow-500 bg-yellow-100'
                            : order.status === 'delivered'
                                ? 'text-green-500 bg-green-100'
                                : 'text-slate-500 bg-slate-100'
                            }`}
                    >
                        <DotIcon size={10} className="scale-250" />
                        {order.status.split('_').join(' ').toLowerCase()}
                    </div>
                </td>
            </tr>
            {/* Mobile Layout */}
            <tr className="md:hidden">
                <td colSpan={4}>
                    <div className="flex flex-col gap-4">
                        {/* Total Price */}
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded">
                            <span className="font-medium">Total Price:</span>
                            <span className="font-bold text-green-600">{currency}{order.total}</span>
                        </div>
                        
                        {/* Address */}
                        <div className="bg-slate-50 p-3 rounded">
                            <p className="font-medium mb-2">Delivery Address:</p>
                            <p className="text-sm">{order.address.name}, {order.address.street}</p>
                            <p className="text-sm">{order.address.city}, {order.address.state}, {order.address.zip}</p>
                            <p className="text-sm">{order.address.country}, {order.address.phone}</p>
                        </div>
                        
                        {/* Order Status */}
                        <div className="flex justify-center">
                            <div className={`flex items-center justify-center gap-1 rounded-full px-4 py-2 ${
                                order.status === 'confirmed'
                                    ? 'text-yellow-500 bg-yellow-100'
                                    : order.status === 'delivered'
                                        ? 'text-green-500 bg-green-100'
                                        : 'text-slate-500 bg-slate-100'
                            }`}>
                                <DotIcon size={10} className="scale-250" />
                                {order.status.split('_').join(' ').toUpperCase()}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem