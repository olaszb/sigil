import { LoaderPinwheel } from "lucide-react";

const LoadingScreen = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-secondary-bg relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(154,0,0,0.08)_0%,transparent_50%)]"></div>

            <div className="relative flex flex-col items-center z-10">
                <LoaderPinwheel 
                    className="text-main-accent animate-spin mb-6 drop-shadow-[0_0_10px_rgba(154,0,0,0.5)]" 
                    size={56} 
                    strokeWidth={1.5} 
                />
                
                <p className="font-[Cinzel] text-parchment/60 text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.4em] animate-pulse text-center px-4">
                    Consulting the Ancient Maps...
                </p>
            </div>
        </div>
    );
}

export default LoadingScreen;