import SigilButton from "../SigilButton";

const Venue = ({ venue, onDeleteClick }) => {

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full border-l-2 border-main-accent bg-primary-bg gap-4 md:gap-6 p-4 md:p-6 mb-4 hover:bg-black/20 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center flex-1 w-full">
                <div className="flex flex-col border-b md:border-b-0 md:border-r border-parchment/20 px-2 py-2 pb-4 md:pb-2 md:pr-6 md:mr-4 shrink-0">
                    <h1 className="text-xl text-main-accent font-[Cinzel] leading-tight tracking-wider uppercase">{venue.name}</h1>
                    <h2 className="text-[10px] font-mono uppercase tracking-[0.3rem] text-parchment/40 mt-2">{venue.country}</h2>
                </div>

                <div className="px-2 py-4 md:py-0 flex flex-col gap-3 md:gap-2 text-parchment/50">
                    <div className="flex flex-col xl:flex-row xl:items-baseline gap-1 xl:gap-2">
                        <span className="text-[12px] font-mono uppercase text-main-accent/50 tracking-tighter">Site Coordinates:</span>
                        <div className="flex flex-wrap items-center gap-2 text-parchment font-[Montserrat] text-sm">
                            <span className="">{venue.city}</span>
                            <span className="">&middot;</span>
                            <span className="">{venue.address}</span>
                            <span className="">&middot;</span>
                            <span className="">{venue.postal_code}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono uppercase text-main-accent/50 tracking-tighter">Summoning Limit:</span>
                        <p className="text-parchment font-[Cinzel] text-lg leading-none">{venue.capacity}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center md:justify-end shrink-0 w-full md:w-auto mt-2 md:mt-0 px-2 md:px-0">
                <SigilButton text={"Delete Venue"} onClick={() => onDeleteClick(venue.id)} />
            </div>
        </div>
    );
}   

export default Venue;