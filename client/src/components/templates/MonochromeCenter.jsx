import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const MonochromeCenter = ({ data, accentColor = 'currentColor', removeBackground }) => {
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
            {/* Header - Centered */}
            <header className="text-center pt-16 px-12 pb-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                <p className="text-lg text-gray-600 font-medium mb-6 uppercase tracking-widest">
                    {data.personal_info?.profession || "Profession"}
                </p>

                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-gray-500 font-medium">
                    {data.personal_info?.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail className="size-3" />
                            <span>{data.personal_info.email}</span>
                        </div>
                    )}
                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="size-3" />
                            <span>{data.personal_info.phone}</span>
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="size-3" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-blue-600 mt-3 font-medium">
                    {data.personal_info?.linkedin && (
                        <div className="flex items-center gap-1.5">
                            <Linkedin className="size-3" />
                            <span>{data.personal_info.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        </div>
                    )}
                    {data.personal_info?.website && (
                        <div className="flex items-center gap-1.5">
                            <Globe className="size-3" />
                            <span>{data.personal_info.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="px-16 pb-20 space-y-10">
                {/* Profile / Summary */}
                {data.professional_summary && (
                    <section className="text-center">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Profile</h3>
                        <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto">
                            {data.professional_summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience?.length > 0 && (
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Experience</h3>
                        <div className="space-y-8">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="flex flex-col items-center text-center">
                                    <h4 className="font-bold text-gray-900 text-base">{exp.position}</h4>
                                    <p className="text-sm text-gray-500 font-semibold mb-2">
                                        {exp.company} • {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed max-w-2xl whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education?.length > 0 && (
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Education</h3>
                        <div className="space-y-6">
                            {data.education.map((edu, index) => (
                                <div key={index} className="text-center">
                                    <h4 className="font-bold text-gray-900 text-sm">{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h4>
                                    <p className="text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wide">
                                        {edu.institution} • {edu.end_date ? formatDate(edu.end_date) : "Graduated"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills?.length > 0 && (
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Expertise</h3>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 max-w-xl mx-auto">
                            {data.skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                    <div className="size-1 rounded-full bg-gray-400"></div>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default MonochromeCenter;
