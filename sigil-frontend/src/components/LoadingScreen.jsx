import { LoaderPinwheel } from "lucide-react";

const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <LoaderPinwheel className="text-main-accent" size={48} style={{ animation: 'spin 3s linear infinite' }} />
            <p className="font-[Cinzel] text-parchment/50 tracking-[0.3em] animate-pulse">
                Consulting the Ancient Maps...
            </p>
        </div>
    );
}

export default LoadingScreen;