import React from "react";

const TraditionalTemplate = ({ data, accentColor }) => {
    if (!data) return null;

    const {
        personal_info = {},
        professional_summary = "",
        skills = [],
        experience = [],
        education = [],
        project = [],
    } = data;

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
        <div className="w-[794px] min-h-[1123px] mx-auto bg-white text-gray-900 p-10 shadow-lg font-serif box-border">

            {/* HEADER */}
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                <h1 className="text-4xl font-bold tracking-wide uppercase" style={{ color: accentColor || "#111827" }}>
                    {personal_info?.full_name || "Your Name"}
                </h1>

                <p className="text-sm mt-3 text-gray-700">
                    {[
                        personal_info?.email,
                        personal_info?.phone,
                        personal_info?.location
                    ].filter(Boolean).join(" | ")}
                </p>

                {(personal_info?.linkedin || personal_info?.website) && (
                    <p className="text-sm text-gray-700 mt-1">
                        {[
                            personal_info?.linkedin?.split("https://www.")[1] || personal_info?.linkedin?.split("https://")[1] || personal_info?.linkedin,
                            personal_info?.website?.split("https://www.")[1] || personal_info?.website?.split("https://")[1] || personal_info?.website
                        ].filter(Boolean).join(" | ")}
                    </p>
                )}
            </div>

            {/* PROFESSIONAL SUMMARY */}
            {professional_summary && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b border-gray-300" style={{ color: accentColor || "#111827" }}>
                        Professional Summary
                    </h2>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {professional_summary}
                    </p>
                </section>
            )}

            {/* SKILLS */}
            {skills?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase mb-2 pb-1 border-b border-gray-300" style={{ color: accentColor || "#111827" }}>
                        Skills
                    </h2>
                    <p className="text-sm leading-relaxed">
                        {skills.join(" • ")}
                    </p>
                </section>
            )}

            {/* EXPERIENCE */}
            {experience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase mb-4 pb-1 border-b border-gray-300" style={{ color: accentColor || "#111827" }}>
                        Work Experience
                    </h2>

                    {experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-md text-gray-900">
                                    {exp.position}
                                </h3>
                                {(exp.start_date || exp.end_date) && (
                                    <span className="text-sm font-medium text-gray-600 shrink-0">
                                        {formatDate(exp.start_date)} -{" "}
                                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </span>
                                )}
                            </div>

                            {exp.company && (
                                <p className="text-sm italic text-gray-700 mt-0.5">
                                    {exp.company}
                                </p>
                            )}

                            {exp.description && (
                                <div className="text-sm mt-2 leading-relaxed whitespace-pre-wrap break-words">
                                    {exp.description}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* PROJECTS */}
            {project?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase mb-4 pb-1 border-b border-gray-300" style={{ color: accentColor || "#111827" }}>
                        Projects
                    </h2>

                    {project.map((proj, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-md text-gray-900">
                                    {proj.name}
                                </h3>
                                {(proj.start_date || proj.end_date) && (
                                    <span className="text-sm font-medium text-gray-600 shrink-0">
                                        {formatDate(proj.start_date)} - {formatDate(proj.end_date) || "Present"}
                                    </span>
                                )}
                            </div>

                            {proj.type && (
                                <p className="text-sm italic text-gray-700 mt-0.5">
                                    {proj.type}
                                </p>
                            )}

                            {proj.description && (
                                <div className="text-sm mt-2 leading-relaxed whitespace-pre-wrap break-words">
                                    {proj.description}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* EDUCATION */}
            {education?.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase mb-4 pb-1 border-b border-gray-300" style={{ color: accentColor || "#111827" }}>
                        Education
                    </h2>

                    {education.map((edu, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-md text-gray-900">
                                    {edu.degree} {edu.field && `in ${edu.field}`}
                                </h3>
                                {(edu.start_date || edu.end_date || edu.graduation_date) && (
                                    <span className="text-sm font-medium text-gray-600 shrink-0">
                                        {edu.start_date ? `${formatDate(edu.start_date)} - ` : ""}
                                        {edu.end_date ? formatDate(edu.end_date) : (edu.graduation_date ? formatDate(edu.graduation_date) : "Present")}
                                    </span>
                                )}
                            </div>

                            {edu.institution && (
                                <p className="text-sm italic text-gray-700 mt-0.5">
                                    {edu.institution}
                                </p>
                            )}

                            {edu.gpa && (
                                <p className="text-sm mt-1 text-gray-600">
                                    GPA: {edu.gpa}
                                </p>
                            )}
                        </div>
                    ))}
                </section>
            )}

        </div>
    );
};

export default TraditionalTemplate;
