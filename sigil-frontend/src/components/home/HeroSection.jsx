import { useState } from "react";

const highlightedTestData = [
  {
    id: 1,
    title: "The Midnight Ritual",
    date: "Oct 31",
    img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    title: "Echoes from the Void",
    date: "Nov 05",
    img: "https://images.unsplash.com/photo-1514525253344-f814d0743b1a?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 3,
    title: "Neon Sigil Rave",
    date: "Nov 12",
    img: "https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 4,
    title: "Ancient Grimoire Study",
    date: "Nov 20",
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 5,
    title: "Cyber Crypt Unlocking",
    date: "Dec 01",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
  },
];

const upcomingTestData = [
  { id: 6, title: "Cursed Code Workshop", time: "In 2 hours" },
  { id: 7, title: "Phantom API Launch", time: "Tomorrow at 9PM" },
  { id: 8, title: "Shadow Network Meetup", time: "Friday" },
];
const HeroSection = () => {
    const [activeHighlight, setActiveHighlight] = useState(0);


  return (
    <div className="relative w-full h-[500px] overflow-hidden group transition-all duration-700 ease-in-out">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105 group-hover:scale-100"
        style={{ backgroundImage: `url(${highlightedTestData[activeHighlight].img})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/80" />

      {/* CONTENT GRID */}
      <div className="relative z-10 flex h-full gap-8 p-12">
        
        {/* Highlighted Events */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <h2 className="text-main-accent font-['Cinzel'] text-sm tracking-widest uppercase mb-4">Featured Rituals</h2>
          {highlightedTestData.map((event, index) => (
            <button
              key={event.id}
              onMouseEnter={() => setActiveHighlight(index)}
              className={`text-left transition-all duration-300 border-l-2 pl-4 py-1 
                ${activeHighlight === index 
                  ? "border-main-accent text-parchment translate-x-2" 
                  : "border-transparent text-parchment/40 hover:text-parchment/80"}`}
            >
              <span className="block text-xs uppercase opacity-60">{event.date}</span>
              <span className="text-2xl font-['Cinzel'] font-bold uppercase tracking-tight">{event.title}</span>
            </button>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="mr-15 w-80 bg-black/40 backdrop-blur-md border border-parchment/10 p-8 flex flex-col justify-between rounded-sm">
          <div>
            <h3 className="text-parchment font-['Cinzel'] font-bold text-xl mb-6 border-b border-main-accent/30 pb-2">
              Upcoming
            </h3>
            <div className="space-y-6">
              {upcomingTestData.map((event) => (
                <div key={event.id} className="group/item cursor-default">
                  <p className="text-main-accent text-xs font-mono">{event.time}</p>
                  <p className="text-parchment font-medium group-hover/item:text-main-accent transition-colors">
                    {event.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-3 bg-main-accent text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0">
            View All Events
          </button>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
