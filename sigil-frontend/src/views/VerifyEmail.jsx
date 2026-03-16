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
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-secondary-bg">
            <div className="text-center p-10 border border-parchment/20 bg-primary-bg shadow-[0_0_20px_rgba(154,0,0,0.15)] max-w-md">
                <h1 className="text-3xl font-[Cinzel] mb-4 text-main-accent">
                    {status === "success" ? "Ritual Complete" : "Verification Failed"}
                </h1>
                
                <p className="font-[Montserrat] text-sm text-parchment/70 mb-8 leading-relaxed">
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
    );
};

export default VerifyEmail;