'use client'

import { useState } from "react";

export default function PredictionPage() {
    const [crop, setCrop] = useState("");
    const [quantity, setQuantity] = useState("");
    const [market, setMarket] = useState("");
    const [prediction, setPrediction] = useState(null);

    const handlePredict = (e) => {
        e.preventDefault();

        // Demo price logic (can be replaced with ML / API)
        const basePrices = {
            Rice: 40,
            Wheat: 35,
            Maize: 30,
            Pulses: 70,
            Spices: 120,
        };

        const basePrice = basePrices[crop] || 30;
        const predictedPrice = basePrice + Math.floor(Math.random() * 15);

        setPrediction({
            price: predictedPrice,
            note: "Prediction based on historical data and current market trends.",
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-semibold text-slate-800 mb-4">
                Farm Price Prediction
            </h1>

            <p className="text-slate-600 mb-8">
                This module helps farmers predict crop prices using data analysis, so
                they can decide the right time and price to sell their produce.
            </p>

            {/* Prediction Form */}
            <form
                onSubmit={handlePredict}
                className="bg-white border rounded-lg p-6 space-y-5"
            >
                {/* Crop */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Select Crop
                    </label>
                    <select
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)}
                        required
                        className="w-full border rounded-md px-4 py-2 outline-none"
                    >
                        <option value="">-- Select Crop --</option>
                        <option value="Rice">Rice</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Maize">Maize</option>
                        <option value="Pulses">Pulses</option>
                        <option value="Spices">Spices</option>
                    </select>
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Quantity (Kg)
                    </label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        placeholder="Enter quantity"
                        className="w-full border rounded-md px-4 py-2 outline-none"
                    />
                </div>

                {/* Market */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Market Location
                    </label>
                    <input
                        type="text"
                        value={market}
                        onChange={(e) => setMarket(e.target.value)}
                        required
                        placeholder="Enter market name"
                        className="w-full border rounded-md px-4 py-2 outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
                >
                    Predict Price
                </button>
            </form>

            {/* Prediction Result */}
            {prediction && (
                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-green-700">
                        Predicted Market Price
                    </h2>

                    <p className="mt-2 text-slate-700">
                        ₹ <span className="text-2xl font-bold">{prediction.price}</span> / kg
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                        {prediction.note}
                    </p>
                </div>
            )}
        </div>
    );
}
