import { useState } from "react";
import { getImageUrl, monthNames } from "../../util/helper";
import { Link } from "react-router-dom";

const HeroSection = ({featuredEvents, upcomingEvents}) => {
  const [activeHighlight, setActiveHighlight] = useState(0);

  const getTimeRemaining = (date) => {
    const diff = new Date(date) - new Date();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (days == 1) return `Tomorrow at ${new Date(date).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true})}`;
    if (days > 1) return `In ${days} days`;
    if (hours > 1) return `In ${hours} hours`;
    return "Starting soon";
  }

  return (
    <div className="relative w-full min-h-[500px] md:h-[500px] overflow-hidden group transition-all duration-700 ease-in-out">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105 group-hover:scale-100"
        style={{ backgroundImage: `url(${getImageUrl(featuredEvents[activeHighlight]?.image_url)})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/80" />

      {/* Content Grid */}
      <div className="relative z-10 flex flex-col md:flex-row h-full gap-8 p-6 md:p-12">
        
        {/* Highlighted Events */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <h2 className="text-main-accent font-['Cinzel'] text-sm tracking-widest uppercase mb-4">Featured Rituals</h2>
          {featuredEvents?.map((event, index) => (
            <Link to={`/events/${event.slug}`} key={event.id}>
              <button
                onMouseEnter={() => setActiveHighlight(index)}
                className={`text-left transition-all duration-300 border-l-2 pl-4 py-1 
                  ${activeHighlight === index 
                    ? "border-main-accent text-parchment translate-x-2" 
                    : "border-transparent text-parchment/40 hover:text-parchment/80"}`}
              >
                <span className="block text-xs uppercase opacity-60">{monthNames[new Date(event.start_time).getMonth()]} <span>{new Date(event.start_time).getDate()}</span></span>
                  <span className="text-2xl font-['Cinzel'] font-bold uppercase tracking-tight">{event.title}</span>
              </button>
            </Link>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="hidden lg:flex w-80 bg-black/40 backdrop-blur-md border border-parchment/10 p-8 flex flex-col justify-between rounded-sm">
          <div>
            <h3 className="text-parchment font-['Cinzel'] font-bold text-xl mb-6 border-b border-main-accent/30 pb-2">
              Upcoming
            </h3>
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <Link to={`/events/${event.slug}`} key={event.id} className="block">
                  <div className="group/item cursor-default">
                    <p className="text-main-accent text-xs font-mono">{getTimeRemaining(event.start_time)}</p>
                    <p className="text-parchment font-medium group-hover/item:text-main-accent transition-colors">
                      {event.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Link to="/events">
            <button className="w-full py-3 bg-main-accent text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0">
              View All Events
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
