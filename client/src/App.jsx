import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import ForgotPassword from './Components/ForgotPass'
import Dashboard from './Pages/Dashboard'
import UniversityDetail from './Pages/UniversityDetail'
import Profile from './Pages/Profile'
import EditProfile from './Pages/EditProfile'
import ResetPassword from './Pages/ResetPassword'
import ForgotPasswordEmail from './Components/ForgotPasswordEmail'
import ForgotPasswordOtp from './Components/ForgotPasswordOtp'
import ComparisonPage from './Components/UniComparision'
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password/email" element={<ForgotPasswordEmail />} />
          <Route path="/forgot-password/validation" element={<ForgotPasswordOtp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/university/:id" element={<UniversityDetail />} />
          <Route path="/university/comparision" element={<ComparisonPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
