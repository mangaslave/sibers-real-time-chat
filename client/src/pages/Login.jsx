import { useState } from "react";
import Pet from "../components/Pet.jsx";
import { login as loginApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

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
        <div className="w-full max-w-97.5 flex flex-col items-center">
            <h1 className="text-6xl font-bold mb-12 text-[#727272] px-4">chat.</h1>

            <Pet isFocused={isFocused}/>

            <div className="w-full flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="min-w-11/12 h-12 rounded-full shadow-md outline-none text-center text-[#727272]"
                />
                
                <button
                    onClick={handleLogin}
                    className="w-full h-12 text-white bg-[#727272] rounded-full font-semibold shadow-lg active:shadow-none transition-all duration-200 hover:bg-[#ddb665]"
                >
                    Login
                </button>
            </div>
      </div>
    </div>
  );
}