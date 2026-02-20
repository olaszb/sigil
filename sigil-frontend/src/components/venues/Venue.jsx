const Venue = ({ venue }) => {

    return (
        <div className="flex justify-between w-full border-l-2 border-main-accent bg-primary-bg gap-6 p-4">
            <div className="flex items-center">
                <div className="flex flex-col border-r border-parchment/20 px-2 py-2">
                    <h1 className="text-xl text-main-accent font-[Cinzel] leading-tight tracking-wider uppercase">{venue.name}</h1>
                    <h2 className="text-[10px] font-mono uppercase tracking-[0.3rem] text-parchment/40 mt-2">{venue.country}</h2>
                </div>

                <div className="px-2 flex flex-col gap-2 text-parchment/50 ">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[12px] font-mono uppercase text-main-accent/50 tracking-tighter">Site Coordinates:</span>
                        <div className="flex items-center gap-2 text-parchment font-[Montserrat] text-sm">
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

            <div className="my-3 flex justify-center">
                <button
                  className="relative overflow-hidden
                                    pl-8 pr-8 py-3 bg-main-accent text-primary-bg
                                [clip-path:polygon(15%_0%,100%_0%,85%_100%,0%_100%)] 
                                tracking-[0.15em] text-[10px] font-black uppercase
                                
                                before:content-[''] before:absolute before:inset-0
                                before:bg-parchment before:translate-y-[100%]
                                before:transition-transform before:duration-400 before:ease-in-out
                                hover:before:translate-y-0 hover:text-primary-bg"
                >
                  <span className="relative z-10">Delete Venue</span>
                </button>
            </div>
        </div>
    );
}   

export default Venue;