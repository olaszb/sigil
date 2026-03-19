/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ChevronDown, ChevronRight, MailWarning, Send, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../services/axios-client";
import ProfileEventItem from "../components/profile-page/ProfileEventItem";
import BoxButton from "../components/BoxButton";
import CommentItem from "../components/event-details/CommentItem";
import { getImageUrl } from "../util/helper";
import LoadingScreen from "../components/LoadingScreen";
import { toast } from "react-toastify";
import { toastConfig } from "../util/toastConfig";

const ProfilePage = ( ) => {
    const [eventsExpanded, setEventsExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState("interested");
    const [events, setEvents] = useState([]);
    const [comments, setComments] = useState([]);
    const { user, logout, setUser } = useAuth();
    const navigate = useNavigate();

    const { username } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    const [loading, setLoading] = useState(true);
    const [isResending, setIsResending] = useState(false);

    const [isTabLoading, setIsTabLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                if(username){
                    const { data } = await axiosClient.get(`/api/users/${username}`);
                    setProfileUser(data);
                    setIsOwnProfile(data.name === user.name);
                }else {
                    setProfileUser(user);
                    setIsOwnProfile(true);
                }
            }catch (error) {
                console.error("Failed to fetch profile:", error);
            }finally{ 
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username, user]);

    useEffect(() => {
        if (!activeTab || !profileUser?.id) return;

        const fetchData = async () => {
            try {
                if (activeTab === "comments") {
                    const url = username ? `/api/users/${username}/comments` : `/api/users/comments`;
                    const { data } = await axiosClient.get(url);
                    setComments(data);
                } else {
                    const url = username ? `/api/users/${username}/events` : `/api/users/events`;
                    const { data } = await axiosClient.get(url , { params: { status: activeTab } });
                    setEvents(data);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setTimeout(() => setIsTabLoading(false), 200);
            }
        };

        fetchData();
    }, [activeTab, profileUser?.id, username]);

    

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            console.log("User logged out successfully.");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleResendVerification = async () => {
        setIsResending(true);
        try {
            const response = await axiosClient.post('/api/email/verification-notification');
            toast(response.data.message || "A new sigil has been dispatched.", toastConfig);
        } catch (error) {
            if (error.response?.status === 429) {
                toast("Patience. Wait a moment before requesting another.", toastConfig);
            } else {
                toast("Failed to resend the verification.", toastConfig);
            }
        } finally {
            setIsResending(false);
        }
    }

    const handleForceVerify = async () => {
        try {
            const response = await axiosClient.post('/api/user/force-verify');
            setUser(response.data.user);
            toast("Pact sealed manually. You are now verified.", toastConfig);
        } catch (err) {
            toast("The Master Key failed to turn.", toastConfig);
        }
    }

    const handleTabChange = (newTab) => {
        if (activeTab === newTab) return;
        setIsTabLoading(true); 
        setEvents([]);
        setComments([]);
        setActiveTab(newTab);
    }

    if (loading) return <LoadingScreen />;

    return (
        <div className="w-full min-h-screen bg-secondary-bg text-parchment pb-20 overflow-x-hidden">
            <div className="bg-black/40 border border-parchment/10 flex flex-col mt-6 md:mt-10 mx-4 md:mx-10">
                <h2 className="text-main-accent text-center md:text-left md:ml-4 mt-4 font-[Cinzel] text-3xl">Profile</h2>
                <div className="flex flex-col md:flex-row items-center mb-6 md:mb-4 px-4 md:px-0">
                    <img 
                    src={profileUser?.image_url ? getImageUrl(profileUser.image_url) : '/public/default_avatar.jpg'} 
                    className="rounded-full w-24 h-24 md:w-22 md:h-20 md:ml-4 mt-4 md:mt-2 object-cover border border-parchment/20 md:border-none"/>
                    <div className="flex flex-col md:flex-row justify-between items-center md:ml-4 w-full mt-4 md:mt-0 gap-4 md:gap-0">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <p className="tracking-[1px]">{profileUser?.name ? <span className="text-parchment">{profileUser.name} | <span className="text-main-accent uppercase font-[Cinzel]">{profileUser.role}</span> </span> : "Loading..."}</p>
                            {(isOwnProfile || user?.role === 'admin') && (
                                <p className="text-sm opacity-50">{profileUser?.email}</p>
                            )}
                        </div>
                        {isOwnProfile && (
                            <div className="flex flex-row md:flex-col gap-3 md:gap-2 md:mr-4 w-full md:w-auto justify-center">
                                <Link to="/profile/edit" className="flex-1 md:flex-none">
                                    <button className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-parchment/60 
                                    hover:text-parchment bg-white/5 hover:bg-white/15 transition-all duration-300 
                                    border border-parchment/10 hover:border-parchment/20">
                                        Edit Profile
                                    </button>
                                </Link>
                                    <BoxButton text={"Logout"} color={"main-accent"} onClick={handleLogout}/>
                                
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isOwnProfile && profileUser?.email_verified_at === null && (
                <div className="mx-4 md:mx-10 mt-5 p-4 border border-main-accent/40 bg-[#1a0505] flex flex-col lg:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <div className="flex items-center gap-4">
                        <MailWarning className="text-main-accent shrink-0" size={24} />
                        <div>
                            <h3 className="text-sm font-[Cinzel] text-main-accent uppercase tracking-wider">Unverified Identity</h3>
                            <p className="text-xs font-[Montserrat] text-parchment/70">
                                Verify your email to unlock the ability to leave whispers and join rituals.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
                        <button 
                            onClick={handleResendVerification}
                            disabled={isResending}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] bg-main-accent/10 hover:bg-main-accent/20 text-main-accent px-4 py-2 border border-main-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            {isResending ? "Casting..." : <><Send size={12} /> Resend Sigil</>}
                        </button>
                        <button 
                            onClick={handleForceVerify}
                            className="flex items-center gap-2 px-4 py-2 bg-main-accent/10 border border-main-accent/50 text-main-accent text-[10px] uppercase tracking-widest hover:bg-main-accent hover:text-primary-bg transition-all duration-300"
                        >
                            <ShieldCheck size={14} />
                            Force Verify (Demo Bypass)
                        </button>
                    </div>
                </div>
            )}


            <div className="bg-black/20 flex flex-col md:flex-row mx-4 md:mx-10 mt-5 border border-parchment/10 min-h-[400px]">
                {/* Sidebar */}
                <div className="w-full md:w-48 lg:w-64 bg-black/40 shrink-0 border-b md:border-b-0 md:border-r border-parchment/10 overflow-hidden">
                    {(profileUser?.role !== 'organizer' && profileUser?.role !== 'admin') && (
                        <>
                            <div onClick={() => setEventsExpanded((prev) => !prev)} 
                                className="group py-4 flex items-center justify-center text-center hover:bg-parchment/5 transition-colors duration-400 cursor-pointer">
                                <span className="group-hover:text-main-accent transition-colors duration-400 mr-2">
                                    Events
                                </span>
                                {eventsExpanded ? <ChevronDown size={14} className="text-main-accent"/> : <ChevronRight size={14} className="text-main-accent"/>}
                            </div>
                            <div className={`overflow-hidden transition-all duration-500 bg-black/20 ${eventsExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                                {['Interested', 'Going', 'Attended'].map((status) => (
                                    <div key={status} onClick={() => handleTabChange(status.toLowerCase())} 
                                        className={`py-3 px-4 text-xs uppercase tracking-[0.2em] hover:text-main-accent hover:bg-parchment/5 cursor-pointer transition-all border-b border-parchment/5 relative ${activeTab === status.toLowerCase() ? "text-main-accent bg-parchment/5" : "text-parchment"}`}>
                                        {status}
                                    </div>
                                ))}
                            </div>
                            {(isOwnProfile || user?.role === 'admin') && (
                                <div 
                                    onClick={() => handleTabChange('tickets')} 
                                    className={`py-4 text-center hover:bg-parchment/5 hover:text-main-accent transition-colors duration-400 cursor-pointer 
                                    ${activeTab === 'tickets' ? "text-main-accent bg-parchment/5" : "text-parchment"}`}
                                >
                                    Tickets
                                </div>
                            )}
                        </>
                    )}
                    <div onClick={() => handleTabChange('comments')} 
                        className={`py-4 text-center hover:bg-parchment/5 hover:text-main-accent transition-colors duration-400 cursor-pointer
                        ${activeTab === 'comments' ? "text-main-accent bg-parchment/5" : "text-parchment"}`}>
                        Comments
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                    <div className={`p-4 md:p-8 pb-4 transition-all duration-700 ease-in-out
                        ${isTabLoading ? "opacity-50 translate-y-8 scale-100" : "opacity-100 translate-y-0 scale-100"}`}>
                        {events && events.length > 0 ? (
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <ProfileEventItem key={event.id} event={event}/>
                                ))}
                            </div>
                        ) : (activeTab === 'comments' && comments.length > 0) ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <CommentItem key={comment.id} comment={comment} type={"profile"}/>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center min-h-[300px]">
                                <p className="text-parchment/50 font-[Montserrat] italic">
                                    The archives are empty for this selection...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;