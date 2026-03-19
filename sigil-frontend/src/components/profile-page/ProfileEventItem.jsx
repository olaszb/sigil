import { Link } from "react-router-dom";
import { getImageUrl, getPlainTextFromLexical, monthNames, weekDays } from "../../util/helper";

const ProfileEventItem = ({ event }) => {
  const date = new Date(event.start_time);


  return (
    <div
      className="group relative flex flex-col lg:flex-row bg-primary-bg w-full max-w-6xl mb-4 border border-parchment/20
                hover:shadow-[10px_10px_0px_0px_rgba(154,0,0,1)]
                hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300
                overflow-hidden"
    >
      {/* Date */}
      <div className="w-full lg:w-32 py-4 lg:py-0 px-8 bg-main-accent flex flex-row lg:flex-col items-center justify-center text-primary-bg cursor-default gap-4 lg:gap-0 shrink-0">
        <p className="text-sm font-bold uppercase leading-none tracking-[0.2rem]">
          {monthNames[date.getMonth()]}
        </p>
        <p className="text-4xl lg:text-5xl font-[Cinzel] leading-none font-black">
          {date.getDate()}
        </p>
        <p className="text-xs uppercase font-medium leading-none">
          {weekDays[date.getDay()]}
        </p>
      </div>

      {/* Image */}
      <Link to={`/events/${event.slug}`} className="flex w-full lg:w-48 shrink-0 ">
        <div className="relative w-full h-48 md:h-full overflow-hidden">
          <img
            src={getImageUrl(event.image_url)}
            className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
          />
        </div>
      </Link>

      {/* Title & Description */}

      <div className="flex-1 flex flex-col p-6 lg:p-6 lg:pl-8 justify-center">
        <Link to={`/events/${event.slug}`}>
          <h2 className="text-xl lg:text-2xl font-[Cinzel] mb-2 group-hover:text-main-accent cursor-default">
            {event.title}
          </h2>
        </Link>
        <p className="border-l border-parchment/20 text-xs text-parchment/50 font-[Montserrat] pl-2 cursor-default line-clamp-2 lg:line-clamp-none">
          {getPlainTextFromLexical(event.description)}
        </p>
      </div>
    </div>
  );
};

export default ProfileEventItem;
