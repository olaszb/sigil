const EventButton = ({text, onClick, clipPath}) => {

    return (
        
          <button onClick={() => onClick()}
            className={`relative overflow-hidden
                      pl-8 pr-6 py-3 bg-main-accent text-primary-bg
                      [clip-path:polygon(15%_0%,100%_0%,100%_100%,0%_100%)]
                      md:${clipPath} 
                      tracking-[0.15em] text-[10px] font-black uppercase
                      
                      before:content-[''] before:absolute before:inset-0
                      before:bg-parchment before:translate-y-[100%]
                      before:transition-transform before:duration-400 before:ease-in-out
                      hover:before:translate-y-0
                      
                      `}
          >
            <span className="relative z-10 hover:text-primary-bg transition-colors duration-300">
              {text}
            </span>
          </button>
    );
}

export default EventButton;