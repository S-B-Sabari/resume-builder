import React, { useState } from 'react';
import { UploadCloud, FileText, Briefcase, CheckCircle2, AlertTriangle, Info, Loader2, XCircle } from 'lucide-react';
import pdfToText from 'react-pdftotext';
import api from '../configs/api.js';
import toast from 'react-hot-toast';

const ATSScore = () => {
    const [file, setFile] = useState(null);
    const [parsedText, setParsedText] = useState("");
    const [jobDescription, setJobDescription] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults] = useState(null);

    const processFile = async (uploadedFile) => {
        setFile(uploadedFile);
        setResults(null);
        try {
            const text = await pdfToText(uploadedFile);
            setParsedText(text);
            toast.success("Resume data collected successfully. You can now add a job description and generate your score.");
        } catch (error) {
            toast.error("Failed to parse PDF text. Please ensure it's a readable document.");
            setParsedText("");
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            processFile(selectedFile);
        } else {
            toast.error("Please upload a valid PDF file.");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            processFile(droppedFile);
        } else {
            toast.error("Please upload a valid PDF file.");
        }
    };

    const runAtsScan = async (overrideText = parsedText) => {
        if (!overrideText) {
            toast.error("Please upload a valid resume and wait for it to process.");
            return;
        }

        setIsScanning(true);
        setResults(null);

        try {
            const response = await api.post('/api/ai/calculate-ats-score', {
                resumeText: overrideText,
                jobDescription: jobDescription
            });

            setResults(response.data);
            toast.success("Score generated!");
        } catch (error) {
            console.error("Scan error:", error);
            toast.error(error.response?.data?.message || "Failed to analyze resume. Please try again.");
        } finally {
            setIsScanning(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "text-emerald-500";
        if (score >= 60) return "text-amber-500";
        return "text-red-500";
    };

    const getScoreBg = (score) => {
        if (score >= 80) return "bg-emerald-50 border-emerald-100";
        if (score >= 60) return "bg-amber-50 border-amber-100";
        return "bg-red-50 border-red-100";
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
            
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ATS Scanner</h1>
                <p className="text-slate-500 mt-2 text-lg">Upload your resume and a target job description to see how well you match.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Inputs Section */}
                <div className="space-y-6">
                    {/* File Upload */}
                    <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`relative group border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${file ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                    >
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        
                        {file ? (
                            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                                <div className="p-4 bg-blue-100 rounded-full shadow-sm">
                                    <FileText className="w-10 h-10 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-700 text-lg">{file.name}</h3>
                                    <p className="text-blue-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button className="mt-2 text-sm font-semibold text-primary-600 z-20 relative pointer-events-auto hover:text-primary-700">Change File</button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
                                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-primary-500 transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Upload your resume</h3>
                                    <p className="text-slate-500 mt-1">Drag and drop or click to browse</p>
                                    <p className="text-slate-400 text-sm mt-2">Only PDF files are supported</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Job Description */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="w-5 h-5 text-slate-400" />
                            <h3 className="font-bold text-slate-800">Target Job Description (Optional)</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">Paste the job description here to get a tailored ATS match score and specific keyword recommendations.</p>
                        <textarea 
                            className="w-full min-h-[200px] p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-y text-slate-700"
                            placeholder="Paste job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => runAtsScan()}
                        disabled={!file || isScanning}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 text-lg"
                    >
                        {isScanning ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Generating Score...
                            </>
                        ) : (
                            "Generate ATS Score"
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="relative">
                    {/* Placeholder when no results */}
                    {!results && !isScanning && (
                        <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8 z-10">
                            <div className="grid grid-cols-2 gap-4 opacity-30 pointer-events-none w-full max-w-sm mb-8">
                                <div className="h-24 bg-slate-300 rounded-xl"></div>
                                <div className="h-24 bg-slate-300 rounded-xl"></div>
                                <div className="h-32 col-span-2 bg-slate-300 rounded-xl"></div>
                            </div>
                            <h3 className="font-bold text-slate-800 text-xl">Awaiting Resume</h3>
                            <p className="text-slate-500 mt-2 max-w-xs">Upload your resume to automatically generate your detailed ATS match report.</p>
                        </div>
                    )}

                    {/* Results Content */}
                    {results && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            
                            {/* Score Card */}
                            <div className={`rounded-2xl p-8 border text-center ${getScoreBg(results.score)}`}>
                                <h3 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">ATS Score</h3>
                                <div className="relative inline-flex items-center justify-center">
                                    <svg className="w-40 h-40 transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/5 opacity-10" />
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * results.score) / 100} strokeLinecap="round" className={`${getScoreColor(results.score)} transition-all duration-1000 ease-out`} />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className={`text-5xl font-black ${getScoreColor(results.score)}`}>{results.score}</span>
                                        <span className="text-slate-500 font-bold mt-1">%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* Matched Keywords */}
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        <h4 className="font-bold text-slate-800">Matched Keywords</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {results.matchingKeywords?.map((kw, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100 rounded-lg">{kw}</span>
                                        )) || <span className="text-slate-400 text-sm">None identified</span>}
                                    </div>
                                </div>

                                {/* Missing Keywords */}
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <XCircle className="w-5 h-5 text-red-500" />
                                        <h4 className="font-bold text-slate-800">Missing Keywords</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {results.missingKeywords?.map((kw, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 text-sm font-medium border border-red-100 rounded-lg">{kw}</span>
                                        )) || <span className="text-slate-400 text-sm">None identified</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Sub Scores */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                    <h4 className="font-bold text-slate-800 text-sm mb-2">Section Score</h4>
                                    <span className={`text-3xl font-black ${getScoreColor(results.sectionScore)}`}>{results.sectionScore || 0}/100</span>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                    <h4 className="font-bold text-slate-800 text-sm mb-2">Formatting Score</h4>
                                    <span className={`text-3xl font-black ${getScoreColor(results.formattingScore)}`}>{results.formattingScore || 0}/100</span>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                    <h4 className="font-bold text-slate-800 text-sm mb-2">Content Score</h4>
                                    <span className={`text-3xl font-black ${getScoreColor(results.contentScore)}`}>{results.contentScore || 0}/100</span>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Info className="w-24 h-24 text-blue-500" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-blue-500" />
                                        Suggestions to Improve ATS Score:
                                    </h4>
                                    <ul className="space-y-3">
                                        {results.improvementTips?.map((item, i) => (
                                            <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                                                <span className="text-blue-500 font-bold">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ATSScore;
