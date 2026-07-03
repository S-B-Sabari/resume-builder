import React from "react";

const TerraTemplate = ({ data, accentColor, removeBackground }) => {
    if (!data) return null;

    const {
        personal_info = {},
        professional_summary = "",
        skills = [],
        experience = [],
        education = [],
        project = [],
    } = data;

    const primaryColor = accentColor || "#0F172A"; // default dark slate

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
        <div className="w-[794px] min-h-[1123px] mx-auto bg-white shadow-xl text-gray-800">
            <div className="grid grid-cols-3 min-h-[1123px] h-full">

                {/* LEFT SIDEBAR */}
                <div
                    className="col-span-1 p-8 text-white h-full"
                    style={{ backgroundColor: primaryColor }}
                >
                    {/* Profile Image */}
                    {personal_info?.image && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={typeof personal_info.image === 'string' ? personal_info.image : URL.createObjectURL(personal_info.image)}
                                alt="Profile"
                                className={`w-28 h-28 rounded-lg object-cover border-4 border-white ${removeBackground ? "mix-blend-multiply filter contrast-125" : ""}`}
                            />
                        </div>
                    )}

                    {/* Name */}
                    <h1 className="text-2xl font-bold text-center break-words">
                        {personal_info.full_name || "Your Name"}
                    </h1>
                    <p className="text-center text-sm opacity-80 mb-8 break-words">
                        {personal_info.profession || "Profession"}
                    </p>

                    {/* Contact */}
                    <div className="mb-8">
                        <h2 className="uppercase text-sm font-semibold mb-3 tracking-wider border-b border-white pb-1">
                            Contact
                        </h2>
                        <div className="space-y-2 text-sm">
                            {personal_info.email && <p className="break-words">{personal_info.email}</p>}
                            {personal_info.phone && <p className="break-words">{personal_info.phone}</p>}
                            {personal_info.location && <p className="break-words">{personal_info.location}</p>}
                            {personal_info.linkedin && <p className="break-words">{personal_info.linkedin.split("https://www.")[1] || personal_info.linkedin}</p>}
                            {personal_info.website && <p className="break-words">{personal_info.website.split("https://")[1] || personal_info.website}</p>}
                        </div>
                    </div>

                    {/* Skills */}
                    {skills?.length > 0 && (
                        <div className="mb-8">
                            <h2 className="uppercase text-sm font-semibold mb-3 tracking-wider border-b border-white pb-1">
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="bg-white text-gray-800 text-xs px-2 py-1 rounded-md max-w-full break-words"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


                {/* RIGHT CONTENT */}
                <div className="col-span-2 p-10 space-y-10 bg-white h-full">

                    {/* Professional Summary */}
                    {professional_summary && (
                        <section>
                            <h2
                                className="text-xl font-bold mb-3 border-b pb-1"
                                style={{ color: primaryColor, borderColor: primaryColor }}
                            >
                                Professional Summary
                            </h2>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience?.length > 0 && (
                        <section>
                            <h2
                                className="text-xl font-bold mb-5 border-b pb-1"
                                style={{ color: primaryColor, borderColor: primaryColor }}
                            >
                                Work Experience
                            </h2>

                            {experience.map((exp, index) => (
                                <div key={index} className="mb-6">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-lg text-gray-900 pr-2">
                                            {exp.position}
                                        </h3>
                                        {(exp.start_date || exp.end_date) && (
                                            <span className="text-sm text-gray-500 font-medium shrink-0 pt-1">
                                                {formatDate(exp.start_date)} -{" "}
                                                {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        )}
                                    </div>

                                    {exp.company && (
                                        <p className="text-sm font-medium text-gray-600 mt-0.5">
                                            {exp.company}
                                        </p>
                                    )}

                                    {exp.description && (
                                        <div className="text-sm mt-2 leading-relaxed text-gray-700 whitespace-pre-wrap break-words">
                                            {exp.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Projects */}
                    {project?.length > 0 && (
                        <section>
                            <h2
                                className="text-xl font-bold mb-5 border-b pb-1"
                                style={{ color: primaryColor, borderColor: primaryColor }}
                            >
                                Projects
                            </h2>

                            {project.map((proj, index) => (
                                <div key={index} className="mb-5">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-lg text-gray-900 pr-2">
                                            {proj.name}
                                        </h3>
                                        {(proj.start_date || proj.end_date) && (
                                            <p className="text-xs text-gray-500 font-medium shrink-0 pt-1">
                                                {formatDate(proj.start_date)} - {formatDate(proj.end_date) || 'Present'}
                                            </p>
                                        )}
                                    </div>

                                    {proj.type && (
                                        <p className="text-sm text-gray-600 mt-0.5">{proj.type}</p>
                                    )}
                                    {proj.description && (
                                        <div className="text-sm mt-2 text-gray-700 whitespace-pre-wrap break-words">{proj.description}</div>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Education */}
                    {education?.length > 0 && (
                        <section>
                            <h2
                                className="text-xl font-bold mb-5 border-b pb-1"
                                style={{ color: primaryColor, borderColor: primaryColor }}
                            >
                                Education
                            </h2>

                            {education.map((edu, index) => (
                                <div key={index} className="mb-5">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-gray-900 pr-2">
                                            {edu.degree} {edu.field && `in ${edu.field}`}
                                        </h3>
                                        {(edu.start_date || edu.end_date || edu.graduation_date) && (
                                            <span className="text-sm text-gray-500 font-medium shrink-0 pt-0.5">
                                                {edu.start_date ? `${formatDate(edu.start_date)} - ` : ""}
                                                {edu.end_date ? formatDate(edu.end_date) : (edu.graduation_date ? formatDate(edu.graduation_date) : "Present")}
                                            </span>
                                        )}
                                    </div>

                                    {edu.institution && (
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            {edu.institution}
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

export default TerraTemplate;
