import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ClassicTemplate = ({ data, accentColor = 'currentColor', removeBackground }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="w-full bg-white text-gray-800 leading-snug shadow-sm flex flex-col relative font-sans" style={{ width: '100%', minHeight: '100%' }}>
            {/* Header */}
            <header className="text-center pt-12 px-12 pb-4">
                <h1 className="text-4xl font-extrabold tracking-widest uppercase mb-1 text-gray-900" style={{ color: accentColor !== '#3B82F6' ? accentColor : undefined }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>

                {(data.personal_info?.profession || !data.personal_info?.full_name) && (
                    <h2 className="text-xl font-medium text-gray-700 tracking-wide mb-4">
                        {data.personal_info?.profession || "Profession"}
                    </h2>
                )}

                <div className="flex flex-wrap justify-between items-center text-xs text-gray-600 px-4 mt-6">
                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="size-3.5" />
                            <span>{data.personal_info.phone}</span>
                        </div>
                    )}
                    {data.personal_info?.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="size-3.5" />
                            <span>{data.personal_info.email}</span>
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="size-3.5" />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.website && (
                        <div className="flex items-center gap-2">
                            <Globe className="size-3.5" />
                            <span className="break-all">{data.personal_info.website}</span>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <div className="flex items-center gap-2">
                            <Linkedin className="size-3.5" />
                            <span className="break-all">{data.personal_info.linkedin}</span>
                        </div>
                    )}
                </div>

                <hr className="mt-4 border-t-2 border-gray-300" />
            </header>

            <div className="px-12 pb-32 flex-1">
                {/* About Me */}
                {data.professional_summary && (
                    <section className="mb-6">
                        <h3 className="text-lg font-bold tracking-widest uppercase mb-3 text-gray-900" style={{ color: accentColor !== '#3B82F6' ? accentColor : undefined }}>
                            ABOUT ME
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed text-justify">
                            {data.professional_summary}
                        </p>
                        <hr className="mt-6 border-t-2 border-gray-300" />
                    </section>
                )}

                {/* Education */}
                {(data.education && data.education.length > 0) && (
                    <section className="mb-6">
                        <h3 className="text-lg font-bold tracking-widest uppercase mb-3 text-gray-900" style={{ color: accentColor !== '#3B82F6' ? accentColor : undefined }}>
                            EDUCATION
                        </h3>

                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <p className="text-sm text-gray-500 mb-0.5">
                                        {edu.institution} | {edu.start_date || ""} {edu.end_date ? "- " + edu.end_date : ""}
                                    </p>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">{edu.degree}</h4>
                                    {edu.field && <p className="text-sm text-gray-700 leading-relaxed">{edu.field}</p>}
                                </div>
                            ))}
                        </div>
                        <hr className="mt-6 border-t-2 border-gray-300" />
                    </section>
                )}

                {/* Work Experience */}
                {(data.experience && data.experience.length > 0) && (
                    <section className="mb-6">
                        <h3 className="text-lg font-bold tracking-widest uppercase mb-3 text-gray-900" style={{ color: accentColor !== '#3B82F6' ? accentColor : undefined }}>
                            WORK EXPERIENCE
                        </h3>

                        <div className="space-y-4">
                            {data.experience.map((exp, index) => (
                                <div key={index}>
                                    <p className="text-sm text-gray-500 mb-0.5">
                                        {exp.company} | {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </p>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">{exp.position}</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed text-justify whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                        <hr className="mt-6 border-t-2 border-gray-300" />
                    </section>
                )}

                {/* Skills */}
                {(data.skills && data.skills.length > 0) && (
                    <section className="mb-6 border-none">
                        <h3 className="text-lg font-bold tracking-widest uppercase mb-3 text-gray-900" style={{ color: accentColor !== '#3B82F6' ? accentColor : undefined }}>
                            SKILLS
                        </h3>

                        <ul className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                            {data.skills.map((skill, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="text-xl leading-none">•</span> {skill}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            {/* Bottom Footer block */}
            <div className="absolute bottom-0 left-0 right-0 h-10 w-full bg-gray-500"></div>
        </div>
    );
}

export default ClassicTemplate;