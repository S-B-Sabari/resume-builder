import { Check, Layout } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const templates = [
        {
            id: "classic",
            name: "Classic",
            preview: "A clean, traditional resume format with clear sections and professional typography"
        },
        {
            id: "modern",
            name: "Modern",
            preview: "Sleek design with strategic use of color and modern font choices"
        },
        {
            id: "minimal-image",
            name: "Minimal Image",
            preview: "Minimal design with a single image and clean typography"
        },
        {
            id: "minimal",
            name: "Minimal",
            preview: "Ultra-clean design that puts your content front and center"
        },
        {
            id: "modern-image",
            name: "Modern Image",
            preview: "Modern design with a prominent image and bold typography"
        },
        {
            id: "apollo",
            name: "Apollo",
            preview: "A striking sidebar format designed for standout professional profiles"
        },
        {
            id: "terra",
            name: "Terra",
            preview: "A bold, dark-themed sidebar layout prioritizing organization and impact"
        },
        {
            id: "traditional",
            name: "Traditional",
            preview: "A classic, serif-heavy format with centered headers and strong horizontal dividers"
        },
        {
            id: "prime-ats",
            name: "Prime ATS",
            preview: "An ATS-optimized layout with clean typography, clear sections, and blue accents"
        },
        {
            id: "monochrome-center",
            name: "Monochrome Center",
            preview: "A clean, balanced design with a centered header and traditional spacing"
        },
        {
            id: "monochrome-divided",
            name: "Monochrome Divided",
            preview: "Highly structured layout featuring prominent section lines and bold titles"
        },
        {
            id: "modern-sidebar",
            name: "Modern Sidebar",
            preview: "A dynamic two-column layout with a colorful sidebar and timeline styling"
        },
        {
            id: "pure-ats",
            name: "Pure ATS",
            preview: "A strictly formatted, zero-styling ATS design for maximum machine readability"
        },
    ]

    return (
        <div className='relative' ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'linear-gradient(135deg,#1e293b,#334155)',
                    boxShadow: '0 2px 10px rgba(30,41,59,0.25)',
                }}
                className='group flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white hover:brightness-125 active:scale-95 transition-all duration-200'
            >
                <Layout size={13} className='group-hover:rotate-6 transition-transform duration-200' />
                <span className='max-sm:hidden'>
                    {templates.find(t => t.id === selectedTemplate)?.name || 'Template'}
                </span>
            </button>

            {isOpen && (
                <div className='absolute top-full w-72 p-3 mt-2 space-y-2 z-50 bg-white rounded-xl border border-gray-100 shadow-2xl max-h-[70vh] overflow-y-auto'>
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => {
                                onChange(template.id);
                                setIsOpen(false);
                            }}
                            className={`relative p-3 border rounded-md cursor-pointer transition-all flex gap-3 items-center group
                                ${selectedTemplate === template.id
                                    ? "border-blue-400 bg-blue-50"
                                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                }`}
                        >

                            {selectedTemplate === template.id && (
                                <div className='absolute top-2 right-2 z-10'>
                                    <div className='size-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm'>
                                        <Check className='w-3 h-3 text-white' />
                                    </div>
                                </div>
                            )}

                            <div className='space-y-1 flex-1'>
                                <h4 className='font-semibold text-gray-800 text-sm'>{template.name}</h4>
                                <div className='mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic'>
                                    {template.preview}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TemplateSelector
