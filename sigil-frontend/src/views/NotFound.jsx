import { Link } from "react-router-dom";
import BoxButton from "../components/BoxButton";

const NotFoundPage = () => {
    return (
        <>
            <img
                src="/Vampire_Castle.jpg"
                className="fixed inset-0 w-full h-full object-cover z-0 grayscale opacity-30"
                alt="Lost Archive"
            />
            <div className="fixed inset-0 bg-black/80 z-10"></div>
            <div className="fixed inset-0 pointer-events-none z-15 bg-[radial-gradient(circle,transparent_40%,black_120%)]"></div>

            <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 text-center">
                
                <h1 className="text-8xl md:text-9xl font-[Cinzel] font-black text-main-accent mb-2 tracking-widest drop-shadow-[0_0_20px_rgba(154,0,0,0.5)] animate-pulse">
                    404
                </h1>
                
                <p className="text-2xl md:text-4xl font-[Cinzel] text-parchment mb-4 uppercase tracking-widest">
                    The Void Gazes Back
                </p>
                <p className="text-sm md:text-base font-[Montserrat] text-parchment/60 max-w-md mb-10 leading-relaxed">
                    The ritual site you seek has been burned from the archives, or perhaps it never existed at all.
                </p>
                
                <Link to="/">
                    <BoxButton text="Return to the Registry" />
                </Link>
            </div>
        </>
    );
};

export default NotFoundPage;