import { useState } from "react";
import Pet from "../components/Pet.jsx";
import { login as loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await loginApi(email);
    login(res.data.user, res.data.token);
    navigate("/channels");
  };


  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-[#f7f3ee] px-4">
        <div className="w-full max-w-[390px] flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">chat</h1>

            <Pet isFocused={isFocused}/>

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="mt-6 w-full px-8 py-3 rounded-full border border-gray-300 shadow-md outline-none text-center focus:border-[#9c7c5b] focus:ring-1 focus:ring-[#9c7c5b]"            />

            <button
                onClick={handleLogin}
                className="mt-6 w-full bg-[#9c7c5b] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-[#8b6e51] active:shadow-none transition-all duration-200"
            >
                Login with email
            </button>
      </div>
    </div>
  );
}