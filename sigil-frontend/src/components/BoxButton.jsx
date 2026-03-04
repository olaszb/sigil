const BoxButton = ({ text, color, onClick, type }) => {
    return (
        <button type={type} onClick={() => onClick()} className={`px-6 py-2 bg-${color}/10 border border-${color}/40 
                            text-main-accent text-[10px] uppercase tracking-[0.2em] font-bold
                            hover:bg-main-accent hover:text-primary-bg transition-all duration-500
                            shadow-[0_0_10px_rgba(154,0,0,0.1)] hover:shadow-[0_0_20px_rgba(154,0,0,0.3)]`}>
            {text}
        </button>
    );
}

export default BoxButton;