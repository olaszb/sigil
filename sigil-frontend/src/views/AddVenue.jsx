import { useState } from "react";
import axiosClient from "../services/axios-client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../util/login/login.css";
import { Key, Scroll } from "lucide-react";
import { toast } from "react-toastify";
import { toastConfig } from "../util/toastConfig";
import SigilButton from "../components/SigilButton";

const AddVenuePage = () => {
  const [venueName, setVenueName] = useState("");
  const [venueCountry, setVenueCountry] = useState("");
  const [venueCity, setVenueCity] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venuePostalCode, setVenuePostalCode] = useState("");
  const [venueCapacity, setVenueCapacity] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user.role !== "organizer" && user.role !== "admin"){
    navigate('/');
  }

  const handleAddVenue = async (e) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append("name", venueName);
    formData.append("country", venueCountry);
    formData.append("city", venueCity);
    formData.append("address", venueAddress);
    formData.append("postal_code", venuePostalCode);
    formData.append("capacity", venueCapacity);
    setLoading(true);
    try {
      await axiosClient
        .post("/api/venues", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          toast("Venue added successfully!", toastConfig);
          navigate("/");
        });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-parchment">Consulting the archives...</div>;

  return (
    <>
      {/* Background image */}
      <img
        src="/public/liurnia.webp"
        className="fixed inset-0 w-full h-full object-cover z-0 grayscale"
      />
      {/* Background effects */}
      <div className="fixed inset-0 bg-black/60 z-10"></div>
      <div className="fixed inset-0 pointer-events-none z-15 bg-[radial-gradient(circle,transparent_40%,black_120%)]"></div>

      <div
        className="relative min-h-screen w-full flex items-center justify-center
                    z-20
                "
      >
        <div
          className="relative w-full max-w-xl bg-primary-bg border border-parchment/20
                    flex flex-col
                    "
        >
          {/* Animation */}
          <div
            className="absolute -bottom-9 -left-0.6 w-[100.5%] h-10 bg-subtle-accent pointer-events-none"
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

          <h1 className="text-4xl font-[Cinzel] mb-8 mt-4 self-center text-parchment">
            Rite of Location
          </h1>
          {/* Form */}
          <form
            className="flex flex-col justify-center items-center text-parchment"
            onSubmit={handleAddVenue}
          >
            <div className="flex flex-col md:flex-row justify-center items-stretch w-full">
              {/* Left Column */}
              <div className="flex-1 p-4 border-r border-parchment/20 flex flex-col items-center h-full">
                {/* Venue Name */}
                <div className="mb-5 flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                    Site Name
                  </label>
                  <div className="relative group">
                    <input
                      name="venueName"
                      id="venueName"
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="Venue Name"
                      required
                      className="w-60 border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                                font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    />
                  </div>
                </div>

                {/* Venue Country */}
                <div className="mb-5 flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                    Kingdom
                  </label>
                  <div className="relative group">
                    <input
                      name="venueCountry"
                      id="venueCountry"
                      type="text"
                      value={venueCountry}
                      onChange={(e) => setVenueCountry(e.target.value)}
                      placeholder="Country"
                      required
                      className="w-60 border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                                font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    />
                  </div>
                </div>

                {/* Venue City */}
                <div className="mb-5 flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                    Town
                  </label>
                  <div className="relative group">
                    <input
                      name="venueCity"
                      id="venueCity"
                      type="text"
                      value={venueCity}
                      onChange={(e) => setVenueCity(e.target.value)}
                      placeholder="City"
                      required
                      className="w-60 border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                                font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 p-4 flex flex-col items-center">
                {/* Venue Address */}
                <div className="mb-5 flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                    Residence
                  </label>
                  <div className="relative group">
                    <input
                      name="venueAddress"
                      id="venueAddress"
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="Address"
                      required
                      className="w-60 border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                                font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    />
                  </div>
                </div>

                {/* Venue Postal Code */}
                <div className="mb-5 flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                    Courier Code
                  </label>
                  <div className="relative group">
                    <input
                      name="venuePostalCode"
                      id="venuePostalCode"
                      type="number"
                      value={venuePostalCode}
                      onChange={(e) => setVenuePostalCode(e.target.value)}
                      placeholder="Postal Code"
                      required
                      className="w-60 border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                                font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    />
                  </div>
                </div>

                {/* Venue Capacity */}
                <div className="mb-5 flex flex-col">
                  <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                    Summoning Limit
                  </label>
                  <div className="relative group">
                    <input
                      name="venueCapacity"
                      id="venueCapacity"
                      type="number"
                      value={venueCapacity}
                      onChange={(e) => setVenueCapacity(e.target.value)}
                      placeholder="Venue Capacity"
                      required
                      className="w-60 border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                                font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="my-5">
              <SigilButton type={"submit"} text={"Update The Archives"} />
            </div>
            {error && <p className="text-danger-alert pb-4">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default AddVenuePage;
