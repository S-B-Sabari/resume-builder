import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, User, Menu } from 'lucide-react'
import { logout } from "../app/features/authSlice";

const CustomAccountIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
        {/* Background Circle */}
        <circle cx="32" cy="32" r="32" fill="#DCE9FA" />

        {/* Suit / Shoulders */}
        <path fill="#4C789B" d="M12 56c0-12 8-18 20-18s20 6 20 18v8H12v-8z" />

        {/* Collar / Shirt */}
        <path fill="#FFF" d="M26 38l6 10 6-10-6-4-6 4z" />
        <path fill="#F0F5FA" d="M18 56c0-8 6-12 14-12s14 4 14 12v8H18v-8z" opacity="0.3" />

        {/* Tie */}
        <path fill="#F26B6B" d="M29 44l3-2 3 2 1 10-4 6-4-6 1-10z" />

        {/* Neck */}
        <path fill="#FFDBC9" d="M28 32h8v8h-8z" />

        {/* Face */}
        <path fill="#FFE5D6" d="M22 18c0-8 4-12 10-12s10 4 10 12v8c0 6-4 10-10 10s-10-4-10-10v-8z" />
        <path fill="#FFDBC9" d="M22 24c0 4 2 8 10 8s10-4 10-8v-2H22v2z" opacity="0.5" />

        {/* Hair */}
        <path fill="#2E4F6B" d="M24 16c-2 0-4 2-4 4v2c0-4 2-8 6-8h12c4 0 6 4 6 8v-2c0-2-2-4-4-4-2-2-6-4-10-4s-8 2-6 4z" />
        <path fill="#2E4F6B" d="M20 20c0 4 2 8 4 8h-2c-2 0-4-4-4-8v-8c0-4 4-8 10-8h8c6 0 10 4 10 8v8c0 4-2 8-4 8h-2c2 0 4-4 4-8v-6H20v6z" />
    </svg>
);

const CustomLogoutIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={className}>
        <circle cx="32" cy="32" r="32" fill="#FA4646" />
        {/* Box with an opening */}
        <path fill="none" stroke="#FFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            d="M26 44v4c0 2.2 1.8 4 4 4h12c2.2 0 4-1.8 4-4V16c0-2.2-1.8-4-4-4H30c-2.2 0-4 1.8-4 4v4" />
        {/* Arrow pointing out */}
        <path fill="none" stroke="#FFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            d="M22 32h20M34 24l8 8-8 8" />
    </svg>
);



const Navbar = ({ onMenuClick }) => {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const logoutUser = () => {
        dispatch(logout())
        navigate('/')
    }

    return (
        <div className='bg-white border-b border-slate-100 shadow-sm'>
            <nav className='flex items-center justify-between py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm transition-all'>
                <div className='flex items-center gap-2'>
                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className='md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center'
                        >
                            <Menu size={24} />
                        </button>
                    )}
                    <Link to='/' className="flex items-center gap-2">
                        <img src="/logo.svg" alt="logo" className='h-9 w-auto' />
                    </Link>
                </div>
                <div className='flex items-center gap-4 text-sm relative' ref={dropdownRef}>
                    {user ? (
                        <div className='flex items-center gap-6'>
                            <Link to='/app' className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-full text-white font-semibold shadow-md shadow-blue-200 hidden sm:block'>
                                Dashboard
                            </Link>

                            <div className='relative'>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className='flex items-center gap-2 hover:bg-slate-50 border border-transparent
                                 hover:border-gray-200 px-3 py-1.5 rounded-full transition-all'
                                >
                                    <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center 
                                 justify-center font-bold overflow-hidden border border-gray-100'>
                                        {user.image ? (
                                            <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : user.name ? (
                                            user.name.charAt(0).toUpperCase()
                                        ) : (
                                            <User size={16} />
                                        )}
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <span className='font-medium text-gray-700 max-sm:hidden'>{user.name}</span>
                                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ?
                                            'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className='absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border
                                 border-gray-100 py-2 z-50 transform origin-top-right transition-all'>
                                        <div className='px-4 py-3 border-b border-gray-50 mb-1'>
                                            <p className='text-sm font-semibold text-gray-800 truncate '>{user.name}</p>
                                            <p className='text-xs text-gray-500 truncate mt-0.5'>{user.email}</p>
                                        </div>
                                        <div className='px-2 pb-1 border-b border-gray-50 mb-1'>
                                            <Link
                                                to='/app/account'
                                                onClick={() => setIsDropdownOpen(false)}
                                                className='w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors text-left'
                                            >
                                                <CustomAccountIcon className="size-[18px]" />
                                                <span>Account</span>
                                            </Link>
                                        </div>
                                        <div className='px-2'>
                                            <button
                                                onClick={() => {
                                                    logoutUser();
                                                    setIsDropdownOpen(false);
                                                }}
                                                className='w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 font-bold
                                             hover:bg-red-50 rounded-lg transition-colors text-left'
                                            >
                                                <CustomLogoutIcon className="size-[18px]" />
                                                <span>Log out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='flex gap-2'>
                            {/* Placeholder for unauthenticated state if needed, though usually handled by App level routing */}
                        </div>
                    )}
                </div>

            </nav>

        </div>
    )
}

export default Navbar
