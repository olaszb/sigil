import { Key, Scroll, User } from "lucide-react";
import { useState } from "react";
import axiosClient from "../services/axios-client";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../util/register/register.css";
import { toast } from "react-toastify";
import { toastConfig } from "../util/toastConfig";
import SigilButton from "../components/SigilButton";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const { setUser } = useAuth();
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axiosClient.get("/sanctum/csrf-cookie");

            await axiosClient.post("/api/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            const userResponse = await axiosClient.get("/api/user");
            setUser(userResponse.data);
            //added so useEffect doesnt throw 401 errors every time we navigate to login page
            localStorage.setItem("isLoggedIn", "true");
            toast("Pact sealed successfully!", toastConfig);
            navigate("/profile");
        } catch (err) {
            setError("Registration failed. Please check your details.");
            console.error(err);
        }
    };

  return (
    <>
      {/* Background image */}
      <img
        src="/anor_londo.jpg"
        className="fixed inset-0 w-full h-full object-cover z-0 grayscale "
      />
      {/* Background effects */}
      <div className="fixed inset-0 bg-black/60 z-10"></div>
      <div className="fixed inset-0 pointer-events-none z-15 bg-[radial-gradient(circle,transparent_40%,black_120%)]"></div>

      <div
        className="relative min-h-screen w-full flex items-center justify-center
                    z-20
                "
      >
        <div
          className={`relative w-96 bg-primary-bg border border-parchment/20
                    flex justify-center transition-all duration-700 ease-in-out
                     ${step === 1 ? 'h-96' : 'h-120'} `}
        >
          {/* Animation */}
          <div
            className="absolute -bottom-9 -left-0.6 w-[100.5%] h-10 bg-subtle-accent pointer-events-none"
            style={{
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 20%, 85% 90%, 75% 40%, 60% 80%, 50% 30%, 35% 100%, 25% 50%, 10% 85%, 0% 20%)",
            }}/>
          <div
            className="absolute left-[10%] -bottom-3 w-2 h-3 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"
            style={{ animationDelay: "1s" }}/>

          <div className="absolute left-[35%] -bottom-3 w-3 h-4 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"/>
          
          <div
            className="absolute left-[70%] -bottom-3 w-2 h-3 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"
            style={{ animationDelay: "4s" }}/>

          <div
            className="absolute left-[90%] -bottom-3 w-3 h-4 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"
            style={{ animationDelay: "2s" }}/>

          {/* Form */}
          <form
            className="flex flex-col justify-center items-center text-parchment"
            onSubmit={handleRegister}>

            <h1 className="text-4xl font-[Cinzel] mb-4">Binding Ritual</h1>

            {/* Name */}
            <div className="mb-5 flex flex-col">
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">Identifier</label>
                <div className="relative group">
                    <div className="absolute right-2 bottom-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                        <User size={16}/>
                    </div>
                    <input
                        name="name"
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                        className="w-60 border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                        font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    />
                </div>
            </div>

            {/* Email */}
            <div className="mb-5 flex flex-col">
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">Sigil Address</label>
                <div className="relative group">
                    <div className="absolute right-2 bottom-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                        <Scroll size={16}/>
                    </div>
                    <input
                        name="email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-60 border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                        font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    />
                </div>
            </div>

            {/* Progress Button */}
            {step === 1 && (
                <button type="button" onClick={() => setStep(2)}
                className="text-[10px] border-b border-main-accent/50 font-mono uppercase tracking-[0.4em] text-main-accent hover:text-parchment hover:border-parchment/50 transition-colors duration-300"
                >
                    Continue the Ritual...
                </button>
            )}

            <div className={`transition-all duration-1000 overflow-hidden flex flex-col items-center 
                ${step === 2 ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>

                {/* Password */}
                <div className="mb-5 flex flex-col">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">Shadow Key</label>
                    <div className="relative group">
                        <div className="absolute bottom-2 right-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                            <Key size={16}/>
                        </div>
                        <input
                            name="password"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-60 border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                            font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none
                                            "
                        />
                    </div>
                </div>

                {/* Password Confirmation */}
                <div className="mb-5 flex flex-col">
                    <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">Confirm Key</label>
                    <div className="relative group">
                        <div className="absolute bottom-2 right-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                            <Key size={16}/>
                        </div>
                        <input
                            name="password_confirmation"
                            id="password_confirmation"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="Confirm Password"
                            required
                            className="w-60 border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                            font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none
                                            "
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="my-2">
                    <SigilButton type={"submit"} text={"Seal The Pact"} />
                </div>
            </div>

            {error && <p className="text-danger-alert">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;