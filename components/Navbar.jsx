'use client'
import { PackageIcon, Search, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs"

const Navbar = () => {

    const { user } = useUser()
    const { openSignIn } = useClerk()
    const router = useRouter();

    const [search, setSearch] = useState('')
    const [showCategories, setShowCategories] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileCategories, setMobileCategories] = useState(false)
    const hideTimeout = useRef(null)

    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    const categoriesData = {
        Crops: [
            { id: "rice", name: "Rice" },
            { id: "wheat", name: "Wheat" },
            { id: "maize", name: "Maize" },
        ],
        "Food Grains": [
            { id: "barley", name: "Barley" },
            { id: "millets", name: "Millets" },
        ],
        Pulses: [
            { id: "lentils", name: "Lentils" },
            { id: "chickpea", name: "Chickpea" },
        ],
        "Oil Crops": [
            { id: "groundnut", name: "Groundnut" },
            { id: "mustard", name: "Mustard" },
        ],
        Spices: [
            { id: "turmeric", name: "Turmeric" },
            { id: "chilli", name: "Chilli" },
        ],
    }

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4">

                    {/* LOGO */}
                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">Fram</span>2Market
                        <span className="text-green-600 text-5xl">.</span>

                        <Protect plan='plus'>
                            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full text-white bg-green-500">
                                plus
                            </p>
                        </Protect>
                    </Link>

                    {/* DESKTOP MENU */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>

                        {/* ✅ MY ORDERS (DESKTOP) */}
                        {user && (
                            <Link href="/orders" className="hover:text-green-600">
                                My Orders
                            </Link>
                        )}

                        {/* Categories Desktop */}
                        <div
                            className="relative"
                            onMouseEnter={() => {
                                if (hideTimeout.current) clearTimeout(hideTimeout.current);
                                setShowCategories(true);
                            }}
                            onMouseLeave={() => {
                                hideTimeout.current = setTimeout(() => {
                                    setShowCategories(false);
                                }, 400);
                            }}
                        >
                            <span className="cursor-pointer">Categories</span>

                            {showCategories && (
                                <div
                                    className="absolute top-8 left-0 w-[300px] bg-white border shadow-lg rounded-lg p-4 z-50"
                                    onMouseEnter={() => hideTimeout.current && clearTimeout(hideTimeout.current)}
                                    onMouseLeave={() => {
                                        hideTimeout.current = setTimeout(() => {
                                            setShowCategories(false);
                                        }, 400);
                                    }}
                                >
                                    {Object.entries(categoriesData).map(([category, products]) => (
                                        <div key={category} className="mb-4">
                                            <h4 className="font-semibold mb-1">{category}</h4>
                                            <ul className="pl-2 space-y-1">
                                                {products.map(product => (
                                                    <li
                                                        key={product.id}
                                                        onClick={() => router.push(`/product/${product.id}`)}
                                                        className="text-sm cursor-pointer hover:text-green-600"
                                                    >
                                                        {product.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} />
                            <input
                                className="bg-transparent outline-none"
                                placeholder="Search products"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                required
                            />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2">
                            <ShoppingCart size={18} />
                            <span className="absolute -top-1 left-3 text-[8px] bg-slate-600 text-white rounded-full px-1">
                                {cartCount}
                            </span>
                        </Link>

                        {!user ? (
                            <button onClick={openSignIn} className="px-8 py-2 bg-indigo-500 text-white rounded-full">
                                Login
                            </button>
                        ) : (
                            <UserButton />
                        )}
                    </div>

                    {/* MOBILE TOGGLE */}
                    <button className="sm:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileOpen && (
                <div className="sm:hidden border-t bg-white px-6 py-6">
                    <div className="flex flex-col gap-6 text-slate-700">

                        <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
                        <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>

                        {/* ✅ MY ORDERS (MOBILE) */}
                        {user && (
                            <Link href="/orders" onClick={() => setMobileOpen(false)}>
                                My Orders
                            </Link>
                        )}

                        <button onClick={() => setMobileCategories(!mobileCategories)} className="text-left">
                            Categories
                        </button>

                        {mobileCategories && (
                            <div className="pl-4 flex flex-col gap-4">
                                {Object.entries(categoriesData).map(([category, products]) => (
                                    <div key={category}>
                                        <p className="font-semibold">{category}</p>
                                        <div className="pl-3 flex flex-col gap-2">
                                            {products.map(product => (
                                                <span
                                                    key={product.id}
                                                    onClick={() => {
                                                        router.push(`/product/${product.id}`)
                                                        setMobileOpen(false)
                                                    }}
                                                    className="text-sm cursor-pointer hover:text-green-600"
                                                >
                                                    {product.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
                        <Link href="/cart" onClick={() => setMobileOpen(false)}>Cart</Link>

                        {!user ? (
                            <button onClick={openSignIn} className="w-full bg-indigo-500 text-white py-2 rounded-full">
                                Login
                            </button>
                        ) : (
                            <UserButton />
                        )}
                    </div>
                </div>
            )}

            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar
