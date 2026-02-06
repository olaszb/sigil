import { useState } from "react";
import axiosClient from "../services/axios-client";
import { redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../util/create-event/create_event.css";
import {
  Castle,
  Fingerprint,
  ImageIcon,
  Key,
  PenTool,
  Scroll,
  ScrollText,
  Skull,
  Sparkles,
} from "lucide-react";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [venue, setVenue] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    // Implement event creation logic here
  };

  return (
    <>
      {/* Background image */}
      <img
        src="/public/Vampire_Castle.jpg"
        className="fixed inset-0 w-full h-full object-cover z-0 grayscale"
      />
      {/* Background effects */}
      <div className="fixed inset-0 bg-black/60 z-10"></div>
      <div className="fixed inset-0 pointer-events-none z-15 bg-[radial-gradient(circle,transparent_40%,black_120%)]"></div>

      <div
        className="relative min-h-screen w-full flex items-center justify-center
                    z-20"
      >
        <div
          className="relative w-full max-w-5xl h-[30rem] bg-primary-bg border border-parchment/20
                    flex flex-col"
        >
          {/* Form */}
          <h1 className="text-4xl font-[Cinzel] mb-8 justify-self-center self-center mt-4 text-parchment">
            Rite of Creation
          </h1>
          <form
            className="flex flex-col md:flex-row h-full justify-center items-center text-parchment"
            onSubmit={handleCreateEvent}
          >
            {/* Left Column */}
            <div className="flex-1 p-4 border-r border-parchment/20 h-full">
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
                  <input
                    name="venue"
                    id="venue"
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Event Venue"
                    required
                    className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                            font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-5 flex flex-col">
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                  Ritual Details
                </label>
                <div className="relative group">
                  <div className="absolute right-2 top-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                    <PenTool size={16} />
                  </div>
                  <textarea
                    name="description"
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Event Description"
                    required
                    className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                            font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="mb-5 flex flex-col">
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                  Ritual Date & Time
                </label>
                <div className="relative group">
                  {/* <div className="absolute right-2 bottom-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                            <Scroll size={16}/>
                        </div> */}
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
            </div>

            {/* Right Column */}
            <div className="w-full h-full md:w-110 bg-black/20 p-4 flex flex-col border-t md:border-t-0">
              
              
              {/* Image Upload */}
              <div className="flex-1 flex flex-col mb-8">
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

              {/* Submit */}
              <div className="my-5 flex justify-center">
                <button
                  type="submit"
                  className="relative overflow-hidden
                                    pl-8 pr-8 py-3 bg-main-accent text-primary-bg
                                [clip-path:polygon(15%_0%,100%_0%,85%_100%,0%_100%)] 
                                tracking-[0.15em] text-[10px] font-black uppercase
                                
                                before:content-[''] before:absolute before:inset-0
                                before:bg-parchment before:translate-y-[100%]
                                before:transition-transform before:duration-400 before:ease-in-out
                                hover:before:translate-y-0 hover:text-primary-bg"
                >
                  <span className="relative z-10">Create Ritual</span>
                </button>
              </div>
            </div>

            {error && <p className="text-danger-alert">{error}</p>}
          </form>

          {/* Animation */}
          <div
            className="absolute -bottom-9 -left-0.5 w-[100.3%] h-10 bg-subtle-accent pointer-events-none"
            style={{
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 20%, 85% 90%, 75% 40%, 60% 80%, 50% 30%, 35% 100%, 25% 50%, 10% 85%, 0% 20%)",
            }}
          />
          <div
            className="absolute left-[10%] -bottom-3 w-2 h-3 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"
            style={{ animationDelay: "1s" }}
          />

          <div className="absolute left-[35%] -bottom-3 w-3 h-4 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]" />

          <div
            className="absolute left-[70%] -bottom-3 w-2 h-3 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"
            style={{ animationDelay: "4s" }}
          />

          <div
            className="absolute left-[90%] -bottom-3 w-3 h-4 bg-subtle-accent rounded-full animate-blood-fall pointer-events-none blur-[0.5px]"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
