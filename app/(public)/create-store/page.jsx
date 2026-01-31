'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function CreateStore() {

    const {user} = useUser()
    const router = useRouter()
    const {getToken} = useAuth()

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        const token = await getToken()
        try {
            const { data } = await axios.get('/api/store/create', {headers: {Authorization: `Bearer ${token}`}})
            if(['approved', 'rejected', 'pending'].includes(data.status)){
                setStatus(data.status)
                setAlreadySubmitted(true)
                switch (data.status) {
                    case "approved":
                        setMessage("Your store has been approved, you can now add products to your store from dashboard")
                        setTimeout(()=>router.push("/store"), 5000)
                        break;
                    case "rejected":
                        setMessage("Your store request has been rejected, contact the admin for more details")
                        break;
                    case "pending":
                        setMessage("Your store request is pending, please wait for admin to approve your store")
                        break;
                
                    default:
                        break;
                }
            }else{
                setAlreadySubmitted(false)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    const onSubmitHandler = async (e) => {
        console.log('Form submitted!');
        e.preventDefault()
        
        console.log('Store info:', storeInfo);
        
        if(!user){
            console.log('No user found');
            return toast('Please login to continue')
        }
        
        try {
            console.log('Getting token...');
            const token = await getToken()
            if (!token) {
                console.error('Failed to get authentication token');
                return toast.error('Authentication failed. Please try again.');
            }
            
            const formData = new FormData()
            formData.append("name", storeInfo.name)
            formData.append("description", storeInfo.description)
            formData.append("username", storeInfo.username)
            formData.append("email", storeInfo.email)
            formData.append("contact", storeInfo.contact)
            formData.append("address", storeInfo.address)
            
            // Check if image exists before appending
            if (storeInfo.image) {
                formData.append("image", storeInfo.image)
            } else {
                console.log('No image selected');
                return toast.error('Please select a store logo');
            }
            
            console.log('Sending request to /api/store/create...');
            console.log('Form data entries:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ', pair[1]);
            }
            
            try {
                const response = await axios.post('/api/store/create', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    validateStatus: function (status) {
                        return status < 500; // Resolve only if status code is less than 500
                    }
                });
                
                console.log('Response received:', response);
                
                if (response.status === 200 || response.status === 201) {
                    toast.success(response.data?.message || 'Store created successfully!');
                    await fetchSellerStatus();
                } else {
                    console.error('Server responded with error:', response.data);
                    const errorMessage = response.data?.error || 
                                       response.data?.message || 
                                       `Request failed with status ${response.status}`;
                    toast.error(errorMessage);
                    return Promise.reject(new Error(errorMessage));
                }
            } catch (error) {
                console.error('Axios error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers,
                    request: error.request
                });
                
                const errorMessage = error.response?.data?.error || 
                                   error.response?.data?.message || 
                                   error.message || 
                                   'Failed to submit store details';
                
                // Show more detailed error message in development
                if (process.env.NODE_ENV === 'development') {
                    console.error('Detailed error:', error);
                    if (error.response?.data?.details) {
                        console.error('Validation errors:', error.response.data.details);
                    }
                }
                
                toast.error(errorMessage);
                return Promise.reject(new Error(errorMessage));
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            toast.error('An unexpected error occurred. Please try again.');
            return Promise.reject(error);
        }
    }

    useEffect(() => {
        if(user){
            fetchSellerStatus()
        }
    }, [user])

    if(!user){
        return (
            <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                <h1 className="text-2xl sm:text-4xl font-semibold">Please <span className="text-slate-500">Login</span> to continue</h1>
            </div>
        )
    }

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            await onSubmitHandler(e);
                            toast.success('Store details submitted successfully!');
                        } catch (error) {
                            // Error is already handled in onSubmitHandler
                            console.error('Form submission error:', error);
                        }
                    }} className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl ">Add Your <span className="text-slate-800 font-medium">Store</span></h1>
                            <p className="max-w-lg">To become a seller on Farm2Market, submit your store details for review. Your store will be activated after admin verification.</p>
                        </div>

                        <label className="mt-10 cursor-pointer">
                            Store Logo
                            <Image src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area} className="rounded-lg mt-2 h-16 w-auto" alt="" width={150} height={100} />
                            <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
                        </label>

                        <p>Username</p>
                        <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Enter your store username" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Name</p>
                        <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Enter your store name" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Description</p>
                        <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={5} placeholder="Enter your store description" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <p>Email</p>
                        <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="Enter your store email" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Contact Number</p>
                        <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="Enter your store contact number" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Address</p>
                        <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={5} placeholder="Enter your store address" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <button type="submit" className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition ">Submit</button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
                    {status === "approved" && <p className="mt-5 text-slate-400">redirecting to dashboard in <span className="font-semibold">5 seconds</span></p>}
                </div>
            )}
        </>
    ) : (
        <div className="min-h-[80vh] flex items-center justify-center">
            <Loading />
        </div>
    )
}