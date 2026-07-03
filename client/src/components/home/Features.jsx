import { Zap } from 'lucide-react';
import React from 'react'
import Title from "./Title";


const Features = () => {
    return (
        <div id='features' className='flex flex-col items-center py-20 px-6 md:px-16 lg:px-24 xl:px-40 scroll-mt-24 transition-all'>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 
          rounded-full px-4 py-1.5 uppercase tracking-widest mb-4">
                <Zap width={14} className="fill-blue-600" />
                <span>The Process</span>
            </div>

            <Title 
                title='Effortless Resume Creation' 
                description='Our streamlined 3-step process helps you land your next role faster with the power of professional design and AI optimization.'
            />

            <div className="grid md:grid-cols-3 gap-8 mt-12 w-full max-w-6xl">
                {/* Step 1 */}
                <div className="relative p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 text-6xl font-black text-slate-100 group-hover:text-blue-50 transition-colors">01</div>
                    <div className="relative z-10 space-y-4">
                        <div className="size-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Pick a Template</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Choose from our library of ATS-friendly templates designed by career experts to catch the recruiter's eye.
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 transition-all group overflow-hidden shadow-xl shadow-slate-100">
                    <div className="absolute top-0 right-0 p-4 text-6xl font-black text-slate-100 group-hover:text-blue-50 transition-colors">02</div>
                    <div className="relative z-10 space-y-4">
                        <div className="size-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Build with AI</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Our AI assistant helps you write professional summaries and bullet points that highlight your unique impact.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 text-6xl font-black text-slate-100 group-hover:text-blue-50 transition-colors">03</div>
                    <div className="relative z-10 space-y-4">
                        <div className="size-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Download & Apply</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Export your resume in PDF or Word format and start applying with confidence. Your data is always synced.
                        </p>
                    </div>
                </div>
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&display=swap');
            
                * {
                    font-family: 'Public Sans', sans-serif;
                }
            `}</style>
        </div>
    )
}

export default Features
