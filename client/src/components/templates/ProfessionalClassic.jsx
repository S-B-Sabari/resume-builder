import React from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

const ProfessionalClassic = ({ data, accentColor, removeBackground }) => {
    if (!data) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        const date = new Date(year, month - 1);
        return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    const primaryColor = "#000000"; // Classic black for professional look

    return (
        <div className="bg-white text-gray-950 leading-snug flex flex-col relative w-full font-serif px-12 py-16">
            
            {/* Header: Centered */}
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[13px] font-medium text-gray-700">
                    {data.personal_info?.location && (
                        <span className="flex items-center gap-1.5">{data.personal_info.location}</span>
                    )}
                    {data.personal_info?.phone && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1.5">{data.personal_info.phone}</span>
                        </>
                    )}
                    {data.personal_info?.email && (
                        <>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1.5 underline underline-offset-2">{data.personal_info.email}</span>
                        </>
                    )}
                </div>
            </header>

            <div className="space-y-10">
                
                {/* Profile Section */}
                {data.professional_summary && (
                    <div className="grid grid-cols-12 gap-6 items-start">
                        <div className="col-span-3">
                            <h2 className="text-[13px] font-black uppercase tracking-[0.2em] border-y border-gray-900 py-1 inline-block">
                                Profile
                            </h2>
                        </div>
                        <div className="col-span-9">
                            <p className="text-[13.5px] leading-relaxed text-justify whitespace-pre-wrap">
                                {data.professional_summary}
                            </p>
                        </div>
                    </div>
                )}

                {/* Education Section */}
                {data.education?.length > 0 && (
                    <div className="grid grid-cols-12 gap-6 items-start">
                        <div className="col-span-3">
                            <h2 className="text-[13px] font-black uppercase tracking-[0.2em] border-y border-gray-900 py-1 inline-block">
                                Education
                            </h2>
                        </div>
                        <div className="col-span-9 space-y-6">
                            {data.education.map((edu, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2">
                                    <div className="col-span-4 text-[12px] font-bold text-gray-600">
                                        {edu.start_date || ""} {edu.end_date ? "- " + edu.end_date : ""}
                                    </div>
                                    <div className="col-span-8">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-[15px] underline underline-offset-2">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h4>
                                            <span className="text-[12px] font-bold text-gray-600">{edu.location || ""}</span>
                                        </div>
                                        <p className="text-[14px] font-bold text-gray-800">{edu.institution}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience Section */}
                {data.experience?.length > 0 && (
                    <div className="grid grid-cols-12 gap-6 items-start">
                        <div className="col-span-3">
                            <h2 className="text-[13px] font-black uppercase tracking-[0.2em] border-y border-gray-900 py-1 inline-block">
                                Experience
                            </h2>
                        </div>
                        <div className="col-span-9 space-y-8">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2">
                                    <div className="col-span-4 text-[12px] font-bold text-gray-600">
                                        {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </div>
                                    <div className="col-span-8">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-[15px] underline underline-offset-2">{exp.position}</h4>
                                            <span className="text-[12px] font-bold text-gray-600 shrink-0">{exp.location || ""}</span>
                                        </div>
                                        <p className="text-[14px] font-bold text-gray-800 mb-2">{exp.company}</p>
                                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-justify">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {data.skills?.length > 0 && (
                    <div className="grid grid-cols-12 gap-6 items-start border-t border-gray-100 pt-10">
                        <div className="col-span-3">
                            <h2 className="text-[13px] font-black uppercase tracking-[0.2em] border-y border-gray-900 py-1 inline-block">
                                Skills
                            </h2>
                        </div>
                        <div className="col-span-9 grid grid-cols-2 gap-y-4 gap-x-8">
                            {data.skills.map((skill, index) => (
                                <div key={index} className="flex justify-between border-b border-gray-100 pb-1">
                                    <span className="text-[13px] font-bold text-gray-800">{skill}</span>
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter self-end">Very Good</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages Section */}
                {data.languages?.length > 0 && (
                    <div className="grid grid-cols-12 gap-6 items-start border-t border-gray-100 pt-10">
                        <div className="col-span-3">
                            <h2 className="text-[13px] font-black uppercase tracking-[0.2em] border-y border-gray-900 py-1 inline-block">
                                Languages
                            </h2>
                        </div>
                        <div className="col-span-9 grid grid-cols-2 gap-y-4 gap-x-8">
                            {data.languages.map((lang, index) => (
                                <div key={index} className="flex justify-between border-b border-gray-100 pb-1">
                                    <span className="text-[13px] font-bold text-gray-800">{lang.name}</span>
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter self-end">{lang.level || "Good"}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hobbies Section */}
                {data.hobbies?.length > 0 && (
                    <div className="grid grid-cols-12 gap-6 items-start border-t border-gray-100 pt-10">
                        <div className="col-span-3">
                            <h2 className="text-[13px] font-black uppercase tracking-[0.2em] border-y border-gray-900 py-1 inline-block">
                                Hobbies
                            </h2>
                        </div>
                        <div className="col-span-9">
                            <p className="text-[13px] font-medium text-gray-800">
                                {data.hobbies.join(", ")}
                            </p>
                        </div>
                    </div>
                )}

                {/* Personal Details Section */}
                <div className="grid grid-cols-12 gap-6 items-start border-t border-gray-100 pt-10 mb-10">
                    <div className="col-span-3 font-black text-[10px] uppercase tracking-widest text-gray-400">
                        Details
                    </div>
                    <div className="col-span-9 grid grid-cols-2 gap-6 text-[12px]">
                        {data.personal_info?.dob && (
                            <div className="space-y-0.5">
                                <p className="font-black uppercase text-[10px] text-gray-400">Date of birth</p>
                                <p className="font-bold text-gray-800">{data.personal_info.dob}</p>
                            </div>
                        )}
                        {data.personal_info?.marital_status && (
                            <div className="space-y-0.5">
                                <p className="font-black uppercase text-[10px] text-gray-400">Marital status</p>
                                <p className="font-bold text-gray-800">{data.personal_info.marital_status}</p>
                            </div>
                        )}
                        {data.personal_info?.nationality && (
                            <div className="space-y-0.5">
                                <p className="font-black uppercase text-[10px] text-gray-400">Nationality</p>
                                <p className="font-bold text-gray-800">{data.personal_info.nationality}</p>
                            </div>
                        )}
                        {data.personal_info?.gender && (
                            <div className="space-y-0.5">
                                <p className="font-black uppercase text-[10px] text-gray-400">Gender</p>
                                <p className="font-bold text-gray-800">{data.personal_info.gender}</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfessionalClassic;
