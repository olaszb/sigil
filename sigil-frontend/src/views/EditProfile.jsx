import { useEffect, useState } from "react";
import axiosClient from "../services/axios-client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../util/create-event/create_event.css";
import {
  Key,
  Scroll,
  Sparkles,
  User,
} from "lucide-react";
import Editor from "../components/create-event/Editor/Editor";
import { getImageUrl } from "../util/helper";
import { toastConfig } from "../util/toastConfig";
import { toast } from "react-toastify";
import SigilButton from "../components/SigilButton";

const EditProfile = ( ) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [error, setError] = useState(null);
  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const initializeUpdatePage = async () => {
        if(user){
            setUsername(user.name || "");
            setEmail(user.email || "");
            setOriginalImage(user.image_url || null);
        }
    };
    initializeUpdatePage();
  }, [user]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);

    if (password && password !== passwordConfirmation) {
        setError("The password fragments do not align (Passwords must match).");
        return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append("name", username);
    formData.append("email", email);
    if(password){
        formData.append("password", password);
        formData.append("password_confirmation", passwordConfirmation);
    }
    if (image) {
      formData.append("image_url", image);
    }
    try {
        const response = await axiosClient.post(`/api/users/${user.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        setUser(response.data);

        toast('Profile updated successfully!', toastConfig);
        navigate(`/profile`);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      {/* Background image */}
      <img
        src="/public/edit-profile.jpg"
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
          className="relative w-full max-w-2xl bg-primary-bg border border-parchment/20
                    flex flex-col"
        >
          {/* Form */}
          <h1 className="text-4xl font-[Cinzel] mb-8 justify-self-center self-center mt-4 text-parchment">
            Rite of Modification
          </h1>
          <form
            className="flex flex-col md:flex-row h-full justify-center items-stretch text-parchment"
            onSubmit={handleUpdateProfile}
          >
            {/* Left Column */}
            <div className="flex-[4] p-4 border-r border-parchment/20 h-full">
              {/* Name */}
              <div className="mb-5 flex flex-col">
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                  Name
                </label>
                <div className="relative group">
                  <div className="absolute right-2 bottom-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                    <User size={16} />
                  </div>
                  <input
                    name="username"
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                            font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-5 flex flex-col">
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute right-2 bottom-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                    <Scroll size={16} />
                  </div>
                  <input
                    name="email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                            font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5 flex flex-col">
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute right-2 bottom-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                    <Key size={16} />
                  </div>
                  <input
                    name="password"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                            font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                  />
                </div>
              </div>
            {/* Password Confirmation */}
              <div className="mb-5 flex flex-col">
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute right-2 bottom-2 text-parchment/30 group-hover:text-main-accent group-focus-within:text-main-accent transition-colors duration-400">
                    <Key size={16} />
                  </div>
                  <input
                    name="password_confirmation"
                    id="password_confirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full border-b border-parchment/20 p-1 focus:border-main-accent hover:border-main-accent transition-colors duration-400
                                            font-[Montserrat] bg-black/60 placeholder:text-parchment/30 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-[3] bg-black/20 p-4 flex flex-col justify-center items-center border-t md:border-t-0">
              
              {/* Image Upload */}
              <div className="flex flex-col items-center mb-4">
                <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-parchment/40 mb-3">
                  Profile Picture
                </label>

                <label className="relative w-48 h-48 border-2 rounded-full border-dashed border-parchment/10 hover:border-main-accent/50 transition-all flex flex-col items-center justify-center cursor-pointer group bg-black/20 overflow-hidden">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  {(imagePreview || originalImage) ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img
                        src={imagePreview ? imagePreview : getImageUrl(originalImage)}
                        alt="Preview"
                        className="w-full h-full object-cover transition-all duration-700 rounded-full"
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
              <div className="my-3 flex justify-center">
                <SigilButton type={"submit"} text={"Save Changes"} />
              </div>
            </div>

          </form>
            {error && <p className="text-danger-alert">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default EditProfile;
