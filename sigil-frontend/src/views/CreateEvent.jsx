import { useEffect, useState } from "react";
import axiosClient from "../services/axios-client";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../util/create-event/create_event.css";
import {
  Castle,
  PenTool,
  ScrollText,
  Sparkles,
} from "lucide-react";
import Editor from "../components/create-event/Editor/Editor";
import { toast } from "react-toastify";
import { toastConfig } from "../util/toastConfig";
import SigilButton from "../components/SigilButton";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axiosClient.get("/api/venues/all");
        setVenues(response.data);
        console.log("Fetched venues:", response.data);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to load venues. Please try again later.");
      }
    };
    fetchVenues();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append("organizer_id", user.id);
    formData.append("venue_id", selectedVenueId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_time", startTime);
    if (image) {
      formData.append("image_url", image);
    }
    try {
      await axiosClient
        .post("/api/events", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        // eslint-disable-next-line no-unused-vars
        .then((response) => {
          toast("Ritual created successfully!", toastConfig);
          navigate("/");
        });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      {/* Background image */}
      <img
        src="/Vampire_Castle.jpg"
        className="fixed inset-0 w-full h-full object-cover z-0 grayscale"
      />
      {/* Background effects */}
      <div className="fixed inset-0 bg-black/60 z-10"></div>
      <div className="fixed inset-0 pointer-events-none z-15 bg-[radial-gradient(circle,transparent_40%,black_120%)]"></div>

      <div className="relative min-h-screen w-full flex items-start md:items-center justify-center z-20 py-12 px-4 md:py-20">
        <div className="relative w-full max-w-5xl bg-primary-bg border border-parchment/20 flex flex-col">
          {/* Form */}
          <h1 className="text-4xl font-[Cinzel] mb-8 justify-self-center self-center mt-4 text-parchment">
            Rite of Creation
          </h1>
          <form
            className="flex flex-col md:flex-row h-full justify-center items-stretch text-parchment"
            onSubmit={handleCreateEvent}
          >
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
                <p className="text-xs text-parchment/50">Can't find your preferred venue? <Link to={"/add-venue"} className="text-main-accent hover:underline">Add it!</Link></p>
                <input type="hidden" name="venue_id" value={selectedVenueId} />
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
                  <Editor onChange={(content) => setDescription(content)}/>
                  
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-[3] bg-black/20 p-6 md:p-8 flex flex-col">
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
              <div className="flex flex-col mb-8 min-h-[250px] md:h-[300px]">
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

                  {imagePreview ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover transition-all duration-700"
                      />

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                        <Sparkles size={24} className="text-main-accent mb-2" />
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

              <div className="min-h-[24px]">
                    {error && <p className="text-main-accent text-xs text-center">{error}</p>}
              </div>

              {/* Submit */}
              <div className="my-3 flex justify-center">
                <SigilButton type={"submit"} text={"Create Ritual"} />
              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
