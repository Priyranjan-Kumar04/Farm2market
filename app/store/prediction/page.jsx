'use client'

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import { cropPriceData } from "@/lib/cropPriceData";
import { indiaLocations } from "@/lib/indiaLocations";

export default function PredictionPage() {
  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [chartData, setChartData] = useState([]);

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const handlePredict = (e) => {
    e.preventDefault();

    const cropInfo = cropPriceData[crop];
    if (!cropInfo) return;

    const yearlyData = months.map((month) => {
      let price = cropInfo.basePrice;

      if (cropInfo.peakMonths.includes(month)) price += 15;
      if (cropInfo.lowMonths.includes(month)) price -= 10;

      price += Math.floor(Math.random() * 8);

      return { month, price };
    });

    setChartData(yearlyData);

    setPrediction({
      currentPrice: yearlyData[new Date().getMonth()].price,
      bestMonths: cropInfo.peakMonths,
      lowMonths: cropInfo.lowMonths,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-4">
        Crop Price Prediction (India)
      </h1>

      <form onSubmit={handlePredict} className="bg-white border p-6 rounded-lg space-y-4">

        <select
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Crop (100+)</option>
          {Object.keys(cropPriceData).map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setDistrict("");
          }}
          required
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select State</option>
          {Object.keys(indiaLocations).map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select District</option>
          {state &&
            indiaLocations[state].map(d => (
              <option key={d}>{d}</option>
            ))
          }
        </select>

        <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded w-full">
          Predict Price
        </button>
      </form>

      {prediction && (
        <>
          <div className="mt-6 bg-green-50 p-5 rounded border">
            <p><strong>Current Price:</strong> ₹{prediction.currentPrice} / kg</p>
            <p><strong>Best Months:</strong> {prediction.bestMonths.join(", ")}</p>
            <p><strong>Low Months:</strong> {prediction.lowMonths.join(", ")}</p>
          </div>

          <div className="mt-10 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="price" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
