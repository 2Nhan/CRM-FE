"use client"
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';
import { userLoginType } from '@/lib/data.user';
import { User } from 'lucide-react';

import FetchingLoadingStatus from '@/components/FetchingLoadingStatus';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/providers/NotificationProvider';
import { useAuthentication } from '@/providers/AuthenticationProvider';

const SignIn = ({ isSignIn }: { isSignIn: boolean }) => {
  // INITIALIZE NOTIFICATION PROVIDER 
  const { showNotification } = useNotification();

  // INITIALIZE NAVIGATE FUNTION 
  const router = useRouter()

  // AUTHENTICATION PROVIDER
  const {
    loginLoading, userLogin
  } = useAuthentication();



  // STATE 
  const [username, setUsername] = useState<string>("letunhan");
  const [password, setPassword] = useState<string>("12345678");
  const [visible, setVisible] = useState(false);

  // RESET ALL STATE 
  const resetStateField = () => {
    setUsername("");
    setPassword("");
  }

  // HANDLE LOGIN BUTTON TOGGLE
  const handleLoginButtonToggle = async () => {
    const userLoginInput: userLoginType = {
      username: username,
      password: password,
    }

    const result = await userLogin(userLoginInput.username, userLoginInput.password);

    if (result) {
      if (result && result?.role === "USER") {
        router.push("/customers");
      }
      if (result && result.role === "ADMIN") {
        router.push("/sale-report");
      }
    }
  }

  const handleVisible = () => {
    setVisible(prev => !prev);
  }

  const inputContainerStyle = "w-full h-12 bg-white/10 rounded-xl px-4 flex items-center gap-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#1e88e5] focus-within:bg-white/20";
  const inputStyle = "w-full bg-transparent outline-none placeholder-gray-300 text-white";
  const iconStyle = { fontSize: '20px' };

  return (
    <div className="w-1/2 h-full px-12 flex flex-col justify-center space-y-4 absolute transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
      style={{
        left: isSignIn ? "0%" : "-50%",
        opacity: isSignIn ? 1 : 0.2,
        zIndex: isSignIn ? 900 : 800,
      }}
    >
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-white tracking-wide mb-2 drop-shadow-md">
        Sign In to Vera
      </h1>

      {/* Social Icons */}
      <div className="flex flex-row items-center justify-center gap-3 mb-2">
        {[GoogleIcon, GitHubIcon, LinkedInIcon, FacebookIcon].map((Icon, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center 
                   hover:bg-white hover:text-[#1e88e5] hover:scale-110 shadow-lg transition-all duration-300 cursor-pointer"
          >
            <Icon className="text-white/80" style={iconStyle} />
          </div>
        ))}
      </div>

      <p className="text-xs text-white/70 text-center opacity-80 mb-4">
        or use your email and password
      </p>

      {/* Input: Email */}
      <div className={inputContainerStyle}>
        <User className="text-white/70" style={iconStyle} />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className={inputStyle}
        />
      </div>

      {/* Input: Password */}
      <div className={inputContainerStyle}>
        {visible ?
          <VisibilityIcon className="text-white/70 cursor-pointer" onClick={handleVisible} style={iconStyle} />
          :
          <VisibilityOffIcon className="text-white/70 cursor-pointer" onClick={handleVisible} style={iconStyle} />
        }
        <input
          type={visible ? 'text' : 'password'}
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className={inputStyle}
        />
      </div>

      {/* Forgot Password */}
      <p className="text-xs text-white/70 text-center hover:text-white transition-colors duration-300 cursor-pointer pt-1">
        Forgot your password?
      </p>

      {/* Sign In Button */}
      {
        loginLoading ?
          <FetchingLoadingStatus loading={loginLoading} />
          :
          <button
            className="mt-6 bg-[#1e88e5] text-white rounded-full w-[150px] h-11 hover:bg-[#1565c0] 
               mx-auto shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 font-bold"
            onClick={handleLoginButtonToggle}
          >
            Sign In
          </button>
      }
    </div>
  )
}

export default SignIn