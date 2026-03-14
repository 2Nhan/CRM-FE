import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import { UserSignUpType } from '@/lib/data.user';
import FetchingLoadingStatus from '@/components/FetchingLoadingStatus';
import { useAuthentication } from '@/providers/AuthenticationProvider';

interface Props {
  isSignIn: boolean;
  handleToggle: () => void;
}

// CHECK SIGN UP DATA FIELDS
const checkSignUpInput = (newSignUp: UserSignUpType): boolean => {
  const { firstName, lastName, userName, phone, email, password } = newSignUp;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{9,11}$/; 
  const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;

  if (!firstName.trim() || !lastName.trim() || !userName.trim() || !phone.trim() || !email.trim() || !password.trim()) {
    alert("Some fields are empty.");
    return false;
  }

  if (!usernameRegex.test(userName)) {
    alert("Invalid username format. Only letters, numbers, dot, underscore, and hyphen allowed (3–20 chars).");
    return false;
  }

  if (!phoneRegex.test(phone)) {
    alert("Invalid phone number. Must be 9–11 digits.");
    return false;
  }

  if (!emailRegex.test(email)) {
    alert("Invalid email format.");
    return false;
  }

  if (password.length < 6) {
    alert("Password too short. Must be at least 6 characters.");
    return false;
  }
  return true;
};

const SignUp = ({ isSignIn, handleToggle }: Props) => {
  const [visible, setVisible] = useState(false);
  const handleVisible = () => setVisible((prev) => !prev);

  // STATE 
  const [inputFirstName, setInputFirstName] = useState<string>("");
  const [inputLastName, setInputLastName] = useState<string>("");
  const [inputUserName, setInputUserName] = useState<string>("");
  const [inputPhone, setInputPhone] = useState<string>("");
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  // RESET ALL STATE FIELDS 
  const resetStateField = () => {
    setInputFirstName("");
    setInputLastName("");
    setInputUserName("");
    setInputPhone("");
    setInputEmail("");
    setInputPassword("");
  }

  // AUTHENTICATION PROVIDER 
  const { signUpLoading, userSignUp} = useAuthentication();

  /**
   * Sign up button - handle user click on confitm sign up 
   */
  const handleSubmitButton = async () => {
    const newSignUp: UserSignUpType = {
      lastName: inputLastName,
      firstName: inputFirstName,
      userName: inputUserName,
      password: inputPassword,
      email: inputEmail,
      phone: inputPhone,
    }

    if (!checkSignUpInput(newSignUp)){return;}

    const success = await userSignUp(inputUserName, inputPassword, inputFirstName, inputLastName, inputEmail, inputPhone);

    if(success){
      resetStateField();
    }

  } 

  const inputContainerStyle = "w-full h-10 bg-white/10 rounded-lg px-4 flex items-center gap-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#1e88e5] focus-within:bg-white/20";
  const inputStyle = "w-full bg-transparent outline-none placeholder-gray-300 text-white";
  const iconStyle = { fontSize: '20px' };

  return (
    <div
      className="w-1/2 h-full px-12 flex flex-col justify-center space-y-3 absolute transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
      style={{
        left: isSignIn ? "100%" : "50%",
        opacity: isSignIn ? 0.2 : 1, 
        zIndex: isSignIn ? 800 : 900,
      }}
    >
      <h1 className="text-3xl font-bold text-center text-white tracking-wide mb-1 drop-shadow-md">
        Create Your Account
      </h1>
      <p className="text-xs text-white/70 text-center mb-4">
        Enter your details to register
      </p>

      {/* FIRST + LAST NAME */}
      <div className="flex flex-row gap-3">
        <div className={inputContainerStyle}>
          <input
            disabled={signUpLoading}
            type="text"
            placeholder="First Name"
            value={inputFirstName}
            onChange={(e) => setInputFirstName(e.target.value)}
            className={inputStyle}
          />
        </div>
        <div className={inputContainerStyle}>
          <input
            disabled={signUpLoading}
            type="text"
            placeholder="Last Name"
            value={inputLastName}
            onChange={(e) => setInputLastName(e.target.value)}
            className={inputStyle}
          />
        </div>
      </div>

      {/* USERNAME */}
      <div className={inputContainerStyle}>
        <PersonIcon className="text-white/70" style={iconStyle} />
        <input
          disabled={signUpLoading}
          type="text"
          placeholder="Username"
          value={inputUserName}
          onChange={(e) => setInputUserName(e.target.value)}
          className={inputStyle}
        />
      </div>

      {/* PHONE */}
      <div className={inputContainerStyle}>
        <PhoneIphoneIcon className="text-white/70" style={iconStyle} />
        <input
          disabled={signUpLoading}
          type="text"
          placeholder="Phone Number"
          value={inputPhone}
          onChange={(e) => setInputPhone(e.target.value)}
          className={inputStyle}
        />
      </div>

      {/* EMAIL */}
      <div className={inputContainerStyle}>
        <EmailIcon className="text-white/70" style={iconStyle} />
        <input
          disabled={signUpLoading}
          type="text"
          placeholder="Email Address"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
          className={inputStyle}
        />
      </div>

      {/* PASSWORD */}
      <div className={inputContainerStyle}>
        {visible ? (
          <VisibilityIcon
            className="text-white/70 cursor-pointer"
            onClick={handleVisible}
            style={iconStyle}
          />
        ) : (
          <VisibilityOffIcon
            className="text-white/70 cursor-pointer"
            onClick={handleVisible}
            style={iconStyle}
          />
        )}
        <input
          disabled={signUpLoading}
          type={visible ? "text" : "password"}
          placeholder="Password (min 6 chars)"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          className={inputStyle}
        />
      </div>

      {/* BUTTON */}
      {signUpLoading ? (
        <FetchingLoadingStatus loading={signUpLoading} />
      ) : (
        <div className='flex justify-center'>
          <button
            disabled={signUpLoading}
            className={`mt-100 bg-[#1e88e5] text-white rounded-full w-[150px] h-11
                     ${signUpLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1565c0]"}
                     mx-auto shadow-xl hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 font-bold`}
            onClick={handleSubmitButton}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUp;