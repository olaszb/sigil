import { Link } from "react-router-dom";
import { getImageUrl, getPlainTextFromLexical, monthNames, weekDays } from "../../util/helper";
import SigilButton from "../EventButton";
import EventButton from "../EventButton";
import { useAuth } from "../../contexts/AuthContext";


const EventItem = ({ event, type, onAction }) => {
  const date = new Date(event?.start_time);
  const { user } = useAuth();

  return (
    <div
      className="group relative flex flex-col md:flex-row bg-primary-bg w-full max-w-6xl mb-5 border border-parchment/20
                hover:shadow-[10px_10px_0px_0px_rgba(154,0,0,1)]
                hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300
                overflow-hidden"
    >
      {/* Date */}
      <div className="w-full md:w-32 py-4 md:py-0 px-8 bg-main-accent flex flex-row md:flex-col items-center justify-center text-primary-bg cursor-default gap-4 md:gap-0">
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
      <Link to={type === 'current' ? `/events/${event?.slug}` : type === 'past' ? `/past-events/${event?.slug}` : `/archive/events/${event?.slug}`}
      className="flex w-full md:w-48 shrink-0">
        <div className="relative w-full h-48 md:h-full overflow-hidden">
          <img
            src={getImageUrl(event?.image_url)}
            className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
          />
        </div>
      </Link>

      {/* Title & Description */}
      <div className="flex-1 flex flex-col p-6 md:py-4 md:pl-8 md:pr-48 justify-center pb-20 md:pb-4">
        <Link to={type === 'current' ? `/events/${event?.slug}` : type === 'past' ? `/past-events/${event?.slug}` : `/archive/events/${event?.slug}`}>
          <h2 className="text-xl lg:text-2xl font-[Cinzel] mb-2 text-parchment group-hover:text-main-accent cursor-default">
            {event?.title}
          </h2>
        </Link>
        <p className="border-l border-parchment/20 text-xs text-parchment/50 font-[Montserrat] pl-2 cursor-default line-clamp-2">
          {getPlainTextFromLexical(event?.description)}
        </p>
        <p className="border-l border-main-accent mt-1 text-xs text-parchment/50 font-[Montserrat] pl-2 cursor-default">
          Ritual Site: {event?.venue?.name}
        </p>
      </div>

      {/* Buy Ticket */}
      {(type === "current" && user?.role === 'user') &&
      (
        <div className="absolute bottom-0 right-0 md:top-0 md:bottom-auto">
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
