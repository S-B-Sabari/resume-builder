import React from "react";

const PureATS = ({ data, accentColor }) => {
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
        <div className="w-[794px] min-h-[1123px] mx-auto bg-white text-black p-12 font-sans text-sm leading-relaxed box-border">

            {/* HEADER */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold uppercase" style={{ color: accentColor || "#000000" }}>
                    {personal_info?.full_name || "Your Name"}
                </h1>

                <p className="mt-1 text-lg font-medium">
                    {personal_info.profession || "Profession"}
                </p>

                <p className="mt-2 text-gray-800">
                    {[
                        personal_info?.email,
                        personal_info?.phone,
                        personal_info?.location
                    ].filter(Boolean).join(" | ")}
                </p>

                {(personal_info?.linkedin || personal_info?.website) && (
                    <p className="text-gray-800">
                        {[
                            personal_info?.linkedin?.split("https://www.")[1] || personal_info?.linkedin?.split("https://")[1] || personal_info?.linkedin,
                            personal_info?.website?.split("https://www.")[1] || personal_info?.website?.split("https://")[1] || personal_info?.website
                        ].filter(Boolean).join(" | ")}
                    </p>
                )}
            </div>

            <hr className="mb-6 border-gray-300" />

            {/* PROFESSIONAL SUMMARY */}
            {professional_summary && (
                <section className="mb-6">
                    <h2 className="font-bold uppercase mb-2 text-base" style={{ color: accentColor || "#000000" }}>
                        Professional Summary
                    </h2>
                    <p className="whitespace-pre-wrap break-words">{professional_summary}</p>
                </section>
            )}

            {/* SKILLS */}
            {skills?.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold uppercase mb-2 text-base" style={{ color: accentColor || "#000000" }}>
                        Skills
                    </h2>
                    <p>{skills.join(", ")}</p>
                </section>
            )}

            {/* EXPERIENCE */}
            {experience?.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold uppercase mb-3 text-base" style={{ color: accentColor || "#000000" }}>
                        Work Experience
                    </h2>

                    {experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <p className="font-semibold text-base">
                                    {exp.position}
                                </p>
                                {(exp.start_date || exp.end_date) && (
                                    <p className="font-medium">
                                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                    </p>
                                )}
                            </div>

                            {exp.company && (
                                <p className="font-medium italic">
                                    {exp.company}
                                </p>
                            )}

                            {exp.description && (
                                <div className="mt-1 whitespace-pre-wrap break-words">
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
                    <h2 className="font-bold uppercase mb-3 text-base" style={{ color: accentColor || "#000000" }}>
                        Projects
                    </h2>

                    {project.map((proj, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <p className="font-semibold text-base">
                                    {proj.name}
                                </p>
                                {(proj.start_date || proj.end_date) && (
                                    <p className="font-medium">
                                        {formatDate(proj.start_date)} - {formatDate(proj.end_date) || "Present"}
                                    </p>
                                )}
                            </div>

                            {proj.type && <p className="italic font-medium">{proj.type}</p>}

                            {proj.description && (
                                <div className="mt-1 whitespace-pre-wrap break-words">{proj.description}</div>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* EDUCATION */}
            {education?.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold uppercase mb-3 text-base" style={{ color: accentColor || "#000000" }}>
                        Education
                    </h2>

                    {education.map((edu, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <p className="font-semibold text-base">
                                    {edu.degree} {edu.field && `in ${edu.field}`}
                                </p>
                                {(edu.start_date || edu.end_date || edu.graduation_date) && (
                                    <p className="font-medium">
                                        {edu.start_date ? `${formatDate(edu.start_date)} - ` : ""}
                                        {edu.end_date ? formatDate(edu.end_date) : (edu.graduation_date ? formatDate(edu.graduation_date) : "Present")}
                                    </p>
                                )}
                            </div>

                            {edu.institution && <p className="italic font-medium">{edu.institution}</p>}

                            {edu.gpa && <p className="mt-1">GPA: {edu.gpa}</p>}
                        </div>
                    ))}
                </section>
            )}

        </div>
    );
};

export default PureATS;
