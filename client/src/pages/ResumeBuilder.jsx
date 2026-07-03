import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  Share2Icon,
  SaveIcon,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api.js";
import { toast } from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info" },
    { id: "summary", name: "Summary" },
    { id: "experience", name: "Experience" },
    { id: "education", name: "Education" },
    { id: "projects", name: "Projects" },
    { id: "skills", name: "Skills" },
  ];

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(
        "/api/resume/get/" + resumeId,
        {
          headers: { Authorization: token },
        }
      );

      if (data.resume) {
        setResumeData(data.resume);
        setRemoveBackground(data.resume.remove_background || false);
        document.title = data.resume.title;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    loadExistingResume();
  }, [resumeId]);

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public })
      );

      const { data } = await api.put(
        "/api/resume/update",
        formData,
        { headers: { Authorization: token } }
      );

      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontendUrl + "/view/" + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" });
    } else {
      navigator.clipboard.writeText(resumeUrl).then(() => {
        toast.success("Link copied to clipboard!");
      }).catch(() => {
        toast.error("Could not copy link.");
      });
    }
  };

  const downloadResume = () => {
    window.print();
  };

  const saveResume = async () => {
    try {
      let updatedResumeData = {
        ...resumeData,
        remove_background: removeBackground,
        personal_info: { ...resumeData.personal_info }
      };

      if (typeof resumeData.personal_info.image === "object") {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify(updatedResumeData)
      );

      removeBackground &&
        formData.append("removeBackground", "yes");

      typeof resumeData.personal_info.image === "object" &&
        formData.append(
          "image",
          resumeData.personal_info.image
        );

      const { data } = await api.put(
        "/api/resume/update",
        formData,
        { headers: { Authorization: token } }
      );

      setResumeData(data.resume);
      return data.message;

    } catch (error) {
      throw error;
    }
  };

  return (
    <div>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT PANEL — sticky so it stays in view while right side scrolls */}
          <div className="lg:col-span-5 lg:sticky lg:top-4">
            <div className="relative bg-white rounded-lg shadow-sm border border-gray-200">

              {/* Progress Bar */}
              <div className="relative h-1 overflow-hidden rounded-t-lg">
                <div className="absolute inset-0 bg-gray-200"></div>
                <div
                  className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-300"
                  style={{
                    width: `${(activeSectionIndex * 100) /
                      (sections.length - 1)
                      }%`,
                  }}
                ></div>
              </div>

              {/* HEADER ROW */}
              <div className="flex justify-between items-center px-0 py-3 border-b border-gray-300 ml-5 mr-5">

                <div className="flex items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) =>
                      setResumeData((prev) => ({
                        ...prev,
                        template,
                      }))
                    }
                  />

                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) =>
                      setResumeData((prev) => ({
                        ...prev,
                        accent_color: color,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prev) =>
                          Math.max(prev - 1, 0)
                        )
                      }
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) =>
                        Math.min(
                          prev + 1,
                          sections.length - 1
                        )
                      )
                    }
                    disabled={
                      activeSectionIndex ===
                      sections.length - 1
                    }
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* FORM CONTENT */}
              <div className="space-y-6 px-6 py-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "projects" && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        project: data,
                      }))
                    }
                  />
                )}

                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: data,
                      }))
                    }
                  />
                )}
              </div>

              <div className="px-4 pb-4 pt-2">
                <button
                  onClick={() =>
                    toast.promise(saveResume(), {
                      loading: "Saving...",
                      success: "Saved successfully",
                      error: "Failed to save",
                    })
                  }
                  style={{
                    background: "linear-gradient(135deg,#22c55e,#15803d)",
                    boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
                  }}
                  className="group w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                  <SaveIcon className="size-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — scrolls naturally to show page 2 */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="flex justify-end items-center gap-2 mb-4 xl:-mt-12">

              {/* ── Share button: glassmorphism frost style ── */}
              {resumeData.public && (
                <button
                  onClick={handleShare}
                  title="Copy shareable link"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    boxShadow: "0 2px 12px rgba(99,102,241,0.12)",
                  }}
                  className="group flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-600 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200"
                >
                  <Share2Icon className="size-3.5 group-hover:rotate-12 transition-transform duration-200" />
                  Share
                </button>
              )}

              {/* ── Public / Private: animated toggle pill ── */}
              <button
                onClick={changeResumeVisibility}
                title={resumeData.public ? "Make private" : "Make public"}
                style={{
                  color: resumeData.public ? "#fff" : "#64748b",
                  background: resumeData.public
                    ? "linear-gradient(135deg,#a78bfa,#818cf8)"
                    : "linear-gradient(135deg,#e2e8f0,#cbd5e1)",
                  boxShadow: resumeData.public
                    ? "0 2px 10px rgba(129,140,248,0.45)"
                    : "0 2px 6px rgba(0,0,0,0.08)",
                }}
                className="relative flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 hover:brightness-110 active:scale-95"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background: resumeData.public ? "#fff" : "#94a3b8",
                    boxShadow: resumeData.public ? "0 0 6px #c4b5fd" : "none",
                  }}
                />
                {resumeData.public ? (
                  <EyeIcon className="size-3.5" />
                ) : (
                  <EyeOffIcon className="size-3.5" />
                )}
                {resumeData.public ? "Public" : "Private"}
              </button>

              {/* ── Download: bold gradient shimmer button ── */}
              <button
                onClick={downloadResume}
                title="Download as PDF"
                style={{
                  background: "linear-gradient(135deg,#22c55e,#16a34a)",
                  boxShadow: "0 4px 14px rgba(34,197,94,0.4)",
                }}
                className="group flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-xl hover:brightness-110 hover:shadow-green-400/50 hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                <DownloadIcon className="size-4 group-hover:translate-y-0.5 transition-transform duration-200" />
                Download PDF
              </button>
            </div>

            {/* A4 preview — scales to fit container, no scroll needed */}
            <div id="resume-print">
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
                removeBackground={removeBackground}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;