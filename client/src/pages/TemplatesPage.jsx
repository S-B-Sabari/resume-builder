import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api.js'
import pdfToText from 'react-pdftotext'
import { PlusIcon, UploadCloudIcon, XIcon, LoaderCircleIcon, CheckCircle2 } from 'lucide-react'
import TemplateSelector from '../components/TemplateSelector.jsx'

const categories = ["All Templates", "Simple", "Picture", "ATS", "Two-column"]

const TemplatesPage = () => {

    const templatesArr = [
        {
            id: "classic",
            name: "Classic",
            preview: "A clean, traditional resume format with clear sections and professional typography",
            category: "All Templates",
            thumbnail: "/template-thumbnails/classic.png"
        },
        {
            id: "modern",
            name: "Modern",
            preview: "Sleek design with strategic use of color and modern font choices",
            category: "Two-column",
            thumbnail: "/template-thumbnails/modern.png"
        },
        {
            id: "minimal-image",
            name: "Minimal Image",
            preview: "Minimal design with a single image and clean typography",
            category: "Picture",
            thumbnail: "/template-thumbnails/minimal-image.png"
        },
        {
            id: "minimal",
            name: "Minimal",
            preview: "Ultra-clean design that puts your content front and center",
            category: "Simple",
            thumbnail: "/template-thumbnails/minimal.png"
        },
        {
            id: "modern-image",
            name: "Modern Image",
            preview: "Modern design with prominent image and bold typography",
            category: "Picture",
            thumbnail: "/template-thumbnails/modern-image.png"
        },
        {
            id: "apollo",
            name: "Apollo",
            preview: "A striking sidebar format designed for standout professional profiles",
            category: "Two-column",
            thumbnail: "/template-thumbnails/apollo.png"
        },
        {
            id: "terra",
            name: "Terra",
            preview: "A bold, dark-themed sidebar layout prioritizing organization and impact",
            category: "Two-column",
            thumbnail: "/template-thumbnails/terra.png"
        },
        {
            id: "traditional",
            name: "Traditional",
            preview: "A classic, serif-heavy format with centered headers and strong horizontal dividers",
            category: "Simple",
            thumbnail: "/template-thumbnails/traditional.png"
        },
        {
            id: "prime-ats",
            name: "Prime ATS",
            preview: "An ATS-optimized layout with clean typography, clear sections, and blue accents",
            category: "ATS",
            thumbnail: "/template-thumbnails/prime-ats.png"
        },
        {
            id: "pure-ats",
            name: "Pure ATS",
            preview: "A strictly formatted, zero-styling ATS design for maximum machine readability",
            category: "ATS",
            thumbnail: "/template-thumbnails/pure-ats.png"
        }
    ]

    const [selectedCategory, setSelectedCategory] = useState("All Templates")
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [showOptionsModal, setShowOptionsModal] = useState(false)
    const [title, setTitle] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [modalStep, setModalStep] = useState(0) // 0: options, 1: create form, 2: upload form
    const [isLoading, setIsLoading] = useState(false)

    const { token } = useSelector(state => state.auth)
    const navigate = useNavigate()

    const handleUseTemplate = (templateId) => {
        setSelectedTemplate(templateId)
        setModalStep(0)
        setTitle("")
        setResumeFile(null)
        setShowOptionsModal(true)
    }

    const handleCreateResume = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const { data } = await api.post('/api/resume/create', {
                title,
                template: selectedTemplate
            })
            toast.success("Resume created")
            setShowOptionsModal(false)
            navigate(`/app/builder/${data.resume._id}`)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error creating resume")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUploadResume = async (e) => {
        e.preventDefault()
        if (!resumeFile) {
            toast.error("Please select a resume file")
            return
        }
        try {
            setIsLoading(true)
            const resumeText = await pdfToText(resumeFile)
            const { data } = await api.post('/api/ai/upload-resume', { title, resumeText })
            toast.success("Resume uploaded and parsed")
            setShowOptionsModal(false)
            navigate(`/app/builder/${data.resumeId}`)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error uploading resume")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Templates</h1>
                <p className="text-gray-600">Choose a professional template as the starting point for your resume.</p>
            </div>

            {/* Category Filter Buttons */}
            <div className="sticky top-0 z-10 py-4 mb-4 flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templatesArr
                    .filter(t => selectedCategory === "All Templates" || t.category === selectedCategory || (selectedCategory === "Simple" && !t.category)) // Fallback for Classic if needed
                    .map((template) => (
                        <div key={template.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer flex flex-col h-full">
                            <div className="flex-1 border-b border-gray-100 min-h-52 relative overflow-hidden bg-gray-50">
                                {/* Real Template Thumbnail */}
                                <img
                                    src={template.thumbnail}
                                    alt={`${template.name} resume template preview`}
                                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-blue-900/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300 gap-3">
                                    <h3 className="text-white font-bold text-xl tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {template.name}
                                    </h3>
                                    <button
                                        onClick={() => handleUseTemplate(template.id)}
                                        className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-50"
                                    >
                                        Use this template
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 bg-white">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{template.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{template.preview}</p>

                            </div>
                        </div>
                    ))}
            </div>

            {/* Modals */}
            {showOptionsModal && (
                <div onClick={() => setShowOptionsModal(false)} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl">
                        <button
                            onClick={() => setShowOptionsModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
                        >
                            <XIcon size={20} />
                        </button>

                        {modalStep === 0 && (
                            <div className="text-center mt-2">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get started.</h2>
                                <p className="text-gray-500 mb-8 font-light">How do you want to create your resume?</p>

                                <div className="grid gap-4">
                                    <button
                                        onClick={() => setModalStep(1)}
                                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-sm transition-all text-left group"
                                    >
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <PlusIcon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">Create new resume</h3>
                                            <p className="text-sm text-gray-500">Start from scratch with a blank canvas</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setModalStep(2)}
                                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50/50 hover:shadow-sm transition-all text-left group"
                                    >
                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <UploadCloudIcon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">Upload resume</h3>
                                            <p className="text-sm text-gray-500">Import your existing PDF resume</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {modalStep === 1 && (
                            <form onSubmit={handleCreateResume} className="mt-2">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Name your resume</h2>
                                <p className="text-gray-500 mb-6 font-light">Give your new resume a recognizable title.</p>

                                <input
                                    type="text"
                                    placeholder="Software Engineer Resume"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    required
                                    autoFocus
                                />

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setModalStep(0)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Back</button>
                                    <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-70 flex justify-center items-center gap-2">
                                        {isLoading && <LoaderCircleIcon className="animate-spin size-4" />}
                                        {isLoading ? "Creating..." : "Create"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {modalStep === 2 && (
                            <form onSubmit={handleUploadResume} className="mt-2 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload resume</h2>
                                <p className="text-gray-500 mb-6 font-light">We will extract your data to build the template.</p>

                                <input
                                    type="text"
                                    placeholder="Enter saving title (e.g., Marketing Resume)"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-left"
                                    required
                                />

                                <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-purple-500 hover:bg-purple-50/30 transition-all mb-6 group">
                                    <div className="flex flex-col items-center justify-center">
                                        {resumeFile ? (
                                            <>
                                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <p className="font-medium text-gray-900 truncate max-w-[200px]">{resumeFile.name}</p>
                                                <p className="text-sm text-green-600 mt-1">Ready to upload</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                                    <UploadCloudIcon size={24} />
                                                </div>
                                                <p className="font-medium text-gray-900">Click to browse your files</p>
                                                <p className="text-sm text-gray-500 mt-1">PDF format only</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf"
                                        onChange={(e) => setResumeFile(e.target.files[0])}
                                    />
                                </label>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setModalStep(0)} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Back</button>
                                    <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-70 flex justify-center items-center gap-2">
                                        {isLoading && <LoaderCircleIcon className="animate-spin size-4" />}
                                        {isLoading ? "Uploading..." : "Upload & Parse"}
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            )}
        </div>
    )
}

export default TemplatesPage
