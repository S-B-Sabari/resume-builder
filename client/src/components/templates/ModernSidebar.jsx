import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, Send } from "lucide-react";

const ModernSidebar = ({ data, accentColor, removeBackground }) => {
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

    const sidebarColor = accentColor || "#054a3e"; // Default to a deep green/teal from sample

    return (
        <div className="bg-white flex flex-col font-sans">
            <div className="flex flex-1">
                
                {/* SIDEBAR - 35% */}
                <aside 
                    className="w-[35%] py-12 px-8 text-white flex flex-col"
                    style={{ backgroundColor: sidebarColor }}
                >
                    {/* Profile Header */}
                    {data.personal_info?.image && (
                        <div className="mb-8 flex justify-center">
                            <div className="size-32 rounded-full border-4 border-white/20 overflow-hidden">
                                <img 
                                    src={typeof data.personal_info.image === 'string' ? data.personal_info.image : URL.createObjectURL(data.personal_info.image)} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div className="text-center mb-12">
                        <h1 className="text-2xl font-bold uppercase tracking-tight mb-2">
                           {data.personal_info?.full_name?.split(' ')[0]} 
                           <span className="block font-light opacity-90">{data.personal_info?.full_name?.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <div className="w-12 h-1 bg-white/30 mx-auto rounded-full mb-3"></div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">
                            {data.personal_info?.profession}
                        </p>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-6 mb-12">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/10 pb-2 flex items-center gap-2">
                            <Send size={12} /> Contact
                        </h2>
                        <div className="space-y-4 text-xs font-medium">
                            {data.personal_info?.phone && (
                                <div className="flex items-start gap-4">
                                    <Phone className="size-4 shrink-0 opacity-60" />
                                    <span>{data.personal_info.phone}</span>
                                </div>
                            )}
                            {data.personal_info?.email && (
                                <div className="flex items-start gap-4">
                                    <Mail className="size-4 shrink-0 opacity-60" />
                                    <span className="break-all">{data.personal_info.email}</span>
                                </div>
                            )}
                            {data.personal_info?.location && (
                                <div className="flex items-start gap-4">
                                    <MapPin className="size-4 shrink-0 opacity-60" />
                                    <span>{data.personal_info.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills Section */}
                    {data.skills?.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/10 pb-2">
                                Skills
                            </h2>
                            <div className="space-y-3">
                                {data.skills.map((skill, index) => (
                                    <div key={index} className="space-y-1.5">
                                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                                            <span>{skill}</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-white opacity-40 w-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* MAIN CONTENT - 65% */}
                <main className="w-[65%] py-12 px-12 text-gray-800 space-y-12">
                    
                    {/* Profile Summary */}
                    {data.professional_summary && (
                        <section>
                            <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-100 pb-3 mb-6">
                                Profile
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-600 font-medium whitespace-pre-wrap">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Employment History */}
                    {data.experience?.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-100 pb-3 mb-8">
                                Employment History
                            </h2>
                            <div className="space-y-10">
                                {data.experience.map((exp, index) => (
                                    <div key={index} className="relative pl-6 border-l-2 border-gray-100">
                                        <div className="absolute -left-[5px] top-0 size-2 rounded-full border-2 border-gray-100 bg-white"></div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-base font-bold text-gray-900 uppercase">
                                                {exp.position}
                                            </h3>
                                            <span className="text-[11px] font-black text-gray-400 tracking-tighter uppercase shrink-0">
                                                {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 mb-4">{exp.company}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {data.education?.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 border-b-2 border-gray-100 pb-3 mb-8">
                                Education
                            </h2>
                            <div className="space-y-8">
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-sm font-bold text-gray-900 uppercase">
                                                {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                                            </h3>
                                            <span className="text-[11px] font-black text-gray-400 tracking-tighter uppercase shrink-0">
                                                {edu.end_date ? formatDate(edu.end_date) : "Completed"}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">{edu.institution}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ModernSidebar;
