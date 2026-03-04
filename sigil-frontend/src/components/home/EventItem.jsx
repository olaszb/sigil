import { Link } from "react-router-dom";
import { getImageUrl, getPlainTextFromLexical, monthNames, weekDays } from "../../util/helper";
import SigilButton from "../EventButton";
import EventButton from "../EventButton";


const EventItem = ({ event, type, onAction }) => {
  const date = new Date(event.start_time);
  const { user } = useAuth();

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
      <Link to={type === 'current' ? `/events/${event.slug}` : `/archive/events/${event.slug}`}>
        <div className="relative shrink-0">
          <img
            src={getImageUrl(event.image_url)}
            className="object-cover h-32 w-48 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
          />
        </div>
      </Link>

      {/* Title & Description */}

      <div className="flex-1 flex flex-col px-8 justify-center">
        <Link to={(type === 'current' || type === 'past') ? `/events/${event.slug}` : `/archive/events/${event.slug}`}>
          <h2 className="text-2xl font-[Cinzel] mb-2 group-hover:text-main-accent cursor-default">
            {event.title}
          </h2>
        </Link>
        <p className="border-l border-parchment/20 text-xs text-parchment/50 font-[Montserrat] pl-2 cursor-default">
          {getPlainTextFromLexical(event.description)}
        </p>
      </div>

      {/* Buy Ticket */}
      {(type === "current" && user?.role === 'user') &&
      (
        <div className="absolute top-0 right-0">
          <EventButton text={"Claim Your Sigil"} clipPath={"[clip-path:polygon(0%_0%,100%_0%,100%_100%,15%_100%)]"}/>
        </div>
      )
      }
      {type === 'archived' && (
        <>
          <div className="absolute top-0 right-0">
            <EventButton text={"Restore Ritual"} onClick={() => onAction(event, 'restore')} clipPath={"[clip-path:polygon(0%_0%,100%_0%,100%_100%,15%_100%)]"}/>
          </div>

          <div className="absolute bottom-0 right-0">
            <EventButton text={"Burn Archive"} onClick={() => onAction(event, 'forceDelete')} clipPath={"[clip-path:polygon(15%_0%,100%_0%,100%_100%,0%_100%)]"}/>
          </div>
        </>
      )
      }
    </div>
  );
};

export default EventItem;
