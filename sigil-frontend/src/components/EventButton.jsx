const EventButton = ({text, onClick}) => {

    return (
        <div className="absolute top-0 right-0">
          <button onClick={() => onClick()}
            className="relative overflow-hidden
                      pl-8 pr-6 py-3 bg-main-accent text-primary-bg
                      [clip-path:polygon(0%_0%,100%_0%,100%_100%,15%_100%)] 
                      tracking-[0.15em] text-[10px] font-black uppercase
                      
                      before:content-[''] before:absolute before:inset-0
                      before:bg-parchment before:translate-y-[100%]
                      before:transition-transform before:duration-400 before:ease-in-out
                      hover:before:translate-y-0
                      
                      "
          >
            <span className="relative z-10 hover:text-primary-bg transition-colors duration-300">
              {text}
            </span>
          </button>
        </div>
    );
}

export default EventButton;