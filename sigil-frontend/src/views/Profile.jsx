import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../services/axios-client";
import ProfileEventItem from "../components/profile-page/ProfileEventItem";
import BoxButton from "../components/BoxButton";
import CommentItem from "../components/event-details/CommentItem";
import { getImageUrl } from "../util/helper";

const ProfilePage = ( ) => {
    const [eventsExpanded, setEventsExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState("interested");
    const [events, setEvents] = useState([]);
    const [comments, setComments] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const { username } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
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
            }
        };
        fetchProfile();
    }, [username, user]);

    useEffect(() => {
        if (!activeTab || !profileUser?.id) return;

        const fetchEvents = async () => {
            try {
                const url = username ? `/api/users/${username}/events` : `/api/users/events`;
                const { data } = await axiosClient.get(url , { params: { status: activeTab } });
                setEvents(data);
                setComments([]);
            }catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };
        const fetchComments = async () => {
            try {
                const url = username ? `/api/users/${username}/comments` : `/api/users/comments`;
                const { data } = await axiosClient.get(url);
                setComments(data);
                setEvents([]);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            }
        };
        fetchEvents();
        if (activeTab === "comments") {
            fetchComments();
        }

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

    return (
        <div className="w-full min-h-screen bg-secondary-bg text-parchment">
            <div className="bg-black/40 border border-parchment/10 flex flex-col mt-10 mx-10">
                <h2 className="text-main-accent ml-4 mt-4 font-[Cinzel] text-3xl">Profile</h2>
                <div className="flex items-center mb-4">
                    {profileUser?.image_url ? (
                        <img src={getImageUrl(profileUser.image_url)} className="rounded-full w-20 h-20 ml-4 mt-2"/>
                    ) : (
                        <img src="/public/default_avatar.jpg" className="rounded-full w-20 h-20 ml-4 mt-2"/>
                    )}
                    <div className="flex justify-between items-center ml-4 w-full">
                        <div className="flex flex-col ">
                            <p className="tracking-[1px]">{profileUser?.name ? <span className="text-parchment">{profileUser.name} | <span className="text-main-accent uppercase font-[Cinzel]">{profileUser.role}</span> </span> : "Loading..."}</p>
                            {(isOwnProfile || user?.role === 'admin') && (
                                <p className="text-sm opacity-50">{profileUser?.email}</p>
                            )}
                        </div>
                        {isOwnProfile && (
                            <div className="flex flex-col gap-2 mr-4">
                                <Link to="/profile/edit">
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
            <div className="bg-black/20 flex flex-row mx-10 mt-5 border border-parchment/10 h-[400px] ">
                {/* Sidebar */}
                <div className="flex-[1] bg-black/40 overflow-hidden">
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
                                    <div key={status} onClick={() => setActiveTab(status.toLowerCase())} 
                                        className={`py-3 px-4 text-xs uppercase tracking-[0.2em] hover:text-main-accent hover:bg-parchment/5 cursor-pointer transition-all border-b border-parchment/5 relative ${activeTab === status.toLowerCase() ? "text-main-accent bg-parchment/5" : "text-parchment"}`}>
                                        {status}
                                    </div>
                                ))}
                            </div>
                            {(isOwnProfile || user?.role === 'admin') && (
                                <div 
                                    onClick={() => setActiveTab('tickets')} 
                                    className={`py-4 text-center hover:bg-parchment/5 hover:text-main-accent transition-colors duration-400 cursor-pointer 
                                    ${activeTab === 'tickets' ? "text-main-accent bg-parchment/5" : "text-parchment"}`}
                                >
                                    Tickets
                                </div>
                            )}
                        </>
                    )}
                    <div onClick={() => setActiveTab('comments')} 
                        className={`py-4 text-center hover:bg-parchment/5 hover:text-main-accent transition-colors duration-400 cursor-pointer
                        ${activeTab === 'comments' ? "text-main-accent bg-parchment/5" : "text-parchment"}`}>
                        Comments
                    </div>
                </div>
                <div className="flex-[4] p-8 pb-4 overflow-y-auto">
                    {events && events.length > 0 ? (
                        <div >
                            {events.map((event) => (
                                <ProfileEventItem key={event.id} event={event}/>
                            ))}
                        </div>
                    ) : (activeTab === 'comments' && comments.length > 0) ? (
                        <div>
                            {comments.map((comment) => (
                                <CommentItem key={comment.id} comment={comment} type={"profile"}/>
                            ))}
                        </div>
                    ) : (
                        
                        <p className="text-parchment">Click on a tab to view content.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;