import {
    ArrowLeftSquare,
    FilePenLineIcon,
    RotateCcwIcon,
    Trash2Icon,
    AlertOctagonIcon
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api.js";

const RecycleBin = () => {

    const { user, token } = useSelector(state => state.auth)
    const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

    const [deletedResumes, setDeletedResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const loadDeletedResumes = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get('/api/users/deleted-resumes', {
                headers: {
                    Authorization: token
                }
            })
            setDeletedResumes(data.resumes)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        } finally {
            setIsLoading(false);
        }
    };

    const restoreResume = async (resumeId) => {
        try {
            const { data } = await api.put(
                `/api/resume/restore/${resumeId}`,
                {},
                { headers: { Authorization: token } }
            );

            setDeletedResumes(deletedResumes.filter(resume => resume._id !== resumeId));
            toast.success(data.message);

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const permanentlyDeleteResume = async (resumeId) => {
        try {
            const confirm = window.confirm(
                "Are you sure you want to permanently delete this resume? This action cannot be undone."
            );

            if (confirm) {
                const { data } = await api.delete(
                    `/api/resume/permanent-delete/${resumeId}`,
                    { headers: { Authorization: token } }
                );

                setDeletedResumes(deletedResumes.filter(resume => resume._id !== resumeId));
                toast.success(data.message);
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        loadDeletedResumes();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-80px)]">

            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
                <div>
                    <button onClick={() => navigate('/app')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors mb-4 font-medium text-sm">
                        <ArrowLeftSquare className="size-5" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <Trash2Icon className="size-8 text-red-500" />
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Recycle Bin
                        </h1>
                    </div>
                    <p className="text-gray-500 text-lg mt-2">
                        Items here will sit until you restore them or permanently delete them.
                    </p>
                </div>

                <div className="flex bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-100 items-center gap-3">
                    <AlertOctagonIcon className="size-5 shrink-0" />
                    <p className="text-sm font-medium">Permanently deleted resumes cannot be recovered.</p>
                </div>
            </div>

            <div>
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : deletedResumes.length === 0 ? (
                    <div className="bg-white border text-center border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Trash2Icon size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Recycle Bin is empty</h3>
                        <p className="text-gray-500 max-w-sm mb-6">No recently deleted resumes found.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {deletedResumes.map((resume, index) => {
                            const baseColor = colors[index % colors.length];

                            return (
                                <div key={resume._id} className="group relative bg-white border border-red-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col min-h-[220px]">

                                    {/* Card Top / Graphic */}
                                    <div className="h-28 relative overflow-hidden p-4 bg-gray-50 opacity-75 grayscale group-hover:grayscale-0 transition-all">
                                        <div className="absolute -right-4 -top-4 opacity-10 blur-[2px]">
                                            <FilePenLineIcon size={120} style={{ color: baseColor }} />
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
                                            <FilePenLineIcon className="size-5" style={{ color: baseColor }} />
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 flex-1 flex flex-col border-t border-gray-100 bg-white z-10">
                                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate line-through text-opacity-70" title={resume.title}>
                                            {resume.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium mb-4">
                                            Template: <span className="capitalize">{resume.template || 'Classic'}</span>
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-dashed border-gray-100">
                                            <button
                                                onClick={() => restoreResume(resume._id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                                                title="Restore to Dashboard"
                                            >
                                                <RotateCcwIcon className="size-4" />
                                                Restore
                                            </button>

                                            <button
                                                onClick={() => permanentlyDeleteResume(resume._id)}
                                                className="p-1.5 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                                                title="Delete Permanently"
                                            >
                                                <Trash2Icon className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecycleBin;
