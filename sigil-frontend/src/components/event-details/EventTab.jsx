import { monthNames, weekDays } from "../../util/helper";
import SigilButton from "../SigilButton";

const EventTab = ({ title, start_time, venue_name }) => {
  const date = new Date(start_time);

  return (
    <div className="relative ">
      <div className="flex justify-end gap-0 mr-15 pointer-events-none">
        <div className="w-30 px-8 py-4 h-fit bg-main-accent flex flex-col items-center justify-center text-primary-bg cursor-default pointer-events-auto">
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
        <div className="w-[350px] bg-primary-bg shadow-2xl px-4 pointer-events-auto">
          <div className="cursor-default">
            <h1 className="text-2xl font-bold text-main-accent font-[Cinzel] text-left mt-4 break-words whitespace-normal leading-tight">
              {title}
            </h1>
            <h2 className="mt-6 text-xl text-parchment font-[Montserrat]">
              Gates open at{" "}
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h2>
            <h3 className="mt-2 text-sm text-parchment uppercase leading-none tracking-tight font-[Montserrat]">
              {venue_name}
            </h3>
          </div>
          <hr className="my-8 text-parchment/20" />
          <div className="flex justify-center">
            <SigilButton text={"Ticket Types"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTab;
