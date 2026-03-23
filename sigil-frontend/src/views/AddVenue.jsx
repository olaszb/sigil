import { useEffect, useState } from "react";
import axiosClient from "../services/axios-client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../util/login/login.css";
import { Eraser, Grid3X3, Key, Plus, Scroll, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { toastConfig } from "../util/toastConfig";
import SigilButton from "../components/SigilButton";
import LoadingScreen from "../components/LoadingScreen"

const AddVenuePage = () => {
  const [venueName, setVenueName] = useState("");
  const [venueCountry, setVenueCountry] = useState("");
  const [venueCity, setVenueCity] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venuePostalCode, setVenuePostalCode] = useState("");
  const [venueCapacity, setVenueCapacity] = useState("");
  const [sections, setSections] = useState([
    { id: Date.now(), name: "Main Floor", type: "standing", capacity: "", rows: "", columns: "", void_seats: [], isDrawing: false}
  ]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user.role !== "organizer" && user.role !== "admin"){
    navigate('/');
  }

  const addSection = () => {
    setSections([...sections, { id: Date.now(), name: "", type: "standing", capacity: "", rows: "", columns: "", void_seats: [], isDrawing: false }]);
  };

  const removeSection = (id) => {
    if (sections.length === 1) return;
    setSections(sections.filter(s => s.id !== id));
  }

  const updateSection = (id, field, value) => {
    if (field === 'rows' || field === 'columns') {
        setSections(sections.map(sec => sec.id === id ? { ...sec, [field]: value, void_seats: [] } : sec));
    } else {
        setSections(sections.map(sec => sec.id === id ? { ...sec, [field]: value } : sec));
    }  
  };

  const toggleDrawingMode = (id) => {
    setSections(sections.map(sec => sec.id === id ? { ...sec, isDrawing: !sec.isDrawing } : sec));
  };

  const toggleSeat = (sectionId, rowIndex, colIndex) => {
    const seatId = `${rowIndex}-${colIndex}`;
    setSections(sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        
        const isVoid = sec.void_seats.includes(seatId);
        return {
            ...sec,
            void_seats: isVoid 
                ? sec.void_seats.filter(id => id !== seatId) 
                : [...sec.void_seats, seatId]
        };
    }));
  };

  const handleAddVenue = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const payload = {
      name: venueName,
      country: venueCountry,
      city: venueCity,
      address: venueAddress,
      postal_code: venuePostalCode,
      capacity: parseInt(venueCapacity),
      layout: {
        sections: sections.map(s => ({
          name: s.name,
          type: s.type,
          ...(s.type === 'standing' ? {capacity: parseInt(s.capacity) || 0} : {}),
          ...(s.type === 'seated' ? {rows: parseInt(s.rows) || 0, columns: parseInt(s.columns) || 0, void_seats: s.void_seats} : {}),
        }))
      }
    };
    try {
      await axiosClient.post("/api/venues", payload);
      toast("Venue added successfully!", toastConfig);
      navigate("/venues");
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const total = sections.reduce((acc, sec) => {
      if(sec.type === 'standing'){
        return acc + (parseInt(sec.capacity) || 0);
      }else {
        const totalPossibleSeats = (parseInt(sec.rows) || 0) * (parseInt(sec.columns) || 0);
        const activeSeats = totalPossibleSeats - (sec.void_seats?.length || 0);
        return acc + activeSeats;
      }
    }, 0)
    setVenueCapacity(total);
  }, [sections]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      {/* Background image */}
      <img
        src="/liurnia.webp"
        className="fixed inset-0 w-full h-full object-cover z-0 grayscale"
      />
      {/* Background effects */}
      <div className="fixed inset-0 bg-black/60 z-10"></div>
      <div className="fixed inset-0 pointer-events-none z-15 bg-[radial-gradient(circle,transparent_40%,black_120%)]"></div>

      <div className="relative min-h-screen w-full flex items-start md:items-center justify-center z-20 py-12 px-4">
        <div className="relative w-full max-w-4xl bg-primary-bg border border-parchment/20 flex flex-col">

          <h1 className="text-4xl font-[Cinzel] mb-8 mt-4 self-center text-parchment">
            Rite of Location
          </h1>
          {/* Form */}
          <form
            className="flex flex-col text-parchment w-full px-6 md:px-10"
            onSubmit={handleAddVenue}
          >
            <div className="flex flex-col md:flex-row justify-center items-stretch w-full gap-6">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-parchment/20 pb-6 md:pb-0 md:pr-6">
                {/* Venue Name */}
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">Site Name</label>
                  <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} required className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400 font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none" />
                </div>
                {/* Venue Country */}
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">Kingdom</label>
                  <input type="text" value={venueCountry} onChange={(e) => setVenueCountry(e.target.value)} required className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400 font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none" />
                </div>
                {/* Venue City */}
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">Town</label>
                  <input type="text" value={venueCity} onChange={(e) => setVenueCity(e.target.value)} required className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400 font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none" />
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-5 md:pl-6">
                {/* Venue Address */}
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">Residence</label>
                  <input type="text" value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} required className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400 font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none" />
                </div>
                {/* Venue Postal Code */}
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">Courier Code</label>
                  <input type="number" value={venuePostalCode} onChange={(e) => setVenuePostalCode(e.target.value)} required className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400 font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none" />
                </div>
                {/* Venue Capacity */}
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                  Total Venue Capacity
                  <span className="text-[9px] lowercase italic opacity-60">(Calculated)</span>
                  </label>
                  <input type="number" value={venueCapacity} readOnly onChange={(e) => setVenueCapacity(e.target.value)} required className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400 font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none" />
                </div>
              </div>
            </div>
            {/* Section Builder */}
            <div className="mt-10 pt-8 border-t border-parchment/20 w-full">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-[Cinzel] text-main-accent">Sections</h2>
                  <p className="text-xs text-parchment/50 font-[Montserrat] mt-1">Define the specific areas within this ritual site.</p>
                </div>
                <button type="button" onClick={addSection} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-parchment border border-parchment/20 px-3 py-2 hover:bg-main-accent hover:border-main-accent transition-all duration-300">
                  <Plus size={14} /> Add Section
                </button>
              </div>

              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.id} className="flex flex-col bg-black/40 border border-parchment/10 p-4 transition-all">
                    {/* Section Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 relative">
                      <div className="flex-1 flex flex-col">
                        <label className="text-[10px] font-mono uppercase text-parchment/40 mb-1">Section Name</label>
                        <input type="text" placeholder="e.g. VIP Balcony" value={section.name} onChange={(e) => updateSection(section.id, 'name', e.target.value)} required className="w-full border-b border-parchment/20 p-1 bg-transparent focus:border-main-accent outline-none text-sm"/>
                      </div>

                      <div className="w-full lg:w-40 flex flex-col">
                        <label className="text-[10px] font-mono uppercase text-parchment/40 mb-1">Type</label>
                        <select value={section.type} onChange={(e) => updateSection(section.id, 'type', e.target.value)} className="w-full border-b border-parchment/20 p-1 bg-[#111] focus:border-main-accent outline-none text-sm text-parchment">
                          <option value="standing">Standing</option>
                          <option value="seated">Reserved Seating</option>
                        </select>
                      </div>

                      {section.type === "standing" ? (
                        <div className="w-full lg:w-32 flex flex-col">
                            <label className="text-[10px] font-mono uppercase text-parchment/40 mb-1">Capacity</label>
                            <input type="number" min="1" placeholder="Max People" value={section.capacity} onChange={(e) => updateSection(section.id, 'capacity', e.target.value)} required className="w-full border-b border-parchment/20 p-1 bg-transparent focus:border-main-accent outline-none text-sm"/>
                        </div>
                      ) : (
                        <>
                          <div className="w-full lg:w-24 flex flex-col">
                              <label className="text-[10px] font-mono uppercase text-parchment/40 mb-1">Rows</label>
                              <input type="number" min="1" placeholder="e.g. 10" value={section.rows} onChange={(e) => updateSection(section.id, 'rows', e.target.value)} required className="w-full border-b border-parchment/20 p-1 bg-transparent focus:border-main-accent outline-none text-sm"/>
                          </div>
                          <div className="w-full lg:w-24 flex flex-col">
                            <label className="text-[10px] font-mono uppercase text-parchment/40 mb-1">Columns</label>
                            <input type="number" min="1" placeholder="e.g. 10" value={section.columns} onChange={(e) => updateSection(section.id, 'columns', e.target.value)} required className="w-full border-b border-parchment/20 p-1 bg-transparent focus:border-main-accent outline-none text-sm"/>
                          </div>

                          <div className="flex items-end lg:pl-2">
                            <button type="button"
                              disabled={!section.rows || !section.columns}
                              onClick={() => toggleDrawingMode(section.id)}
                              className={`flex items-center gap-2 px-3 py-1.5 border text-xs uppercase tracking-widest transition-all ${section.isDrawing ? 'bg-main-accent border-main-accent text-primary-bg' : 'border-parchment/90 text-parchment hover:text-parchment hover:border-parchment/50 disabled:opacity-20'}`}
                            >
                              {section.isDrawing ? <Eraser size={14}/> : <Grid3X3 size={14}/>}
                              {section.isDrawing ? "Close Map" : "Paint Aisles"}
                            </button>
                          </div>
                        </>
                      )}
                      {sections.length > 1 && (
                          <button type="button" onClick={() => removeSection(section.id)} className="absolute top-2 right-2 lg:relative lg:top-0 lg:right-0 text-parchment/30 hover:text-main-accent transition-colors lg:self-end lg:mb-1">
                              <Trash2 size={18} />
                          </button>
                      )}
                    </div>
                    {/* Grid Painter */}
                    {(section.type === "seated" && section.isDrawing && section.rows > 0 && section.columns > 0) && (
                      <div className="mt-6 p-4 border-t border-parchment/10 overflow-x-auto w-full flex flex-col items-center">
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-main-accent mb-4">
                          Click seats to remove them (create aisles & gaps)
                        </p>
                        {/* Rendering the grid */}
                        <div className="inline-flex flex-col gap-1 p-4 bg-[#0a0a0a] border border-parchment/5">
                          {Array.from({length: section.rows}).map((_, rId) => (
                            <div key={`r-${rId}`} className="flex gap-1">
                              {Array.from({length: section.columns}).map((_, cId) => {
                                const seatId = `${rId}-${cId}`;
                                const isVoid = section.void_seats.includes(seatId);

                                return (
                                  <div key={seatId} onClick={() => toggleSeat(section.id, rId, cId)}
                                    className={`w-6 h-6 md:w-8 md:h-8 border cursor-pointer flex items-center justify-center transition-all duration-200
                                      ${isVoid 
                                        ? 'bg-transparent border border-parchment/5 hover:border-main-accent/30'
                                        : 'bg-parchment/10 border-parchment/20 hover:bg-main-accent hover:border-main-accent'
                                      }
                                      `}
                                      title={`Row ${rId + 1}, Seat ${cId + 1}`}
                                    >
                                    {!isVoid && <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-parchment/40 rounded-full pointer-events-none" />}
                                  </div>
                                )
                              })}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-6 mt-4 text-[10px] font-mono text-parchment/40">
                            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-parchment/10 border border-parchment/20"></div> Active Seat</span>
                            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-transparent border border-parchment/5"></div> Void / Aisle</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="min-h-[24px]">
                {error && <p className="text-main-accent text-xs text-center">{error}</p>}
            </div>

            {/* Submit */}
            <div className="w-full flex justify-center my-5">
              <SigilButton type={"submit"} text={"Update The Archives"} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddVenuePage;
