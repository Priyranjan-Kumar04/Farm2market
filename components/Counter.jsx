'use client'
import { addToCart, removeFromCart, updateQuantity } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

const Counter = ({ productId }) => {

    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState(cartItems[productId] || 1);

    // Update input value when cart quantity changes
    useEffect(() => {
        setInputValue(cartItems[productId] || 1);
    }, [cartItems, productId]);

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        
        // Allow empty input or valid numbers
        if (value === '' || /^\d+$/.test(value)) {
            setInputValue(value);
        }
    }

    const handleInputBlur = () => {
        const numValue = parseInt(inputValue) || 1;
        const finalValue = Math.max(1, Math.min(999, numValue)); // Min 1, Max 999
        
        setInputValue(finalValue);
        
        // Update cart with new quantity
        const currentQuantity = cartItems[productId] || 1;
        if (finalValue !== currentQuantity) {
            dispatch(updateQuantity({ productId, quantity: finalValue }));
        }
    }

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none">-</button>
            <input
                type="number"
                min="1"
                max="999"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyPress={handleInputKeyPress}
                className="w-12 sm:w-16 text-center p-1 border-none outline-none bg-transparent"
                inputMode="numeric"
                pattern="[0-9]*"
            />
            <button onClick={addToCartHandler} className="p-1 select-none">+</button>
        </div>
    )
}

export default Counter