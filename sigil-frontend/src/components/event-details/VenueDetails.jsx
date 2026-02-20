import { Castle, Users } from "lucide-react";

const VenueDetails = ({ venue }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-parchment/10 bg-black/40">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-main-accent">
          <Castle size={18} />
          <h3 className="font-bold font-[Cinzel] text-lg uppercase tracking-wider">
            Site of Ritual:
          </h3>
        </div>

        <div className="font-[Montserrat] text-parchment/80 space-y-1 pl-7">
          <p className="text-xl font-medium text-parchment">{venue?.name}</p>
          <p className="text-sm italic">{venue?.country}</p>
          <p className="text-sm opacity-60">
            {venue?.city}, {venue?.address}
          </p>
          <p className="text-[10px] tracking-tighter opacity-40 uppercase">
            Portal Code: {venue?.postal_code}
          </p>
        </div>
      </div>
      <div className="space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-main-accent mb-4">
            <Users size={18} />
            <h3 className="font-bold font-[Cinzel] text-lg uppercase tracking-wider">
              Capacity
            </h3>
          </div>
          <div className="pl-7">
            <span className="text-4xl font-[Cinzel] text-parchment/90">
              {venue?.capacity}
            </span>
            <span className="ml-2 text-[10px] uppercase tracking-widest text-parchment/40 font-mono">
              Acolytes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueDetails;
