import { Plus, Trash2, Languages as LangIcon } from 'lucide-react'
import React, { useState } from 'react'

const LanguagesForm = ({ data = [], onChange }) => {
    const [newLang, setNewLang] = useState({ name: "", level: "" })

    const addLanguage = () => {
        if (newLang.name.trim()) {
            onChange([...data, { ...newLang }])
            setNewLang({ name: "", level: "" })
        }
    }

    const removeLanguage = (index) => {
        onChange(data.filter((_, i) => i !== index))
    }

    return (
        <div className='space-y-6'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                    <LangIcon className='size-5 text-blue-600' />
                    Languages
                </h3>
                <p className='text-sm text-gray-500'>List the languages you speak and your proficiency level</p>
            </div>

            <div className='grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100'>
                <input
                    type='text'
                    placeholder='Language (e.g. English)'
                    value={newLang.name}
                    onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
                    className='px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                />
                <select
                    value={newLang.level}
                    onChange={(e) => setNewLang({ ...newLang, level: e.target.value })}
                    className='px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white'
                >
                    <option value="">Select Level</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Professional">Professional</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                    <option value="Perfectly">Perfectly</option>
                    <option value="Very good">Very good</option>
                    <option value="Good">Good</option>
                </select>
                <button
                    onClick={addLanguage}
                    disabled={!newLang.name.trim()}
                    className='col-span-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium shadow-sm active:scale-95'
                >
                    <Plus className='size-4' /> Add Language
                </button>
            </div>

            {data.length > 0 && (
                <div className='grid sm:grid-cols-2 gap-3'>
                    {data.map((lang, index) => (
                        <div key={index} className='flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white shadow-sm hover:border-blue-200 transition-all group'>
                            <div>
                                <p className='font-bold text-gray-900 text-sm'>{lang.name}</p>
                                <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>{lang.level || "Level not set"}</p>
                            </div>
                            <button
                                onClick={() => removeLanguage(index)}
                                className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all'
                            >
                                <Trash2 className='size-4' />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LanguagesForm
