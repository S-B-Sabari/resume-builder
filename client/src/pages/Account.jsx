import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../app/features/authSlice'
import api from '../configs/api'
import { toast } from 'react-hot-toast'
import { User, Mail, Camera } from 'lucide-react'

const Account = () => {
    const { user, token } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const fileInputRef = useRef(null)

    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)

            const formData = new FormData()
            formData.append('name', name)
            formData.append('email', email)
            if (selectedImage) {
                formData.append('image', selectedImage)
            }

            const { data } = await api.put('/api/users/update', formData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            })
            dispatch(login({ token, user: data.user }))
            setSelectedImage(null)
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8 mt-10 bg-white shadow-sm border border-gray-100 rounded-2xl">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                >
                    <div className="size-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold overflow-hidden border-2 border-white shadow-sm transition-all group-hover:opacity-80">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : user?.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                        <Camera className="text-white size-6" />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Account</h1>
                    <p className="text-gray-500 text-sm">Update your personal information</p>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Your Name"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="your.email@example.com"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading || (name === user?.name && email === user?.email && !selectedImage)}
                        className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                    {selectedImage && (
                        <button
                            type="button"
                            onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                            className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Account
