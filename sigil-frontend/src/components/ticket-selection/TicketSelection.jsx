import { Calendar, MapPin, X } from "lucide-react";
import { useEffect } from "react";
import XSVG from "../../util/icons/XSVG";

const TicketSelection = ({event, closeModal}) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleEsc);
        
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeModal]);

    return (
        <div onClick={closeModal} className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="flex flex-col min-w-6xl min-h-3xl bg-primary-bg border border-main-accent/50 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(154,0,0,0.2)] text-center">
                {/* Top Section */}
                <div className="flex flex-col items-start px-8 py-4 border-b border-main-accent/40 space-y-3 pb-4">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-4xl font-[Cinzel] text-main-accent">{event?.title}</h1>
                        <div onClick={closeModal} className="w-10 h-10 hover:text-main-accent transition-all duration-400">
                            <XSVG  />
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Calendar size={20} className="text-main-accent"/>
                        <p className="text-parchment/80">
                            {event?.start_time ? new Date(event.start_time).toLocaleDateString('en-US', {
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            }) : "Date TBD"}
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin size={20} className="text-main-accent mt-1"/>
                        <div className="font-[Montserrat] text-parchment/80 space-y-1 flex flex-col items-start">
                            <p className="text-xl font-medium text-parchment flex items-center gap-2"><span>{event?.venue?.name}</span></p>
                            <p className="text-sm italic">{event?.venue?.country}</p>
                            <p className="text-sm opacity-60">
                                {event?.venue?.city}, {event?.venue?.address}
                            </p>
                            <p className="text-[10px] tracking-tighter opacity-40 uppercase">
                                Portal Code: {event?.venue?.postal_code}
                            </p> 
                        </div>
                    </div>
                </div>
                {/* Tickets Section */}
                <div className="w-full bg-black/20">
                    <div className="flex flex-col p-8">
                        <div className="flex justify-between px-4 py-4 bg-black/40 border border-main-accent/50 shadow-[0_0_50px_rgba(154,0,0,0.2)]
                            hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300
                            overflow-hidden hover:shadow-[0_0_50px_rgba(154,0,0,0.2),10px_10px_0px_0px_rgba(153,0,0,0.5)]">
                            <div>
                                Normal
                            </div>
                            <div className="flex justify-between">
                                <p>8000 Ft</p>
                                <p>Sold</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    );
}

export default TicketSelection;