import { useState } from "react";
import axiosClient from "../services/axios-client";
import { redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../util/login/login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axiosClient.get("/sanctum/csrf-cookie"); // Get CSRF cookie

      await axiosClient.post("/api/login", { email, password });

      const userResponse = await axiosClient.get("/api/user");
      console.log("Logged in user:", userResponse.data);
      setUser(userResponse.data);
      //added so useEffect doesnt throw 401 errors every time we navigate to login page
      localStorage.setItem("isLoggedIn", "true");
      redirect("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <>
      <img
        src="/public/Vampire_Castle.jpg"
        className="fixed inset-0 w-full h-full object-cover z-0 grayscale "
      />
      <div className="fixed inset-0 bg-black/60 z-10"></div>

      <div
        className="relative min-h-screen w-full flex items-center justify-center
                    z-20
                "
      >
        <div
          className="relative w-96 h-96 bg-primary-bg border border-parchment/20
                    flex justify-center 
                    "
        >
          {/* Animation */}
          <div
            className="absolute -bottom-9 -left-0.6 w-[100.5%] h-10 bg-subtle-accent pointer-events-none"
            style={{
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 20%, 85% 90%, 75% 40%, 60% 80%, 50% 30%, 35% 100%, 25% 50%, 10% 85%, 0% 20%)",
            }}
          ></div>
          <div
            className="absolute left-[10%] -bottom-3 w-2 h-3 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"
            style={{ animationDelay: "3s" }}
          ></div>

          <div className="absolute left-[35%] -bottom-3 w-3 h-4 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"></div>

          <div
            className="absolute left-[70%] -bottom-3 w-2 h-3 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"
            style={{ animationDelay: "4s" }}
          ></div>

          <div
            className="absolute left-[90%] -bottom-3 w-3 h-4 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Form */}
          <form
            className="flex flex-col justify-center items-center text-parchment"
            onSubmit={handleLogin}
          >
            <h1 className="text-4xl font-[Cinzel] mb-8">Login</h1>
            {/* Email */}
            <div className="mb-5 flex flex-col">
              {/* <label for="email" className='mb-2 font-[Inter]'>Email:</label> */}
              <input
                name="email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-60 border border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none
                                "
              />
            </div>
            {/* Password */}
            <div className="mb-5 flex flex-col">
              {/* <label for="password" className='mb-2 font-[Inter]'>Password:</label> */}
              <input
                name="password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-60 border border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none
                                "
              />
            </div>
            {/* Submit */}
            <div className="my-5">
              <button
                type="submit"
                className="relative overflow-hidden
                                pl-8 pr-6 py-3 bg-main-accent text-primary-bg
                            [clip-path:polygon(15%_0%,100%_0%,85%_100%,0%_100%)] 
                            tracking-[0.15em] text-[10px] font-black uppercase
                            
                            before:content-[''] before:absolute before:inset-0
                            before:bg-parchment before:translate-y-[100%]
                            before:transition-transform before:duration-400 before:ease-in-out
                            hover:before:translate-y-0"
              >
                <span className="relative z-10">
                    Break the Seal
                </span>
              </button>
            </div>
            {error && <p className="text-danger-alert">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
