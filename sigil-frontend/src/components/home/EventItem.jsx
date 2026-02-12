import { Link } from "react-router-dom";
import { getPlainTextFromLexical, monthNames, weekDays } from "../../util/helper";

const EventItem = ({ title, description, start_time, slug }) => {
  const date = new Date(start_time);


  return (
    <div
      className="group relative flex bg-primary-bg w-full max-w-6xl mb-5 border border-parchment/20
                hover:shadow-[10px_10px_0px_0px_rgba(154,0,0,1)]
                hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300
                overflow-hidden"
    >
      {/* Date */}
      <div className="w-30 px-8 bg-main-accent flex flex-col items-center justify-center text-primary-bg cursor-default">
        <p className="text-sm font-bold uppercase leading-none tracking-[0.2rem]">
          {monthNames[date.getMonth()]}
        </p>
        <p className="text-5xl font-[Cinzel] leading-none font-black">
          {date.getDate()}
        </p>
        <p className="text-xs uppercase font-medium leading-none">
          {weekDays[date.getDay()]}
        </p>
      </div>

      {/* Image */}
      <Link to={`/events/${slug}`}>
        <div className="relative shrink-0">
          <img
            src="/public/images.jpeg"
            className="object-cover h-32 w-48 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
          />
        </div>
      </Link>

      {/* Title & Description */}

      <div className="flex-1 flex flex-col px-8 justify-center">
        <Link to={`/events/${slug}`}>
          <h2 className="text-2xl font-[Cinzel] mb-2 group-hover:text-main-accent cursor-default">
            {title}
          </h2>
        </Link>
        <p className="border-l border-parchment/20 text-xs text-parchment/50 font-[Montserrat] pl-2 cursor-default">
          {getPlainTextFromLexical(description)}
        </p>
      </div>

      {/* Buy Ticket */}

      <div className="absolute top-0 right-0">
        <button
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
            Claim Your Sigil
          </span>
        </button>
      </div>
    </div>
  );
};

export default EventItem;
