import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CallToAction = () => {
    const { user } = useSelector(state => state.auth)

  return (
    <div>
         <div id='cta' className='border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto px-10 sm:px-16 mt-16 scroll-mt-24'>
            <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-12 px-3 
            md:px-10 border-x border-dashed border-slate-200 py-16 sm:py-20 -mt-10 -mb-10 w-full relative overflow-hidden bg-slate-50/50">
                <div className="space-y-4">
                    <p className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight max-w-lg"> 
                        Your dream job is <span className="text-blue-600">one click</span> away.
                    </p>
                    <p className="text-slate-600 font-medium italic">Join 10,000+ people who built their careers with us.</p>
                </div>
                <Link to={user ? '/app' : '/app?state=register'} className="flex items-center gap-3 rounded-full py-4 px-10 bg-blue-600
                 hover:bg-blue-700 transition-all text-white font-bold text-lg shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95 group">
                    <span>Create My Resume</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                    className="size-5 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
            </div>
        </div>
      
    </div>
  )
}

export default CallToAction
