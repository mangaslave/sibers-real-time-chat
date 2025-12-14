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
            <h1 className="text-2xl font-bold mb-4 text-[#727272]">chat.</h1>

            <Pet isFocused={isFocused}/>

            <div className="w-full flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="min-w-11/12 h-12 rounded-full border border-gray-200 shadow-md outline-none text-center focus:ring-1"
                />
                
                <button
                    onClick={handleLogin}
                    className="w-full h-12 bg-gray-600 text-white rounded-full font-semibold shadow-lg active:shadow-none transition-all duration-200"
                >
                    Login
                </button>
            </div>
      </div>
    </div>
  );
}