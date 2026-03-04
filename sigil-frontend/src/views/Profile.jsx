import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ChevronDown, ChevronRight } from "lucide-react";
import SigilButton from "../components/SigilButton";
import { useNavigate } from "react-router-dom";
import axiosClient from "../services/axios-client";
import ProfileEventItem from "../components/profile-page/ProfileEventItem";

const ProfilePage = ( ) => {
    const [eventsExpanded, setEventsExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState("interested");
    const [events, setEvents] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!activeTab) return;

        const fetchEvents = async () => {
            try {
                const { data } = await axiosClient.get(`/api/user/events?status=${activeTab.toLowerCase()}`);
                setEvents(data);
            }catch (error) {
                console.error("Failed to fetch events:", error);
            }
        };
        fetchEvents();

    }, [activeTab]);

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
                    {user?.image_url ? (
                        <></>
                    ) : (
                        <img src="/public/default_avatar.jpg" className="rounded-full w-20 h-20 ml-4 mt-2"/>
                    )}
                    <div className="flex justify-between items-center ml-4 w-full">
                        <div className="flex flex-col ">
                            <p className="tracking-[1px]">{user?.name}</p>
                            <p>{user?.email}</p>
                        </div>
                        <div className="flex flex-col gap-2 mr-4">
                            {/* <SigilButton text={"Edit Profile"} clipPath={"[clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]"}/>
                            <SigilButton text={"Logout"} clipPath={"[clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]"}/> */}
                            <button className="px-4 py-2 border-b border-main-accent hover:bg-parchment/5 transition-colors duration-400">
                                Edit Profile
                            </button>
                            <button onClick={handleLogout} className="px-4 py-2 border-b border-main-accent hover:bg-parchment/5 transition-colors duration-400">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-black/20 flex flex-row mx-10 mt-5 border border-parchment/10 h-[400px] ">
                {/* Sidebar */}
                <div className="flex-[1] bg-black/40 overflow-hidden">
                    {(user.role !== 'organizer' && user.role !== 'admin') && (
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
                            <div className="py-4 text-center hover:bg-parchment/5 hover:text-main-accent transition-colors duration-400 cursor-pointer">
                                Tickets
                            </div>
                        </>
                    )}
                    <div className="py-4 text-center hover:bg-parchment/5 hover:text-main-accent transition-colors duration-400 cursor-pointer">
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
                    ) : (
                        <p className="text-parchment">Click on a tab to view content.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;