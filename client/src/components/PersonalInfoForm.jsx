import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User, XIcon, CropIcon, Pencil, Trash2 } from 'lucide-react'
import React, { useState, useRef } from 'react'
import ReactCrop, { makeAspectCrop, centerCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {
    const [imgSrc, setImgSrc] = useState("")
    const [originalImgSrc, setOriginalImgSrc] = useState("")
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const imgRef = useRef(null)
    const previewCanvasRef = useRef(null)

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value })
    }

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener("load", () => {
                const res = reader.result?.toString() || ""
                setImgSrc(res)
                setOriginalImgSrc(res)
            })
            reader.readAsDataURL(e.target.files[0])
            // clear the input so the same file can be uploaded again if needed
            e.target.value = ''
        }
    }

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget
        if (width && height) {
            const initialCrop = centerCrop(
                makeAspectCrop({ unit: '%', width: 80 }, 1, width, height),
                width,
                height
            )
            setCrop(initialCrop)
            setCompletedCrop(initialCrop)
        }
    }

    React.useEffect(() => {
        if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current &&
            completedCrop.unit === '%'
        ) {
            const image = imgRef.current;
            const canvas = previewCanvasRef.current;
            const ctx = canvas.getContext("2d");

            const nw = image.naturalWidth;
            const nh = image.naturalHeight;

            const cropX = (completedCrop.x / 100) * nw;
            const cropY = (completedCrop.y / 100) * nh;
            const cropW = (completedCrop.width / 100) * nw;
            const cropH = (completedCrop.height / 100) * nh;

            canvas.width = cropW;
            canvas.height = cropH;

            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(
                image,
                Math.max(0, cropX),
                Math.max(0, cropY),
                Math.max(0, cropW),
                Math.max(0, cropH),
                0,
                0,
                Math.max(0, cropW),
                Math.max(0, cropH)
            );
        }
    }, [completedCrop]);

    const handleApplyCrop = async (e) => {
        e.preventDefault()
        if (!completedCrop || !imgRef.current || completedCrop.unit !== '%') {
            setImgSrc("")
            return;
        }

        const image = imgRef.current;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const nw = image.naturalWidth;
        const nh = image.naturalHeight;

        const cropX = (completedCrop.x / 100) * nw;
        const cropY = (completedCrop.y / 100) * nh;
        const cropW = (completedCrop.width / 100) * nw;
        const cropH = (completedCrop.height / 100) * nh;

        canvas.width = cropW;
        canvas.height = cropH;

        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            Math.max(0, cropX),
            Math.max(0, cropY),
            Math.max(0, cropW),
            Math.max(0, cropH),
            0,
            0,
            Math.max(0, cropW),
            Math.max(0, cropH)
        );

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error("Canvas is empty");
                return;
            }
            const file = new File([blob], "cropped.jpeg", { type: "image/jpeg" });
            handleChange("image", file);
            setImgSrc("");
        }, "image/jpeg", 1);
    }

    const fields = [
        { key: "full_name", label: "Full Name", icon: User, type: "text", required: true },
        { key: "email", label: "Email Address", icon: Mail, type: "email", required: true },
        { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
        { key: "location", label: "Location", icon: MapPin, type: "text" },
        { key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text" },
        { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url" },
        { key: "website", label: "Personal Website", icon: Globe, type: "url" },
    ]

    return (
        <div>
            <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
            <p className='text-sm text-gray-600'>Get Started with the personal information</p>

            <div className='flex items-center gap-2'>
                {data?.image ? (
                    <div className="relative group inline-flex mt-2 w-24 h-24">
                        <img
                            src={typeof data.image === 'string'
                                ? data.image
                                : URL.createObjectURL(data.image)}
                            alt='user-image'
                            className='w-24 h-24 rounded-full object-cover ring ring-slate-300'
                        />
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center 
                        opacity-0 group-hover:opacity-100 transition-opacity gap-3 z-10">
                            <button onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (originalImgSrc) {
                                    setImgSrc(originalImgSrc);
                                    setCrop(undefined);
                                } else if (data?.image) {
                                    setImgSrc(typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image));
                                    setCrop(undefined);
                                }
                            }} className="cursor-pointer p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors" title="Edit Crop">
                                <Pencil className="size-4 text-white" />
                            </button>
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleChange("image", null); setOriginalImgSrc(""); }}
                                className="cursor-pointer p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors" title="Delete Image">
                                <Trash2 className="size-4 text-white" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative cursor-pointer">
                        <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700'>
                            <User className='size-16 p-3.5 border rounded-full bg-slate-50' />
                            <span className="font-medium">Upload profile image</span>
                        </div>
                        <input
                            type='file'
                            accept='image/jpeg, image/png'
                            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                            onChange={onSelectFile}
                        />
                    </div>
                )}

                {data?.image && (
                    <div className='flex flex-col gap-1 pl-4 text-sm mt-5'>
                        <p>Remove Background</p>

                        <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                            <input
                                type='checkbox'
                                className='sr-only peer'
                                onChange={() => setRemoveBackground(prev => !prev)}
                                checked={removeBackground}
                            />

                            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-600 transition-colors duration-200'></div>

                            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
                        </label>
                    </div>
                )}
            </div>

            {/* Cropper Modal */}
            {imgSrc && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative overflow-hidden flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4 text-center w-full border-b pb-2">Crop Image</h3>
                        <button onClick={() => setImgSrc("")} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                            <XIcon className="size-5" />
                        </button>

                        <div className="flex flex-col md:flex-row gap-6 w-full items-center justify-center">
                            {/* Main Cropper */}
                            <div className="flex flex-col items-center gap-4 w-full md:w-2/3">
                                <div className="bg-gray-50 p-2 rounded-lg border w-full h-[400px] flex justify-center items-center overflow-auto">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                                        onComplete={(_, percentCrop) => setCompletedCrop(percentCrop)}
                                        aspect={1}
                                        circularCrop
                                    >
                                        <img
                                            ref={imgRef}
                                            alt="Crop me"
                                            src={imgSrc}
                                            onLoad={onImageLoad}
                                            style={{
                                                maxHeight: '380px',
                                                maxWidth: '100%',
                                                display: 'block'
                                            }}
                                        />
                                    </ReactCrop>
                                </div>
                            </div>

                            {/* Live Preview */}
                            <div className="flex flex-col items-center justify-center w-full md:w-1/3">
                                <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">Preview</p>
                                <div className="w-24 h-24 rounded-full border border-gray-200 overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center">
                                    {!!completedCrop && (
                                        <canvas
                                            ref={previewCanvasRef}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 w-full">
                            <button
                                onClick={() => setImgSrc("")}
                                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApplyCrop}
                                className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <CropIcon className="size-4" />
                                Apply Crop
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {fields.map((field) => {
                const Icon = field.icon;
                return (
                    <div key={field.key} className='space-y-1 mt-5'>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                            <Icon className='size-4' />
                            {field.label}
                            {field.required && <span className='text-red-500'>*</span>}
                        </label>

                        <input
                            type={field.type}
                            value={data?.[field.key] || ""}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
                            placeholder={`Enter your ${field.label.toLowerCase()}`}
                            required={field.required}
                        />
                    </div>
                )
            })}

        </div>
    )
}

export default PersonalInfoForm
