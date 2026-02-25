import { useEffect } from "react";

const SigilModal = ({text, closeModal, onAction}) => {


    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleEsc);
        
        // Cleanup the listener when the component is unmounted
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeModal]);

    return (
        <div onClick={closeModal} className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-sm">
                <div onClick={(e) => e.stopPropagation()} className="bg-primary-bg border border-main-accent/50 p-8 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(154,0,0,0.2)] text-center">
                    <h2 className="text-2xl font-[Cinzel] text-main-accent mb-4">{text}</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={closeModal}
                            className="flex-1 px-4 py-2 border border-parchment/20 bg-main-accent hover:bg-parchment/10 transition-colors duration-300 uppercase tracking-widest text-[10px]"
                        >
                            No
                        </button>
                        <button
                            onClick={onAction}
                            className="flex-1 px-4 py-2 border border-parchment/20 bg-main-accent hover:bg-parchment/10 transition-colors duration-300 uppercase tracking-widest text-[10px]"
                        >
                            Yes
                        </button>
                    </div>
                </div> 
            </div>
    );
}

export default SigilModal;