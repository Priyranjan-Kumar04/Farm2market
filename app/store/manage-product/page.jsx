'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { productDummyData } from "@/assets/assets"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"

export default function StoreManageProducts() {

    const { getToken } = useAuth()
    const { user } = useUser()

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [editingProduct, setEditingProduct] = useState(null)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const categories = ['Grains', 'Pulses', 'Oil Seeds', 'Spice', 'Cash Crop', 'OrganicCrop', 'Floriculture', 'Medicine Plants', 'Plantation Crops', 'Others']

    const fetchProducts = async () => {
        try {
             const token = await getToken()
             const { data } = await axios.get('/api/store/product', {headers: { Authorization: `Bearer ${token}` } })
             setProducts(data.products.sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt)))
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    const toggleStock = async (productId) => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/store/stock-toggle',{ productId }, {headers: { Authorization: `Bearer ${token}` } })
            setProducts(prevProducts => prevProducts.map(product =>  product.id === productId ? {...product, inStock: !product.inStock} : product))

            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const openEditModal = (product) => {
        setEditingProduct({
            ...product,
            images: product.images || [], // Keep original images for display
            newImages: [] // Track new images separately
        })
        setEditModalOpen(true)
    }

    const closeEditModal = () => {
        setEditingProduct(null)
        setEditModalOpen(false)
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = await getToken()
            const formData = new FormData()
            
            formData.append('productId', editingProduct.id)
            formData.append('name', editingProduct.name)
            formData.append('description', editingProduct.description)
            formData.append('mrp', editingProduct.mrp)
            formData.append('price', editingProduct.price)
            formData.append('category', editingProduct.category)
            
            // Add images if new ones are selected
            if (editingProduct.newImages && editingProduct.newImages.length > 0) {
                editingProduct.newImages.forEach(image => {
                    formData.append('images', image)
                })
            }

            const { data } = await axios.put('/api/store/product', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            // Update product in state
            setProducts(prevProducts => 
                prevProducts.map(product => 
                    product.id === editingProduct.id 
                        ? { ...product, ...editingProduct }
                        : product
                )
            )

            toast.success(data.message)
            closeEditModal()
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const handleEditChange = (field, value) => {
        setEditingProduct(prev => ({
            ...prev,
            [field]: value
        }))
    }

    useEffect(() => {
        if(user){
            fetchProducts()
        }  
    }, [user])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>
            <table className="w-full max-w-4xl text-left  ring ring-slate-200  rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex gap-2 items-center">
                                    <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images[0]} alt="" />
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{currency} {product.mrp.toLocaleString()}</td>
                            <td className="px-4 py-3">{currency} {product.price.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                                <div className="flex items-center gap-2 justify-center">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                                    >
                                        Edit
                                    </button>
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                        <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product.id), { loading: "Updating data..." })} checked={product.inStock} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Product Modal */}
            {editModalOpen && editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-slate-800">Edit Product</h2>
                            <button
                                onClick={closeEditModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Product Images */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Product Images</label>
                                <div className="flex gap-3">
                                    {editingProduct.images && editingProduct.images.length > 0 ? (
                                        editingProduct.images.map((img, index) => (
                                            <Image key={index} width={60} height={60} className='border rounded' src={img} alt="" />
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-sm">Current images will be kept if no new images selected</div>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    onChange={(e) => handleEditChange('newImages', Array.from(e.target.files))}
                                    className="mt-2 w-full p-2 border border-slate-300 rounded"
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                <input 
                                    type="text" 
                                    value={editingProduct.name}
                                    onChange={(e) => handleEditChange('name', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea 
                                    value={editingProduct.description}
                                    onChange={(e) => handleEditChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full p-2 border border-slate-300 rounded resize-none"
                                    required
                                />
                            </div>

                            {/* Prices */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Actual Price ({currency})</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct.mrp}
                                        onChange={(e) => handleEditChange('mrp', Number(e.target.value))}
                                        className="w-full p-2 border border-slate-300 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Offer Price ({currency})</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct.price}
                                        onChange={(e) => handleEditChange('price', Number(e.target.value))}
                                        className="w-full p-2 border border-slate-300 rounded"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <select 
                                    value={editingProduct.category}
                                    onChange={(e) => handleEditChange('category', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Update Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}