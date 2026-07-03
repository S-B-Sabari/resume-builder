import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home"
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import Account from './pages/Account'
import TemplatesPage from './pages/TemplatesPage'
import RecycleBin from './pages/RecycleBin'
import ATSScore from './pages/ATSScore'
import { useDispatch } from 'react-redux'
import api from './configs/api.js'
import { login, setLoading } from './app/features/authSlice.js'
import { Toaster } from 'react-hot-toast'

const App = () => {

  const dispatch = useDispatch()

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const { data } = await api.get('/api/users/data')
        if (data.user) {
          dispatch(login({ token, user: data.user }))
        }
        dispatch(setLoading(false))
      } else {
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message)

    }
  }

  useEffect(() => {
    getUserData()
  }, [])


  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='account' element={<Account />} />
          <Route path='templates' element={<TemplatesPage />} />
          <Route path='recycle-bin' element={<RecycleBin />} />
          <Route path='ats-score' element={<ATSScore />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        </Route>

        <Route path='view/:resumeId' element={<Preview />} />


      </Routes>
    </>
  )
}

export default App
