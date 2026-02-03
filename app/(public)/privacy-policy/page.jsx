import { ShieldCheck, Database, Users, Lock, Globe, Mail } from "lucide-react";

export const metadata = {
    title: "Privacy Policy | Farm2Market",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-green-600 text-white py-14">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
                    <p className="max-w-3xl text-green-100">
                        Your trust matters to us. This policy explains how Farm2Market
                        collects, uses, and protects your information while connecting
                        farmers directly with buyers.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-6xl mx-auto px-4 py-12 space-y-12">

                {/* Intro */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-700 leading-relaxed">
                        Farm2Market is a data-driven digital platform designed to eliminate
                        middlemen and enable transparent agricultural trade. To provide
                        these services effectively, we collect limited user information and
                        handle it responsibly.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Data Collection */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <Database className="text-green-600" />
                            <h2 className="text-xl font-semibold">Information We Collect</h2>
                        </div>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                            <li>Basic user details (name, phone, email)</li>
                            <li>Location details (state, district)</li>
                            <li>Crop listings, quantity, and expected prices</li>
                            <li>Login activity and device data</li>
                        </ul>
                    </div>

                    {/* Usage */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <Users className="text-green-600" />
                            <h2 className="text-xl font-semibold">How We Use Data</h2>
                        </div>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                            <li>Match farmers with buyers directly</li>
                            <li>Provide crop price prediction and demand analysis</li>
                            <li>Improve system performance and usability</li>
                            <li>Send alerts, notifications, and updates</li>
                        </ul>
                    </div>

                    {/* Security */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <Lock className="text-green-600" />
                            <h2 className="text-xl font-semibold">Data Security</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            We use secure authentication, encrypted databases, and controlled
                            access to protect user data. Only authorized users and systems can
                            access sensitive information.
                        </p>
                    </div>

                    {/* Sharing */}
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <ShieldCheck className="text-green-600" />
                            <h2 className="text-xl font-semibold">Data Sharing Policy</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            We do not sell personal data. Information is shared only between
                            farmers and buyers for trade purposes or when legally required.
                        </p>
                    </div>

                </div>

                {/* Global Compliance */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <Globe className="text-green-600" />
                        <h2 className="text-xl font-semibold">Legal & Compliance</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        Our platform follows applicable data protection guidelines and best
                        practices to ensure lawful processing of user data across regions.
                    </p>
                </div>

                {/* User Rights */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>View and update your personal information</li>
                        <li>Request account deletion</li>
                        <li>Withdraw consent for data usage</li>
                        <li>Raise concerns related to data privacy</li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Mail className="text-green-700" />
                        <h2 className="text-xl font-semibold">Contact Us</h2>
                    </div>
                    <p className="text-gray-700">
                        For any privacy-related questions or requests, reach us at:
                    </p>
                    <p className="font-medium mt-1">
                        support@farm2market.com
                    </p>
                </div>

                {/* Footer Note */}
                <p className="text-sm text-gray-500 text-center">
                    Last updated: February 2026
                </p>

            </section>
        </div>
    );
}
