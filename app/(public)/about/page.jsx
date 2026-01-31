export default function AboutPage() {
    return (
        <div className="w-full bg-white">
            {/* Top Section */}
            <section className="max-w-6xl mx-auto px-6 py-16 text-center">
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                    About Farm2Market
                </h1>

                <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
                    Farm2Market is a digital platform that connects farmers directly with
                    buyers. Our goal is to ensure fair pricing, remove middlemen, and help
                    farmers sell their crops with confidence using real-time market data
                    and AI-based price insights.
                </p>

                <button className="mt-8 px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition">
                    Explore Market
                </button>
            </section>

            {/* Middle Section */}
            <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 border-t">
                {/* Left */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Our values
                    </h2>
                    <p className="mt-3 text-gray-600">
                        We believe in transparency, fairness, and empowering farmers through
                        technology. Every feature is designed to support honest and direct
                        trade.
                    </p>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-900">Direct Trading</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Farmers sell directly to buyers without intermediaries.
                            </p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-900">Fair Prices</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Prices based on real market data and AI prediction.
                            </p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-900">Secure Payments</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Safe and transparent digital transactions.
                            </p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-900">Farmer Support</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Simple and easy-to-use platform for farmers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="space-y-6">
                    <div className="border rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Our story
                        </h3>
                        <p className="mt-2 text-gray-600 text-sm">
                            Farm2Market began as a solution to real agricultural problems such
                            as price exploitation and limited market access. It aims to bridge
                            the gap between farmers and markets using data-driven technology.
                        </p>
                    </div>

                    <div className="border rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Meet the team
                        </h3>

                        <div className="mt-4 flex justify-center gap-6">
                            <div className="text-center flex justify-center flex-col items-center">
                                <div className="w-14 h-14 rounded-full r-10 bg-green-600 text-white flex items-center justify-center font-semibold">
                                    P
                                </div>
                                <p className="mt-2 font-medium text-sm">TeamLeader</p>
                                <p className="text-xs text-gray-500">Priyranjan Kumar</p>
                            </div>

                            <div className="text-center flex justify-center flex-col items-center">
                                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                    R
                                </div>
                                <p className="mt-2 font-medium text-sm"></p>
                                <p className="text-xs text-gray-500">Rohith.M</p>
                            </div>

                            <div className="text-center flex justify-center flex-col items-center">
                                <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                                    S
                                </div>
                                <p className="mt-2 font-medium text-sm"></p>
                                <p className="text-xs text-gray-500">Sujith.S</p>
                            </div>
                            <div className="text-center flex justify-center flex-col items-center">
                                <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                                    S
                                </div>
                                <p className="mt-2 font-medium text-sm"></p>
                                <p className="text-xs text-gray-500">Srithar.S</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom */}
            <section className="max-w-6xl mx-auto px-6 py-12 border-t text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                    Want to collaborate with us?
                </h3>
                <p className="mt-2 text-gray-600">
                    For academic collaboration or partnerships.
                </p>
                <p className="mt-1 text-green-600 font-medium">
                    support@farm2market.in
                </p>
            </section>
        </div>
    );
}
