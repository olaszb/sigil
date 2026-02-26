const SigilButton = ({text, onClick, type = "button", clipPath="[clip-path:polygon(15%_0%,100%_0%,85%_100%,0%_100%)]"}) => {
    return (
        <button type={type} onClick={onClick} className={`relative overflow-hidden
            pl-8 pr-8 py-3 bg-main-accent text-primary-bg
         ${clipPath}
        tracking-[0.15em] text-[10px] font-black uppercase
        
        before:content-[''] before:absolute before:inset-0
        before:bg-parchment before:translate-y-[100%]
        before:transition-transform before:duration-400 before:ease-in-out
        hover:before:translate-y-0 hover:text-primary-bg`}
        >
            <span className="relative z-10">{text}</span>
        </button>
    );
}

export default SigilButton;