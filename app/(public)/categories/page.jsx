"use client";

import { useRouter } from "next/navigation";

const categories = [
    "Vegetables",
    "Fruits",
    "Food Grains",
    "Pulses",
    "Oil Seeds",
    "Spices",
    "Organic Products",
];

export default function Categories() {
    const router = useRouter();

    const handleClick = (category) => {
        router.push(`/shop?category=${encodeURIComponent(category)}`);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-semibold mb-6">Browse Categories</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat}
                        onClick={() => handleClick(cat)}
                        className="border rounded-lg p-4 text-center cursor-pointer
                       hover:bg-green-50 hover:border-green-600 transition"
                    >
                        <p className="font-medium">{cat}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
