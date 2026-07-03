import { Plus, Trash2, Heart } from 'lucide-react'
import React, { useState } from 'react'

const HobbiesForm = ({ data = [], onChange }) => {
    const [newHobby, setNewHobby] = useState("")

    const addHobby = () => {
        if (newHobby.trim() && !data.includes(newHobby.trim())) {
            onChange([...data, newHobby.trim()])
            setNewHobby("")
        }
    }

    const removeHobby = (index) => {
        onChange(data.filter((_, i) => i !== index))
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addHobby();
        }
    }

    return (
        <div className='space-y-6'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                    <Heart className='size-5 text-red-500' />
                    Hobbies & Interests
                </h3>
                <p className='text-sm text-gray-500'>Share your personal interests and pastimes</p>
            </div>

            <div className='flex gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100'>
                <input
                    type='text'
                    placeholder='Add a hobby (e.g. Photography, Hiking, Chess)'
                    className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white'
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button
                    onClick={addHobby}
                    disabled={!newHobby.trim()}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium shadow-sm active:scale-95 flex items-center gap-2'
                >
                    <Plus className='size-4' /> Add
                </button>
            </div>

            {data.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                    {data.map((hobby, index) => (
                        <div key={index} className='flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-semibold shadow-sm hover:border-blue-300 transition-all group'>
                            {hobby}
                            <button 
                                onClick={() => removeHobby(index)} 
                                className='text-gray-400 hover:text-red-500 transition-colors'
                            >
                                <Trash2 className='w-3 h-3' />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200'>
                    <Heart className='w-10 h-10 mx-auto mb-3 text-gray-300 opacity-50' />
                    <p className='text-gray-500 font-medium'>No hobbies added yet</p>
                </div>
            )}
        </div>
    )
}

export default HobbiesForm
