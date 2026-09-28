import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SigilButton from "../SigilButton";

const TicketItem = ({ ticket }) => {
    const navigate = useNavigate();
    const event = ticket.event;

    const getEventUrl = () => {
        if (!event) return "/events";

        if (event.deleted_at) {
            return `/archived-events/${event.slug}`;
        }

        const isPast = new Date(event.end_date) < new Date();
        
        return isPast ? `/past-events/${event.slug}` : `/events/${event.slug}`;
    }

    const handleDownload = () => {
        console.log("Downloading ticket:", ticket.ticket_code);
    }

    return (
        <div className="group relative flex flex-col lg:flex-row bg-primary-bg w-full max-w-6xl mb-4 border border-parchment/20
                hover:shadow-[10px_10px_0px_0px_rgba(154,0,0,1)]
                hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300
                overflow-hidden">
            
            {/* Ticket info */}
            <div className="flex-1 flex flex-col p-6 lg:pl-8 justify-center">
                <h2 className="text-xl lg:text-2xl font-[Cinzel] mb-3 text-parchment cursor-default group-hover:text-main-accent transition-colors duration-300">
                    {event ? event.title : "Unknown Event"}
                </h2>

                <div className="flex flex-col gap-1 text-xs font-[Montserrat] text-parchment/60 cursor-default">
                    <p>
                        <span className="text-parchment font-bold uppercase tracking-widest text-[10px]">Section:</span>
                        {ticket.section || "N/A"}
                    </p>

                    {ticket.row && ticket.column ? (
                        <p>
                            <span className="text-parchment font-bold uppercase tracking-widest text-[10px]">Seat: </span> 
                            Row {ticket.row}, Seat {ticket.column}
                        </p>
                    ) : (
                        <p>
                            <span className="text-parchment font-bold uppercase tracking-widest text-[10px]">Type: </span> 
                            Standing (General Admission)
                        </p>
                    )}

                    <p className="mt-3 text-[10px] uppercase tracking-widest text-main-accent">
                        Code: {ticket.ticket_code}
                    </p>
                </div>
            </div>

            {/* Actions Section (Right Side) */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 p-6 bg-[#0a0a0a] border-t lg:border-t-0 lg:border-l border-parchment/10 shrink-0">
                <button 
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-parchment/40 font-bold hover:text-main-accent transition-colors w-full lg:mb-2"
                >
                    <Download size={18} />
                    <span>Download</span>
                </button>
                
                <SigilButton 
                    text="Go To Event" 
                    onClick={() => navigate(getEventUrl())} 
                />
            </div>
        </div>
    );
}

export default TicketItem;