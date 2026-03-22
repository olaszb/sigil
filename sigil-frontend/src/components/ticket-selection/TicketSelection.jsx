import { Calendar, MapPin, X, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import XSVG from "../../util/icons/XSVG";
import SeatSVG from "../../util/icons/SeatSVG";

const TicketSelection = ({event, closeModal}) => {
    const [activePanelTier, setActivePanelTier] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState({});
    const [standingQuantities, setStandingQuantities] = useState({});

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleEsc);
        
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeModal]);

    const parsedLayout = (() => {
        if (!event?.venue?.layout) return null;
        let layout = event.venue.layout;
        if(typeof layout === 'string'){
            try { layout = JSON.parse(layout); } catch (e) {}
        }
        return layout;
    })();

    const getActiveSection = () => {
        if (!activePanelTier || !event?.venue?.layout?.sections) return null;
        return parsedLayout?.sections?.find(sec => sec.name === activePanelTier.section_name);
    }

    const activeSection = getActiveSection();

    const handleTierSelect = (tier) => {
        setActivePanelTier(tier);
    }

    const toggleSeat = (rId, cId) => {
        const seatId = `${rId}-${cId}`;
        const tierId = activePanelTier.id;

        setSelectedSeats(prev => {
            const tierSeats = prev[tierId] || [];

            if (tierSeats.includes(seatId)) {
                return { ...prev, [tierId]: tierSeats.filter(id => id !== seatId) };
            }

            const newState = { ...prev };
            Object.keys(newState).forEach(key => {
                newState[key] = newState[key].filter(id => id !== seatId);
            });
            
            newState[tierId] = [...(newState[tierId] || []), seatId];
            return newState;
        });
    }

    const updateStandingQuantity = (tierId, amount, maxAvailable) => {
        setStandingQuantities(prev => {
            const current = prev[tierId] || 0;
            const next = Math.max(0, Math.min(current + amount, maxAvailable));
            return { ...prev, [tierId]: next };
        });
    }

    const allSelectedSeats = Object.values(selectedSeats).flat();

    const { totalPrice, totalTickets } = (event?.ticket_types || []).reduce(
        (acc, tier) => {
            const seatCount = selectedSeats[tier.id]?.length || 0;
            const standingCount = standingQuantities[tier.id] || 0;
            const count = seatCount + standingCount;
            
            acc.totalTickets += count;
            acc.totalPrice += count * (parseFloat(tier.price) || 0);
            return acc;
        },
        { totalPrice: 0, totalTickets: 0 }
    );

    return (
        <div onClick={closeModal} className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-sm">
            <div onClick={(e) => e.stopPropagation()} className="flex flex-col w-full max-w-5xl max-h-[90vh] bg-primary-bg border border-main-accent/50 w-full mx-4 shadow-[0_0_50px_rgba(154,0,0,0.2)] text-center">
                {/* Top Section */}
                <div className="w-full flex flex-col flex-1 overflow-y-auto">
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
                    <div className="w-full bg-black/20 flex flex-col">
                        <div className="flex flex-col p-6 gap-4 w-full">
                            <h2 className="text-left font-[Cinzel] text-xl text-parchment/80 mb-2">Select Tickets</h2>
                            {event?.ticket_types?.map((tier) => {
                                const isSelected = activePanelTier?.id === tier.id;
                                const isSoldOut = tier.quantity_available <= 0;

                                const sectionDef = parsedLayout?.sections?.find(s => s.name === tier.section_name);
                                const userCount = sectionDef?.type === 'seated' ? (selectedSeats[tier.id]?.length || 0) : (standingQuantities[tier.id] || 0);

                                return (
                                    <div key={tier.id} onClick={() => !isSoldOut && handleTierSelect(tier)}
                                        className={`flex justify-between px-4 py-4 bg-black/40 border transition-all duration-400 overflow-hidden text-left
                                            ${isSoldOut ? 'opacity-50 cursor-not-allowed border-parchment/10' : 'cursor-pointer'}
                                            ${isSelected 
                                                ? 'border-main-accent shadow-[0_0_30px_rgba(153,0,0,0.2),8px_8px_0px_0px_rgba(153,0,0,0.5)] -translate-x-1 -translate-y-1' 
                                                : !isSoldOut ? 'border-main-accent/30 hover:border-main-accent/60 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(153,0,0,0.2),8px_8px_0px_0px_rgba(153,0,0,0.5)]' : ''}
                                            `}
                                        >
                                        <div className="flex flex-col">
                                            <p className="font-[Cinzel] text-lg text-parchment">
                                                <span className="mr-4">{tier.name}</span>
                                                {userCount > 0 && (
                                                    <span className="text-[10px] font-[Montserrat] bg-main-accent text-primary-bg px-2 py-0.5 font-bold uppercase tracking-widest">
                                                        {userCount} Selected
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-[10px] uppercase tracking-widest font-[Montserrat] text-parchment/50">Section: {tier.section_name}</p>
                                        </div>
                                        <div className="flex flex-col items-end justify-center">
                                            <p className="text-main-accent font-bold tracking-wider">{tier.price} Ft</p>
                                            <p className="text-[10px] uppercase tracking-widest text-parchment/40">
                                                {isSoldOut ? "Sold Out" : `${tier.quantity_available} Left`}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {activePanelTier && activeSection && (
                            <div className="flex flex-col p-6 w-full items-center justify-start bg-black/40 relative">
                                <button 
                                    onClick={() => setActivePanelTier(null)} 
                                    className="absolute top-4 right-4 text-parchment/40 hover:text-main-accent transition-colors"
                                    title="Close Panel"
                                >
                                    <XIcon size={24} />
                                </button>
                                <h2 className="font-[Cinzel] text-xl text-main-accent mb-6">
                                    {activeSection.type === 'seated' ? "Select Your Seats" : "Select Quantity"}
                                </h2>
                                <p className="text-xs text-parchment/50 font-[Montserrat] -mt-4 mb-6 uppercase tracking-widest">
                                    For: {activePanelTier.name}
                                </p>

                                {activeSection.type === 'seated' && (
                                    <div className="flex flex-col items-center w-full">
                                        <div className="overflow-x-auto max-w-full pb-4">
                                            <div className="inline-flex flex-col gap-2 p-4 bg-[#0a0a0a] border border-parchment/5 rounded-sm">
                                                <div className="w-full text-center border-b-2 border-main-accent/30 text-[10px] uppercase tracking-[0.5em] text-parchment/30 pb-2 mb-4">
                                                    The Stage
                                                </div>

                                                {Array.from({length: activeSection.rows}).map((_, rId) => (
                                                    <div key={`row-${rId}`} className="flex gap-2 justify-center">
                                                        {Array.from({length: activeSection.columns}).map((_, cId) => {
                                                            const seatId = `${rId}-${cId}`;
                                                            const isVoid = activeSection.void_seats?.includes(seatId);

                                                            const isSelectedByMe = (selectedSeats[activePanelTier.id] || []).includes(seatId);
                                                            const isSelectedElsewhere = !isSelectedByMe && allSelectedSeats.includes(seatId);

                                                            if(isVoid) return <div key={seatId} className="w-6 h-6 md:w-8 md:h-8"/>;

                                                            return (
                                                                <div key={seatId}
                                                                    onClick={() => toggleSeat(rId, cId)}
                                                                    title={`Row ${rId + 1}, Seat ${cId + 1}`}
                                                                    className={`w-6 h-6 md:w-8 md:h-8 cursor-pointer transition-all duration-300 flex items-center justify-center
                                                                        ${isSelectedByMe 
                                                                            ? 'text-main-accent scale-110 drop-shadow-[0_0_8px_rgba(153,0,0,0.8)]' 
                                                                            : isSelectedElsewhere ? "text-parchment/40 opacity-50 border border-parchment/20 bg-parchment/5" 
                                                                            : 'text-parchment/20 hover:text-parchment/60 hover:scale-105'}
                                                                        `}
                                                                    >
                                                                    {!isSelectedElsewhere ? <SeatSVG /> : <span className="text-[8px]">X</span>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Selection Status */}
                                        <div className="mt-4 flex gap-4 text-[10px] uppercase tracking-widest text-parchment/40">
                                            <span className="flex items-center gap-1.5"><div className="w-3 h-3 border border-parchment/20 bg-parchment/20"></div> Available</span>
                                            <span className="flex items-center gap-1.5"><div className="w-3 h-3 border border-main-accent bg-main-accent"></div> Selected ({(selectedSeats[activePanelTier.id] || []).length})</span>
                                        </div>
                                    </div>
                                )}
                                {activeSection.type === 'standing' && (
                                    <div className="flex flex-col items-center w-full py-4">
                                        <div className="flex items-center gap-8 bg-[#0a0a0a] border border-parchment/10 p-6 shadow-inner">
                                            <button 
                                                onClick={() => updateStandingQuantity(activePanelTier.id, -1, activePanelTier.quantity_available)}
                                                className="w-12 h-12 border border-main-accent/50 flex items-center justify-center text-main-accent hover:bg-main-accent hover:text-primary-bg transition-colors text-2xl"
                                            >
                                                -
                                            </button>
                                            
                                            <div className="flex flex-col items-center justify-center min-w-[80px]">
                                                <span className="text-4xl font-[Cinzel] text-parchment">
                                                    {standingQuantities[activePanelTier.id] || 0}
                                                </span>
                                            </div>

                                            <button 
                                                onClick={() => updateStandingQuantity(activePanelTier.id, 1, activePanelTier.quantity_available)}
                                                className="w-12 h-12 border border-main-accent/50 flex items-center justify-center text-main-accent hover:bg-main-accent hover:text-primary-bg transition-colors text-2xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
                {totalTickets > 0 && (
                    <div className="w-full shrink-0 bg-[#0a0a0a] border-t border-main-accent/50 p-4 md:px-8 flex justify-between items-center shadow-[0_-20px_50px_rgba(0,0,0,0.6)] z-20 animate-fade-in">
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] uppercase tracking-widest font-[Montserrat] text-parchment/60">
                                {totalTickets} Ticket{totalTickets > 1 ? 's' : ''} Selected
                            </span>
                            <span className="font-[Cinzel] text-2xl font-bold text-main-accent">{totalPrice} Ft</span>
                        </div>
                        <button 
                            onClick={() => console.log("Proceed to checkout!")}
                            className="py-2 px-4 border border-main-accent bg-main-accent/10 hover:bg-main-accent hover:shadow-[0_0_30px_rgba(153,0,0,0.5)] transition-all duration-300 text-parchment hover:text-primary-bg flex justify-center items-center group"
                        >
                            <span className="font-[Cinzel] text-lg font-bold">Checkout</span>
                        </button>
                    </div>
                )}
            </div> 
        </div>
    );
}

export default TicketSelection;