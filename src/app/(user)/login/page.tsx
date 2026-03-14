"use client";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Announcement from "./Announcement";
import { useState } from "react";

const LoginPage = () => {
  // STATE 
  const [isSignIn, setIsSignIn] = useState(true);
  // HANDLE WINDOW TRANSACTION FROM SIGN IN AND SIGN UP 
  const handleToggle = (): void => {setIsSignIn(prev => !prev)};

  return (
    <div className="relative w-full min-h-screen 
                    bg-gradient-to-br from-[#121820] via-[#1E2734] to-[#121820] 
                    flex items-center justify-center p-6"
    >
      <div className="w-full max-w-[950px] h-[600px] 
                      bg-white/5 
                      rounded-[48px] 
                      shadow-[0_25px_50px_rgba(0,0,0,0.7)] 
                      backdrop-blur-xl 
                      border border-white/10
                      relative overflow-hidden 
                      p-0"
      >
        <div className="w-full h-full relative">
            <SignIn isSignIn={isSignIn} />
            <Announcement handleToggle={handleToggle} isSignIn={isSignIn}/>
            <SignUp isSignIn={isSignIn} handleToggle={handleToggle}/>
        </div>
      </div>
    </div>
  );
}

export default LoginPage