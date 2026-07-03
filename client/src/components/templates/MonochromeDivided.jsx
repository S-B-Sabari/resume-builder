import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const MonochromeDivided = ({ data, accentColor = 'currentColor', removeBackground }) => {
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

    return (
        <div className="bg-white text-gray-800 leading-snug flex flex-col relative w-full font-serif">
            {/* Header */}
            <header className="pt-12 px-12 pb-6 border-b-[3px] border-gray-900 mx-12">
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-2">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>
                    <p className="text-lg text-gray-600 font-bold uppercase tracking-widest italic">
                        {data.personal_info?.profession || "Profession"}
                    </p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600 font-bold mt-6 uppercase tracking-wider">
                    {data.personal_info?.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail className="size-3 text-gray-400" />
                            <span>{data.personal_info.email}</span>
                        </div>
                    )}
                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="size-3 text-gray-400" />
                            <span>{data.personal_info.phone}</span>
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="size-3 text-gray-400" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="px-12 py-10 space-y-12">
                {/* Profile */}
                {data.professional_summary && (
                    <section>
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2 mb-4">
                            Profile
                        </h3>
                        <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                            {data.professional_summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience?.length > 0 && (
                    <section>
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2 mb-6">
                            Experience
                        </h3>
                        <div className="space-y-8">
                            {data.experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-gray-900 text-[15px] uppercase">{exp.position}</h4>
                                        <span className="text-xs font-black text-gray-500 uppercase tracking-tighter shrink-0">
                                            {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-gray-600 font-bold mb-3">{exp.company}</p>
                                    <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education?.length > 0 && (
                    <section>
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2 mb-6">
                            Education
                        </h3>
                        <div className="grid grid-cols-2 gap-8">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <h4 className="font-bold text-gray-900 text-[14px] uppercase mb-1">{edu.degree}</h4>
                                    <p className="text-[12px] text-gray-600 font-bold">{edu.institution}</p>
                                    <p className="text-[11px] text-gray-400 font-black uppercase mt-1">
                                        {edu.end_date ? formatDate(edu.end_date) : "Completed"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills?.length > 0 && (
                    <section>
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-2 mb-6">
                            Key Skills
                        </h3>
                        <div className="grid grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-2">
                            {data.skills.map((skill, index) => (
                                <div key={index} className="flex flex-col">
                                    <span className="text-[13px] text-gray-700 font-bold leading-tight">{skill}</span>
                                    <div className="w-8 h-1 bg-gray-200 mt-1"></div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default MonochromeDivided;
