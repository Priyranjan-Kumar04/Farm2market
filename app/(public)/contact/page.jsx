'use client'

import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for contacting Farm2Market. We will get back to you soon.");
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <div className="max-w-7xl m mx-auto px-6 py-12">

            {/* Heading */}
            <div className="mb-10">
                <h1 className="text-3xl font-semibold text-slate-800">
                    Contact Us
                </h1>
                <p className="text-slate-600 mt-2">
                    Have questions or need help? Reach out to us anytime.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <Phone className="text-green-600" />
                        <div>
                            <p className="font-medium">Phone</p>
                            <p className="text-slate-600">+91 8270722026</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Mail className="text-green-600" />
                        <div>
                            <p className="font-medium">Email</p>
                            <p className="text-slate-600">priyranjank@gmail.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <MapPin className="text-green-600" />
                        <div>
                            <p className="font-medium">Address</p>
                            <p className="text-slate-600">
                                Salem, Namakkal, Mahendra Institutions
                            </p>
                        </div>
                    </div>

                    <p className="text-slate-600">
                        Farm2Market connects farmers directly with buyers, ensuring fair
                        pricing and transparent trade.
                    </p>
                </div>

                {/* Contact Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border rounded-lg p-6 space-y-5"
                >
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border rounded-md px-4 py-2 outline-none"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border rounded-md px-4 py-2 outline-none"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows="4"
                            className="w-full border rounded-md px-4 py-2 outline-none"
                            placeholder="Write your message here"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium"
                    >
                        Send Message
                    </button>
                </form>

            </div>
        </div>
    );
}
