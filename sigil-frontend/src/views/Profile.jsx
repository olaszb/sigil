import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ChevronDown, ChevronRight } from "lucide-react";

const ProfilePage = ( ) => {
    const [eventsExpanded, setEventsExpanded] = useState(false);
    const { user } = useAuth();
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
                    <div className="flex flex-col items-left ml-4">
                        <p>{user?.name}</p>
                        <p>{user?.email}</p>
                    </div>
                </div>
            </div>
            <div className="bg-black/20 flex flex-row mx-10 mt-5 border border-parchment/10">
                {/* Sidebar */}
                <div className="flex-[1] bg-black/40">
                    <div onClick={() => setEventsExpanded((prev) => !prev)} 
                        className="group py-4 flex items-center justify-center text-center hover:bg-parchment/5 transition-colors duration-400 border-b border-parchment/20 cursor-pointer">
                        <span className="group-hover:text-main-accent transition-colors duration-400 mr-2">
                            Events
                        </span>
                        {eventsExpanded ? <ChevronDown size={14} className="text-main-accent"/> : <ChevronRight size={14} className="text-main-accent"/>}
                    </div>
                    <div className={`overflow-hidden transition-all duration-500 bg-black/20 ${eventsExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                        {['Interested', 'Going', 'Attended'].map((status) => (
                            <div key={status} className="py-3 px-4 text-xs uppercase tracking-[0.2em] text-parchment hover:text-main-accent hover:bg-parchment/5 cursor-pointer transition-all border-b border-parchment/5 relative">
                                {status}
                            </div>
                        ))}
                    </div>
                    <div className="py-4 text-center hover:bg-parchment/5 hover:text-main-accent transition-colors duration-400 border-b border-parchment/20 cursor-pointer">
                        Comments
                    </div>
                    <div className="py-4 text-center hover:bg-parchment/5 hover:text-main-accent transition-colors duration-400 cursor-pointer">
                        Tickets
                    </div>
                </div>
                <div className="flex-[4]">
                    asd
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;