import { Plus, SpaceIcon, Sparkles, X } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

const COMMON_SKILLS = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Go", "Rust", "Swift", "Kotlin",
    "HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap", "React", "Angular", "Vue.js", "Next.js", "Nuxt.js",
    "Node.js", "Express", "Django", "Flask", "Spring Boot", "Ruby on Rails", "Laravel", "ASP.NET",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Firebase", "Supabase",
    "Git", "GitHub", "GitLab", "Bitbucket", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud",
    "CI/CD", "Jenkins", "GitHub Actions", "Travis CI", "CircleCI",
    "Machine Learning", "Data Science", "Artificial Intelligence", "Deep Learning", "NLP", "Pandas", "NumPy", "TensorFlow", "PyTorch",
    "Agile", "Scrum", "Kanban", "Project Management", "Jira", "Trello", "Asana",
    "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "UI/UX Design",
    "Communication", "Leadership", "Teamwork", "Problem Solving", "Time Management", "Critical Thinking", "Adaptability", "clerk"
];

const SkillsForm = ({ data, onChange }) => {
    const [newSkill, setNewSkill] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const wrapperRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setNewSkill(value);

        if (value.trim().length > 0) {
            const filtered = COMMON_SKILLS.filter(skill =>
                skill.toLowerCase().startsWith(value.toLowerCase()) && !data.includes(skill)
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }

    const addSkill = (skillToAdd = newSkill) => {
        if (skillToAdd.trim() && !data.includes(skillToAdd.trim())) {
            onChange([...data, skillToAdd.trim()])
            setNewSkill("")
            setShowSuggestions(false)
        }
    }

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove))
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    }

    return (
        <div className='space-y-4'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Skills</h3>
                <p className='text-sm text-gray-500'>Add your technical and soft skills</p>
            </div>

            <div className='flex gap-2 relative' ref={wrapperRef}>
                <div className='flex-1 relative'>
                    <input type='text' placeholder='Enter a skill (e.g., JavaScript, Project Management)'
                        className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none'
                        onChange={handleInputChange}
                        value={newSkill}
                        onFocus={() => { if (newSkill.trim()) setShowSuggestions(true) }}
                        onKeyDown={handleKeyPress} />

                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-200 shadow-lg max-h-48 rounded-md py-1 mt-1 overflow-auto text-sm">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                                    onClick={() => addSkill(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button onClick={() => addSkill()} disabled={!newSkill.trim()} className='flex items-center
            gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            transition-colors disabled:opacity-50'>
                    <Plus className='size-4' /> Add
                </button>
            </div>

            {data.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                    {data.map((skill, index) => (
                        <span key={index} className='flex items-center gap-1 px-3 py-1
                bg-blue-100 text-blue-800 rounded-full text-sm'>
                            {skill}
                            <button onClick={() => removeSkill(index)} className='ml-1 hover:bg-blue-200
                    rounded-full p-0.5 transition-colors'>
                                <X className='w-3 h-3' />
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <div className='text-center py-6 text-gray-500'>
                    <Sparkles className='w-10 h-10 mx-auto mb-2 text-gray-300' />
                    <p>No skills added yet.</p>
                    <p className='text-sm'>Add your technical and soft skills above.</p>
                </div>
            )}

            <div className='bg-blue-50 p-3 rounded-lg'>
                <p className='text-sm text-blue-800'><strong>Tip: </strong>Add 8-12
                    relevant skills. Include both technical skills (programming languages, tools)
                    and soft skills (leadership, communication).</p>
            </div>
        </div>
    )
}

export default SkillsForm
