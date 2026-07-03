import React from "react";

const ApolloTemplate = ({ data, accentColor, removeBackground }) => {
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
        <div className="w-[794px] min-h-[1123px] mx-auto bg-white shadow-lg text-gray-800">

            <div className="grid grid-cols-3 h-full min-h-[1123px]">

                {/* ================= LEFT SIDEBAR ================= */}
                <div
                    className="col-span-1 p-6 text-white h-full"
                    style={{ backgroundColor: accentColor || "#3B82F6" }}
                >
                    {/* Profile Image */}
                    {personal_info.image && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={typeof personal_info.image === 'string' ? personal_info.image : URL.createObjectURL(personal_info.image)}
                                alt="Profile"
                                className={`w-28 h-28 rounded-full object-cover border-4 border-white ${removeBackground ? "mix-blend-multiply filter contrast-125" : ""}`}
                            />
                        </div>
                    )}

                    {/* Name */}
                    <h1 className="text-xl font-bold text-center break-words">
                        {personal_info.full_name || "Your Name"}
                    </h1>

                    <p className="text-center text-sm mb-6 break-words">
                        {personal_info.profession || "Profession"}
                    </p>

                    {/* Contact Section */}
                    <div className="mb-6">
                        <h2 className="font-semibold mb-2 uppercase text-xs tracking-widest">
                            Contact
                        </h2>

                        {personal_info.email && (
                            <p className="text-xs break-words">{personal_info.email}</p>
                        )}
                        {personal_info.phone && (
                            <p className="text-xs break-words">{personal_info.phone}</p>
                        )}
                        {personal_info.location && (
                            <p className="text-xs break-words">{personal_info.location}</p>
                        )}
                        {personal_info.linkedin && (
                            <p className="text-xs break-words">{personal_info.linkedin.split("https://www.")[1] || personal_info.linkedin}</p>
                        )}
                        {personal_info.website && (
                            <p className="text-xs break-words">{personal_info.website.split("https://")[1] || personal_info.website}</p>
                        )}
                    </div>

                    {/* Skills Section */}
                    {skills && skills.length > 0 && (
                        <div>
                            <h2 className="font-semibold mb-2 uppercase text-xs tracking-widest">
                                Skills
                            </h2>
                            <ul className="list-disc list-inside text-xs space-y-1">
                                {skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* ================= RIGHT CONTENT ================= */}
                <div className="col-span-2 p-8 space-y-6 bg-white h-full">

                    {/* Professional Summary */}
                    {professional_summary && (
                        <section>
                            <h2
                                className="text-lg font-semibold mb-2 pb-1 border-b"
                                style={{ color: accentColor || "#3B82F6", borderColor: accentColor || "#3B82F6" }}
                            >
                                Professional Summary
                            </h2>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <section>
                            <h2
                                className="text-lg font-semibold mb-4 pb-1 border-b"
                                style={{ color: accentColor || "#3B82F6", borderColor: accentColor || "#3B82F6" }}
                            >
                                Experience
                            </h2>

                            {experience.map((exp, index) => (
                                <div key={index} className="mb-4">
                                    <h3 className="font-semibold text-sm text-gray-900">
                                        {exp.position} {exp.company && <span style={{ color: accentColor || "#3B82F6" }}>– {exp.company}</span>}
                                    </h3>

                                    {(exp.start_date || exp.end_date) && (
                                        <p className="text-xs text-gray-500 font-medium">
                                            {formatDate(exp.start_date)} –{" "}
                                            {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                        </p>
                                    )}

                                    {exp.description && (
                                        <div className="text-sm mt-1 text-gray-700 whitespace-pre-wrap break-words">{exp.description}</div>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Projects */}
                    {project && project.length > 0 && (
                        <section>
                            <h2
                                className="text-lg font-semibold mb-4 pb-1 border-b"
                                style={{ color: accentColor || "#3B82F6", borderColor: accentColor || "#3B82F6" }}
                            >
                                Projects
                            </h2>

                            {project.map((proj, index) => (
                                <div key={index} className="mb-4">
                                    <h3 className="font-semibold text-sm text-gray-900">
                                        {proj.name}
                                    </h3>

                                    {(proj.start_date || proj.end_date) && (
                                        <p className="text-xs text-gray-500 font-medium">
                                            {formatDate(proj.start_date)} - {formatDate(proj.end_date) || 'Present'}
                                        </p>
                                    )}

                                    {proj.description && (
                                        <div className="text-sm mt-1 text-gray-700 whitespace-pre-wrap break-words">
                                            {proj.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section>
                            <h2
                                className="text-lg font-semibold mb-4 pb-1 border-b"
                                style={{ color: accentColor || "#3B82F6", borderColor: accentColor || "#3B82F6" }}
                            >
                                Education
                            </h2>

                            {education.map((edu, index) => (
                                <div key={index} className="mb-4">
                                    <h3 className="font-semibold text-sm text-gray-900">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>

                                    {edu.institution && <p className="text-sm font-medium" style={{ color: accentColor || "#3B82F6" }}>{edu.institution}</p>}

                                    {(edu.start_date || edu.end_date || edu.graduation_date) && (
                                        <p className="text-xs text-gray-500 font-medium">
                                            {edu.start_date ? `${formatDate(edu.start_date)} - ` : ""}
                                            {edu.end_date ? formatDate(edu.end_date) : (edu.graduation_date ? formatDate(edu.graduation_date) : "Present")}
                                        </p>
                                    )}

                                    {edu.gpa && (
                                        <p className="text-sm mt-1 text-gray-600">GPA: {edu.gpa}</p>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ApolloTemplate;
