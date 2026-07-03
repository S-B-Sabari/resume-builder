import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector, useDispatch } from 'react-redux'
import { Loader, Menu, X } from 'lucide-react'
import Login from './Login'
import { logout } from '../app/features/authSlice'

const CustomDashboardIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="#1a91f0"
    className={className}
  >
    <rect x="2" y="2" width="9" height="11" rx="2.5" />
    <rect x="2" y="15" width="9" height="7" rx="2.5" />
    <rect x="13" y="2" width="9" height="7" rx="2.5" />
    <rect x="13" y="11" width="9" height="11" rx="2.5" />
  </svg>
);

const CustomTemplatesIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    className={className}
  >
    <path fill="#e27040" d="M12.4 12.4h86.9v487.2H12.4z" />
    <path fill="#f2f2f2" d="M37.2 49.6h37.2v12.4H37.2zm0 37.2h62.1v12.4H37.2zm0 37.2h49.6v12.4H37.2z" />
    <path fill="#a3a3a3" d="M174 12.4h325.6v111.6H174z" />
    <path fill="#f2f2f2" d="M211.2 37.2h251v18.6H211.2zm0 43.4h86.8v18.6h-86.8z" />
    <path fill="#85cbf9" d="M174 161.4h148.9v186.2H174z" />
    <path fill="#f2f2f2" d="M211.2 198.6h74.4v12.4h-74.4zm0 37.2h74.4v12.4h-74.4zm0 37.2h74.4v12.4h-74.4z" />
    <path fill="#fddb4b" d="M360.2 161.4h148.9v186.2H360.2z" />
    <path fill="#f2f2f2" d="M397.4 198.6h74.4v12.4h-74.4zm0 37.2h74.4v12.4h-74.4zm0 37.2h74.4v12.4h-74.4z" />
    <path fill="#addd66" d="M174 384.8h335v114.8H174z" />
    <path fill="#f2f2f2" d="M211.2 415.8h260.6v12.4H211.2zm161.4 34.2h99.2v12.4h-99.2z" />
  </svg>
);

const CustomATSScoreIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="#f0edf6" />
    <path d="M12 2a10 10 0 0 1 10 10" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
    <text x="12" y="16.5" fontSize="11" fontWeight="900" fill="#8b5cf6" textAnchor="middle" style={{fontFamily: 'system-ui, sans-serif'}}>95</text>
  </svg>
);

const CustomRecycleBinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
    {/* Bin Handle */}
    <path fill="#71c3ff" stroke="#000" strokeWidth="3" strokeLinejoin="round" d="M22 17V9c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v5" />
    {/* Bin Lid */}
    <path fill="#2e2e2e" stroke="#000" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" d="M8 24l47-14 3 9-47 14z" />
    {/* Bin Body */}
    <path fill="#71c3ff" stroke="#000" strokeWidth="3" strokeLinejoin="round" d="M14 28l3 32h30l3-32" />
    {/* Slits */}
    <rect x="23" y="34" width="4" height="20" rx="2" fill="#2e2e2e" />
    <rect x="30" y="34" width="4" height="20" rx="2" fill="#2e2e2e" />
    <rect x="37" y="34" width="4" height="20" rx="2" fill="#2e2e2e" />
  </svg>
);

const CustomLogoutIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
    <circle cx="32" cy="32" r="32" fill="#FA2C4B" />
    <path stroke="#FFF" strokeWidth="6" strokeLinecap="round" d="M32 16v16" />
    <path stroke="#FFF" strokeWidth="6" strokeLinecap="round" fill="none" d="M21 21.5a16 16 0 1 0 22 0" />
  </svg>
);

const Layout = () => {

  const { user, loading } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const location = useLocation();

  const logoutUser = () => {
    dispatch(logout())
    navigate('/')
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      {
        user ? (
          <div className='flex flex-col h-screen bg-gray-50 overflow-hidden font-sans text-gray-900'>

            {/* Top Navbar */}
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            <div className='flex flex-1 overflow-hidden relative'>
              {/* Mobile Sidebar Overlay */}
              {isSidebarOpen && (
                <div
                  className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden'
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              {/* Sidebar */}
              <aside
                className={`w-[280px] bg-gray-100 border-r border-gray-200 overflow-y-auto fixed md:relative z-50 h-[calc(100vh-73px)] 
                  transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col 
                  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
              >
                <div className='p-6 flex items-center justify-between md:hidden border-b border-slate-50'>
                  <span className='font-bold text-lg tracking-tight text-slate-900'>Navigation</span>
                  <button
                    className='text-slate-400 hover:text-slate-900 p-2 hover:bg-slate-50 rounded-lg transition-all'
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className='p-6 mt-2'>
                  <p className='text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-6 px-3'>Main Menu</p>
                  <nav className='space-y-2 flex flex-col'>
                    <Link
                      to='/app'
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === '/app' || location.pathname === '/app/'
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-200'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                      <CustomDashboardIcon className={`size-5 ${location.pathname === '/app' || location.pathname === '/app/' ? 'brightness-200' : 'text-slate-400'}`} />
                      Dashboard
                    </Link>
                    <Link
                      to='/app/templates'
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === '/app/templates' || location.pathname === '/app/templates/'
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-200'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                      <CustomTemplatesIcon className={`size-5 ${location.pathname.includes('templates') ? 'brightness-125' : ''}`} />
                      Templates
                    </Link>
                    <Link
                      to='/app/ats-score'
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === '/app/ats-score' || location.pathname === '/app/ats-score/'
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-200'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                      <CustomATSScoreIcon className={`size-5 ${location.pathname.includes('ats-score') ? 'brightness-125' : ''}`} />
                      ATS Score
                    </Link>


                  </nav>
                </div>

                {/* Bottom Menu Items */}
                <div className='p-6 mt-auto border-t border-gray-200 bg-gray-200/20'>
                  <nav className='space-y-2 flex flex-col'>
                    <Link
                      to='/app/recycle-bin'
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === '/app/recycle-bin'
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-200'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                      <CustomRecycleBinIcon className={`size-5 ${location.pathname.includes('recycle-bin') ? 'brightness-125' : ''}`} />
                      Recycle Bin
                    </Link>
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsSidebarOpen(false);
                      }}
                      className='flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-medium'
                    >
                      <CustomLogoutIcon className="size-5" />
                      Log out
                    </button>
                  </nav>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className='flex-1 flex flex-col min-w-0'>
                <main className='flex-1 overflow-y-auto w-full'>
                  <Outlet />
                </main>
              </div>
            </div>
          </div>
        ) : <Login />
      }

    </div>
  )
}

export default Layout
