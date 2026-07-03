import { Check } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react'
import { Palette } from "lucide-react";

const ColorPicker = ({ selectedColor, onChange }) => {
    const colors = [
        { name: "Blue", value: "#3B82F6" },
        { name: "Indigo", value: "#6366F1" },
        { name: "Purple", value: "#8B5CF6" },
        { name: "Green", value: "#10B981" },
        { name: "Red", value: "#EF4444" },
        { name: "Orange", value: "#F97316" },
        { name: "Teal", value: "#14B8A6" },
        { name: "Pink", value: "#EC4899" },
        { name: "Gray", value: "#6B7280" },
        { name: "Black", value: "#1F2937" },
        { name: "Amber", value: "#F59E0B" },
        { name: "Cyan", value: "#06B6D4" },
        { name: "Emerald", value: "#059669" },
        { name: "Rose", value: "#F43F5E" },
        { name: "Slate", value: "#334155" },
    ]

    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <div className='relative' ref={wrapperRef}>
            <button onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'rgba(255,255,255,0.9)',
                    border: `2px solid ${selectedColor}`,
                    boxShadow: `0 2px 10px ${selectedColor}33`,
                }}
                className='group flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold hover:brightness-95 active:scale-95 transition-all duration-200'
            >
                <span
                    className='inline-block w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-110'
                    style={{ background: selectedColor }}
                />
                <Palette size={13} style={{ color: selectedColor }} className='group-hover:rotate-12 transition-transform duration-200' />
                <span className='max-sm:hidden' style={{ color: selectedColor }}>Accent</span>
            </button>
            {isOpen && (
                <div className='grid grid-cols-4 w-64 gap-2 absolute top-full left-0
            right-0 p-4 mt-2 z-10 bg-white rounded-xl border border-gray-100 shadow-2xl'>
                    {colors.map((color) => (
                        <div key={color.value} className='relative cursor-pointer group-[
                    flex flex-col' onClick={() => { onChange(color.value); setIsOpen(false) }}>
                            <div className='w-12 h-12 rounded-full border-2
                    border-transparent group-hover:border-black/25
                    transition-colors' style={{ backgroundColor: color.value }}>
                            </div>
                            {selectedColor === color.value && (
                                <div className='absolute top-0 left-0 right-0 bottom-4.5
                        flex items-center justify-center'>
                                    <Check className='size-5 text-white' />
                                </div>
                            )}
                            <p className='text-xs text-center mt-1 text-gray-600'>{color.name}</p>

                        </div>
                    ))}

                </div>
            )}

        </div>
    )
}

export default ColorPicker
