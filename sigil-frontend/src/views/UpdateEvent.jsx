import { useEffect, useState } from "react";
import axiosClient from "../services/axios-client";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../util/create-event/create_event.css";
import { Castle, PenTool, ScrollText, Sparkles, Plus, Trash2, Coins } from "lucide-react";
import Editor from "../components/create-event/Editor/Editor";
import { getImageUrl } from "../util/helper";
import { toastConfig } from "../util/toastConfig";
import { toast } from "react-toastify";
import SigilButton from "../components/SigilButton";
import LoadingScreen from "../components/LoadingScreen";

const UpdateEvent = () => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { slug } = useParams();

  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [selectedVenueLayout, setSelectedVenueLayout] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const [ticketTiers, setTicketTiers] = useState([
    {
      id: Date.now(),
      name: "Standard Entry",
      section_name: "",
      price: "",
      quantity: "",
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeUpdatePage = async () => {
      setLoading(true);
      try {
        const [venuesRes, eventRes] = await Promise.all([
          axiosClient.get("/api/venues/all"),
          axiosClient.get(`/api/events/${slug}`),
        ]);
        const venuesList = Array.isArray(venuesRes.data)
          ? venuesRes.data
          : venuesRes.data.data;

        setVenues(venuesList || []);

        const data = eventRes.data.event;

        setId(data.id);
        setTitle(data.title);
        setDescription(data.description);
        setOriginalDescription(data.description);
        setStartTime(data.start_time);
        setSelectedVenueId(data.venue_id);
        setOriginalImage(data.image_url);

        if(data.tickets && data.tickets.length > 0){
          setTicketTiers(data.tickets.map(t => ({
            id: t.id,
            name: t.name,
            section_name: t.section_name,
            price: t.price,
            quantity: t.quantity,
          })));
        }
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to load venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    initializeUpdatePage();
  }, [slug]);

  useEffect(() => {
    if (selectedVenueId && venues.length > 0) {
      const venue = venues.find((v) => v.id === parseInt(selectedVenueId));
      setSelectedVenueLayout(venue?.layout || null);
    }
  }, [selectedVenueId, venues]);

  const addTicketTier = () => {
    setTicketTiers([
      ...ticketTiers,
      { id: Date.now(), name: "", section_name: "", price: "", quantity: "" },
    ]);
  };

  const removeTicketTier = (id) => {
    if (ticketTiers.length === 1) return;
    setTicketTiers(ticketTiers.filter((t) => t.id !== id));
  };

  const updateTicketTier = (id, field, value) => {
    setTicketTiers(
      ticketTiers.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  };

  const getSectionCapacity = (sectionName) => {
    if (!selectedVenueLayout) return 0;
    const section = selectedVenueLayout.sections.find(
      (s) => s.name === sectionName,
    );
    if (!section) return 0;

    if (section.type === "standing") return section.capacity;
    return section.rows * section.columns - (section.void_seats?.length || 0);
  };

  const getRemainingCapacity = (sectionName, currentTierId) => {
    const totalCap = getSectionCapacity(sectionName);
    const usedByOthers = ticketTiers
      .filter((t) => t.section_name === sectionName && t.id !== currentTierId)
      .reduce((sum, t) => sum + (parseInt(t.quantity) || 0), 0);
    return totalCap - usedByOthers;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setError(null);
    for (const tier of ticketTiers) {
      const remaining = getRemainingCapacity(tier.section_name, tier.id);
      if (parseInt(tier.quantity) > remaining) {
        setError(`Chamber "${tier.section_name}" is overfilled!`);
        return;
      }
    }
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("organizer_id", user.id);
    formData.append("venue_id", selectedVenueId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_time", startTime);
    formData.append("ticket_tiers", JSON.stringify(ticketTiers));
    if (image) {
      formData.append("image_url", image);
    }
    try {
      await axiosClient
        .post(`/api/events/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast("Ritual updated successfully!", toastConfig);
          navigate(`/events/${response.data.event.slug}`);
        });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

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

      <div className="relative min-h-screen w-full flex items-start md:items-center justify-center z-20 py-12 px-4 md:py-20">
        <div className="relative w-full max-w-5xl bg-primary-bg border border-parchment/20 flex flex-col">
          {/* Form */}
          <h1 className="text-3xl md:text-4xl font-[Cinzel] mb-4 md:mb-8 text-center mt-6 md:mt-8 text-parchment">
            Rite of Modification
          </h1>
          <form
            className="flex flex-col text-parchment"
            onSubmit={handleUpdateEvent}
          >
            <div className="flex flex-col md:flex-row h-full justify-center items-stretch">
              {/* Left Column */}
              <div className="flex-[4] p-6 md:p-8 border-b md:border-b-0 md:border-r border-parchment/20 h-full">
                {/* Title */}
                <div className="mb-5 flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                    Ritual Name
                  </label>
                  <div className="relative group">
                    <div className="absolute right-2 bottom-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                      <ScrollText size={16} />
                    </div>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Event Title"
                      required
                      className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                              font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    />
                  </div>
                </div>

                {/* Venue */}
                <div className="mb-5 flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                    Ritual Location
                  </label>
                  <div className="relative group">
                    <div className="absolute right-2 bottom-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                      <Castle size={16} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                              font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    >
                      {selectedVenueId
                        ? venues.find((v) => v.id === selectedVenueId)?.name
                        : "Select Location"}
                    </button>
                    {isOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setIsOpen(false)}
                        />

                        <div className="absolute top-full left-0 w-full mt-1 bg-primary-bg border border-parchment/20 z-30 max-h-48 overflow-y-auto shadow-2xl animate-scroll-down">
                          {venues.length > 0 ? (
                            venues.map((v) => (
                              <div
                                key={v.id}
                                onClick={() => {
                                  setSelectedVenueId(v.id);
                                  setIsOpen(false);
                                }}
                                className="w-full border-b border-parchment/20 hover:bg-main-accent hover:text-white transition-colors duration-400 font-[Montserrat]"
                              >
                                {v.name}
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-[10px] text-parchment/30 italic">
                              No locations found...
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-parchment/50">
                    Cant find your preferred venue?{" "}
                    <Link
                      to={"/add-venue"}
                      className="text-main-accent hover:underline"
                    >
                      Add it!
                    </Link>
                  </p>
                  <input
                    type="hidden"
                    name="venue_id"
                    value={selectedVenueId}
                  />
                </div>

                {/* Description */}
                <div className="mb-5 flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                    Ritual Details
                  </label>
                  <div className="relative group">
                    <div className="absolute right-2 bottom-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                      <PenTool size={16} />
                    </div>
                    <Editor
                      initialValue={originalDescription}
                      onChange={(content) => setDescription(content)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-[3] bg-black/20 p-4 flex flex-col">
                {/* Date */}
                <div className="mb-5 flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                    Ritual Date & Time
                  </label>
                  <div className="relative group">
                    <input
                      name="start_time"
                      id="start_time"
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="Event Start Time"
                      required
                      className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                              font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="flex-1 flex flex-col mb-4 min-h-[250px] md:h-[300px]">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-3">
                    Binding Sigil (Image)
                  </label>

                  <label className="relative flex-1 border-2 border-dashed border-parchment/10 hover:border-main-accent/50 transition-all flex flex-col items-center justify-center cursor-pointer group bg-black/20 overflow-hidden">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    {originalImage ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img
                          src={
                            imagePreview
                              ? imagePreview
                              : getImageUrl(originalImage)
                          }
                          alt="Preview"
                          className="w-full h-full object-cover transition-all duration-700"
                        />

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                          <Sparkles
                            size={24}
                            className="text-main-accent mb-2"
                          />
                          <span className="text-[8px] uppercase tracking-widest text-parchment">
                            Replace Fragment
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Sparkles
                          size={32}
                          className="text-parchment/10 group-hover:text-main-accent group-hover:scale-110 transition-all duration-500"
                        />
                        <span className="text-[8px] uppercase tracking-widest text-parchment/20 mt-4">
                          Upload Fragment
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 border-t border-parchment/20 bg-black/40">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl font-[Cinzel] text-main-accent">
                    Tickets
                  </h2>
                  <p className="text-xs text-parchment/70 font-[Montserrat] mt-1 ">
                    Bind ticket tiers to specific sections of the venue.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!selectedVenueId}
                  onClick={addTicketTier}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-parchment border border-parchment/20 px-3 py-2 hover:bg-main-accent transition-all disabled:opacity-20"
                >
                  <Plus size={14} /> Add Tier
                </button>
              </div>
              {!selectedVenueId ? (
                <div className="text-center py-10 border border-dashed border-parchment/10 text-parchment/50 italic text-sm">
                  You must select a Ritual Location before defining tiers.
                </div>
              ) : (
                <div className="space-y-4">
                  {ticketTiers.map((tier) => {
                    const remaining = getRemainingCapacity(
                      tier.section_name,
                      tier.id,
                    );
                    const isOverfilled = parseInt(tier.quantity) > remaining;

                    return (
                      <div
                        key={tier.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-black/20 p-4 border border-parchment/5"
                      >
                        <div className="md:col-span-3">
                          <label className="text-[9px] uppercase tracking-tighter text-parchment/40">
                            Tier Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Early Bird"
                            value={tier.name}
                            onChange={(e) =>
                              updateTicketTier(
                                tier.id,
                                "name",
                                e.target.value,
                              )
                            }
                            required
                            className="w-full border-b border-parchment/20 bg-transparent p-1 text-sm outline-none focus:border-main-accent"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="text-[9px] uppercase tracking-tighter text-parchment/40">
                            Section
                          </label>
                          <select
                            value={tier.section_name}
                            onChange={(e) =>
                              updateTicketTier(
                                tier.id,
                                "section_name",
                                e.target.value,
                              )
                            }
                            required
                            className="w-full border-b border-parchment/20 bg-[#111] p-1 text-sm outline-none focus:border-main-accent"
                          >
                            <option value="">Select Section</option>
                            {selectedVenueLayout?.sections.map((s) => (
                              <option key={s.name} value={s.name}>
                                {s.name} ({s.type})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-[9px] uppercase tracking-tighter text-parchment/40 flex items-center gap-1">
                            <Coins size={10} /> Price
                          </label>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={tier.price}
                            onChange={(e) =>
                              updateTicketTier(
                                tier.id,
                                "price",
                                e.target.value,
                              )
                            }
                            required
                            className="w-full border-b border-parchment/20 bg-transparent p-1 text-sm outline-none"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label
                            className={`text-[9px] uppercase tracking-tighter flex justify-between ${isOverfilled ? "text-main-accent" : "text-parchment/40"}`}
                          >
                            Quantity{" "}
                            <span>
                              Remaining:{" "}
                              {tier.section_name ? remaining : "--"}
                            </span>
                          </label>
                          <input
                            type="number"
                            placeholder="Count"
                            value={tier.quantity}
                            onChange={(e) =>
                              updateTicketTier(
                                tier.id,
                                "quantity",
                                e.target.value,
                              )
                            }
                            required
                            className={`w-full border-b p-1 text-sm bg-transparent outline-none transition-colors ${isOverfilled ? "border-main-accent text-main-accent" : "border-parchment/20"}`}
                          />
                        </div>

                        <div className="md:col-span-1 flex justify-center">
                          <button
                            type="button"
                            onClick={() => removeTicketTier(tier.id)}
                            className="text-parchment/20 hover:text-main-accent transition-colors mb-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="min-h-[24px]">
              {error && (
                <p className="text-main-accent text-xs text-center">
                  {error}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="my-3 flex justify-center">
              <SigilButton type={"submit"} text={"Modify Ritual"} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateEvent;
