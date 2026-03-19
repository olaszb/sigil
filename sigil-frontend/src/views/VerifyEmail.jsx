/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosClient from "../services/axios-client";
import LoadingScreen from "../components/LoadingScreen";
import { toast } from "react-toastify";
import { toastConfig } from "../util/toastConfig";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); 

    useEffect(() => {
        const verifyRitual = async () => {
            const verificationUrl = searchParams.get("url");

            if (!verificationUrl) {
                setStatus("error");
                return;
            }

            try {
                await axiosClient.get(verificationUrl);
                
                setStatus("success");
                toast("Identity verified. The archives are open.", toastConfig);
                
                setTimeout(() => {
                    navigate("/");
                }, 2000);
                
            } catch (error) {
                console.error("Verification failed:", error);
                setStatus("error");
            }
        };

        verifyRitual();
    }, []);

    if (status === "verifying") return <LoadingScreen />;

    return (
        <>
            <img
                src="/Vampire_Castle.jpg"
                className="fixed inset-0 w-full h-full object-cover z-0 grayscale opacity-40"
            />
            <div className="fixed inset-0 bg-black/80 z-10"></div>
            <div className="fixed inset-0 pointer-events-none z-15 bg-[radial-gradient(circle,transparent_40%,black_120%)]"></div>

            <div className="relative z-20 w-full min-h-screen flex flex-col items-center justify-center px-4">
                
                <div className="text-center p-6 md:p-10 border border-parchment/20 bg-primary-bg shadow-[0_0_30px_rgba(154,0,0,0.3)] w-full max-w-md">
                    
                    <h1 className="text-2xl md:text-3xl font-[Cinzel] mb-4 text-main-accent">
                        {status === "success" ? "Ritual Complete" : "Verification Failed"}
                    </h1>
                    
                    <p className="font-[Montserrat] text-xs md:text-sm text-parchment/70 mb-8 leading-relaxed">
                        {status === "success" 
                            ? "Your sigil has been bound. You may now participate fully in the registry." 
                            : "The sigil is invalid, corrupted, or has expired. The seal remains unbroken."}
                    </p>

                    {status === "error" && (
                        <button 
                            onClick={() => navigate('/')} 
                            className="text-[10px] uppercase tracking-[0.2em] text-parchment hover:text-main-accent transition-colors border-b border-main-accent/30 pb-1"
                        >
                            Return to the Archives
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default VerifyEmail;