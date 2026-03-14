const Announcement = ({ handleToggle, isSignIn }: { handleToggle: any, isSignIn: boolean }) => {
  return (
    <div className="
          w-1/2 h-full 
          flex flex-col items-center justify-center 
          px-10 text-center space-y-6 
          bg-gradient-to-br from-[#1e88e5] to-[#1565c0] 
          text-white shadow-2xl
          absolute
          transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) // Cải thiện transition
        "
      style={{

        left: isSignIn ? "50%" : "0%",
        zIndex: 1000,
        borderRadius: isSignIn ? "0 48px 48px 0" : "48px 0 0 48px",
      }}
    >
      {/* Title */}
      <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-md">
        {isSignIn ? "New Here?" : "Welcome Back!"}
      </h1>

      {/* Subtext */}
      <h3 className="text-base font-light text-white/90 leading-relaxed max-w-[300px]">
        {isSignIn 
            ? "Sign up to begin your journey with our top-tier CRM solution." 
            : "To keep managing your sales pipeline, please sign in."
        }
      </h3>

      {/* Button */}
      <button className="
            mt-6 px-10 py-3 bg-white text-[#1e88e5] font-bold rounded-full
            shadow-xl hover:shadow-2xl hover:scale-[1.05] 
            transition-all duration-300 ease-in-out border-2 border-white
          "
        onClick={handleToggle}
      >
        {isSignIn ? "Sign Up" : "Sign In"}
      </button>
    </div>
  )
}

export default Announcement