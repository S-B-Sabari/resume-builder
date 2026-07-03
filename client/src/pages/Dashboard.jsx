import {
  ArrowLeftSquare,
  FilePenLineIcon,
  Loader2Icon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { dummyResumeData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api.js";
import pdfToText from 'react-pdftotext'


const DocumentCard = ({ resume, navigate, setEditResumeId, setTitle, deleteResume }) => {
  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-1.5 transition-all duration-500 flex flex-col min-h-[240px]">
      {/* Card Top / Preview Graphic */}
      <div
        onClick={() => navigate(`/app/builder/${resume._id}`)}
        className="h-24 relative cursor-pointer overflow-hidden p-6 bg-slate-50 group-hover:bg-blue-50 transition-colors duration-500"
      >
        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transform group-hover:scale-125 transition-transform duration-700">
          <FilePenLineIcon size={140} className="text-blue-600" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <FilePenLineIcon className="size-5 text-blue-600" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col z-10">
        <h3 onClick={() => navigate(`/app/builder/${resume._id}`)} className="font-extrabold text-slate-900 text-lg mb-1 truncate cursor-pointer hover:text-blue-600 transition-colors" title={resume.title}>
          {resume.title}
        </h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
          {resume.template || 'Classic'} template
        </p>

        <div className="mt-auto flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded">
            {new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => { e.stopPropagation(); setEditResumeId(resume._id); setTitle(resume.title); }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Rename"
            >
              <PencilIcon className="size-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deleteResume(resume._id); }}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Delete"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {

  const { user, token } = useSelector(state => state.auth)


  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [editResumeId, setEditResumeId] = useState("");
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);

  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();



  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', {
        headers: {
          Authorization:
            token
        }
      })
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  };

  const createResume = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.post('/api/resume/create', { title })
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    if (!resume) {
      toast.error("Please select a resume file");
      return;
    }
    setIsLoading(true)
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText })
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false)
  };

  // Edit Resume 
  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put(`api/resume/update`, {
        resumeId: editResumeId,
        resumeData: { title }
      }, { headers: { Authorization: token } })
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? {
        ...resume,
        title
      } : resume))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }



  //Delete Resume
  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume?"
      );

      if (confirm) {
        const { data } = await api.delete(
          `/api/resume/delete/${resumeId}`,
          {
            headers: { Authorization: token },
          }
        );

        setAllResumes(
          allResumes.filter(
            (resume) => resume._id !== resumeId
          )
        );

        toast.success(data.message);
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };



  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-8 min-h-[calc(100vh-80px)] space-y-10 animate-in fade-in duration-500">

      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors mb-6 font-bold text-xs uppercase tracking-widest">
            <ArrowLeftSquare className="size-4" />
            Back to Home
          </button>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Welcome back, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Creator'}</span>! ✨
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium">
            Ready to craft your next career move?
          </p>
        </div>

        {/* Quick Stats Box */}
        <div className="flex gap-4">
          <div className="flex flex-col bg-white border border-slate-100 shadow-sm rounded-2xl px-6 py-4 min-w-[140px]">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Created</span>
            <span className="text-3xl font-black text-blue-600">
              {allResumes.filter(r => !r.professional_summary).length}
            </span>
          </div>
          <div className="flex flex-col bg-white border border-slate-100 shadow-sm rounded-2xl px-6 py-4 min-w-[140px]">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Parsed</span>
            <span className="text-3xl font-black text-slate-900">
              {allResumes.filter(r => r.professional_summary).length}
            </span>
          </div>
        </div>
      </div>

      {/* Action Row - 2 Columns */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Create Resume Button */}
          <button
            onClick={() => setShowCreateResume(true)}
            className="group relative overflow-hidden h-44 flex flex-col items-start justify-center p-8 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-100 hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-500 text-left border-none"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <PlusIcon size={120} strokeWidth={1} className="transform rotate-12 group-hover:rotate-90 transition-transform duration-700" />
            </div>
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
              <FilePenLineIcon className="size-8 text-white" />
            </div>
            <h3 className="text-2xl font-black leading-tight mb-1">Create New Resume</h3>
            <p className="text-blue-100 text-sm font-medium opacity-80">Build from scratch with AI assistance</p>
          </button>

          {/* Upload Resume Button */}
          <button
            onClick={() => setShowUploadResume(true)}
            className="group relative overflow-hidden h-44 flex flex-col items-start justify-center p-8 rounded-3xl bg-white border-2 border-slate-100 hover:border-blue-400 hover:bg-blue-50/30 text-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1 transition-all duration-500 text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <UploadCloudIcon size={120} strokeWidth={1} className="transform -rotate-12 transition-transform duration-700" />
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl mb-4 group-hover:bg-blue-100 transition-colors">
              <UploadCloudIcon className="size-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black leading-tight mb-1">Upload Existing</h3>
            <p className="text-slate-500 text-sm font-medium">Import from PDF and let AI parse it</p>
          </button>
      </div>

      {/* Your Documents Section - Split Categories */}
      <div className="space-y-16">
        
        {/* Category 1: Created from Scratch */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Created Resumes</h2>
               <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">
                 {allResumes.filter(r => !r.professional_summary).length}
               </span>
            </div>
            <div className="h-px flex-1 bg-slate-100 mx-6 hidden sm:block"></div>
          </div>

          {allResumes.filter(r => !r.professional_summary).length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center min-h-[200px] text-center">
              <p className="text-slate-400 font-medium">No resumes created from scratch yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allResumes.filter(r => !r.professional_summary).map((resume) => (
                <DocumentCard key={resume._id} resume={resume} navigate={navigate} setEditResumeId={setEditResumeId} setTitle={setTitle} deleteResume={deleteResume} />
              ))}
            </div>
          )}
        </section>

        {/* Category 2: Uploaded/Parsed */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Uploaded Resumes</h2>
               <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-md">
                 {allResumes.filter(r => r.professional_summary).length}
               </span>
            </div>
            <div className="h-px flex-1 bg-slate-100 mx-6 hidden sm:block"></div>
          </div>

          {allResumes.filter(r => r.professional_summary).length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center min-h-[200px] text-center">
              <p className="text-slate-400 font-medium">No resumes uploaded from PDF yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allResumes.filter(r => r.professional_summary).map((resume) => (
                <DocumentCard key={resume._id} resume={resume} navigate={navigate} setEditResumeId={setEditResumeId} setTitle={setTitle} deleteResume={deleteResume} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Create Modal */}
      {showCreateResume && (
        <div onClick={() => setShowCreateResume(false)} className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={createResume}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200 relative"
          >
            <button type="button" onClick={() => { setShowCreateResume(false); setTitle(""); }} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
              <XIcon size={20} />
            </button>

            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-5 shrink-0">
              <PlusIcon size={24} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Resume</h2>
            <p className="text-slate-500 text-sm mb-6">Give your document a clear, recognizable title.</p>

            <input
              type="text"
              placeholder="e.g. Senior Developer - Google"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 mb-6 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-slate-400 font-medium"
              required
              autoFocus
            />

            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-md shadow-blue-200 transition-all flex items-center justify-center">
              Create Resume
            </button>
          </form>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadResume && (
        <div onClick={() => setShowUploadResume(false)} className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={uploadResume}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200 relative"
          >
            <button type="button" onClick={() => { setShowUploadResume(false); setTitle(""); setResume(null); }} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
              <XIcon size={20} />
            </button>

            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-5 shrink-0">
              <UploadCloudIcon size={24} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Resume PDF</h2>
            <p className="text-gray-500 text-sm mb-6">Our AI will automatically parse your PDF and build out your selected template.</p>

            <div className="mb-4 text-left">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Document Title</label>
              <input
                type="text"
                placeholder="Product Manager Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <label htmlFor="resume-input" className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all mb-6 group">
              <div className="flex flex-col items-center justify-center text-center">
                {resume ? (
                  <>
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                      <FilePenLineIcon size={24} />
                    </div>
                    <p className="font-semibold text-gray-900 truncate max-w-[200px]">{resume.name}</p>
                    <p className="text-xs text-green-600 mt-1">Ready for parsing</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <UploadCloudIcon size={24} />
                    </div>
                    <p className="font-semibold text-gray-900">Click to browse or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PDF format (max 5MB)</p>
                  </>
                )}
              </div>
            </label>

            <input
              type="file"
              id="resume-input"
              hidden
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
            />

            <button
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isLoading && <LoaderCircleIcon className="animate-spin size-5 text-white" />}
              {isLoading ? "Analyzing PDF..." : "Upload & Continue"}
            </button>
          </form>
        </div>
      )}

      {/* Edit Modal*/}
      {editResumeId && (
        <div onClick={() => setEditResumeId('')} className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={editTitle}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200 relative"
          >
            <button type="button" onClick={() => { setEditResumeId(''); setTitle(""); }} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
              <XIcon size={20} />
            </button>

            <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center mb-5 shrink-0">
              <PencilIcon size={24} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rename Resume</h2>
            <p className="text-gray-500 text-sm mb-6">Enter a new title for your document.</p>

            <input
              type="text"
              placeholder="Enter resume title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 mb-6 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all"
              required
              autoFocus
            />

            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-md shadow-blue-200 transition-all">
              Save Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
