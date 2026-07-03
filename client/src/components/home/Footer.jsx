import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <>
            <footer className="flex flex-col items-center overflow-hidden gap-10 md:gap-16 
            py-16 px-6 md:px-16 lg:px-24 xl:px-32 text-[13px] text-gray-600 bg-slate-50 mt-10 border-t border-slate-200">
                <div className="flex flex-wrap justify-center items-start gap-10 md:gap-[60px] xl:gap-[120px] w-full max-w-6xl">
                    <Link to="/" className="flex items-center gap-2">
                        <img src='/logo.svg' alt='logo' className='h-9 w-auto'></img>
                    </Link>
                    <div>
                        <p className="text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-4">Product</p>
                        <ul className="space-y-3">
                            <li><a href="#home" className="hover:text-blue-600 transition font-medium">Home</a></li>
                            <li><a href="#features" className="hover:text-blue-600 transition font-medium">Features</a></li>
                            <li><a href="#testimonial" className="hover:text-blue-600 transition font-medium">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-4">Resources</p>
                        <ul className="space-y-3">
                            <li><a href="/" className="hover:text-blue-600 transition font-medium">Resume Examples</a></li>
                            <li><a href="/" className="hover:text-blue-600 transition font-medium">Cover Letter Examples</a></li>
                            <li><a href="/" className="hover:text-blue-600 transition font-medium">Career Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-slate-900 font-bold uppercase tracking-wider text-[11px] mb-4">Legal</p>
                        <ul className="space-y-3">
                            <li><a href="/" className="hover:text-blue-600 transition font-medium">Privacy Policy</a></li>
                            <li><a href="/" className="hover:text-blue-600 transition font-medium">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6 pt-10 border-t border-slate-200 w-full max-w-6xl">
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                        <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                        </a>
                    </div>
                    <p className="text-slate-400 font-medium whitespace-nowrap overflow-hidden">© 2026 Resume.builder | Built with career success in mind.</p>
                </div>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&display=swap');
            
                * {
                    font-family: 'Public Sans', sans-serif;
                }
            `}</style>

        </>
    )
}

export default Footer
