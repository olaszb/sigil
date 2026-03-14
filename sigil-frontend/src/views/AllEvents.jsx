/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import Events from "../components/home/Events";
import SigilHero from "../components/SigilHero";
import axiosClient from "../services/axios-client";
import LoadingScreen from "../components/LoadingScreen";
import { scrollToId, monthNames } from "../util/helper";
import { ChevronDown, Search } from "lucide-react";


const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 1,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [activeMonths, setActiveMonths] = useState([]);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchActiveMonths = async () => {
        try{
            const { data } = await axiosClient.get("/api/events/active-months");
            setActiveMonths(data);
        }catch (err) { console.error(err);}
    }

    const getEvents = useCallback(async (page = 1, search = searchTerm, month = selectedMonth) => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/api/events`, {
                params: {page, search, month}
            });
            setEvents(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                per_page: response.data.per_page,
                total: response.data.total,
            });
            scrollToId("title");
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedMonth]);

    useEffect(() => {
        fetchActiveMonths();
        getEvents(1, "", "");

        const handleClickOutside = (e) => {
            if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
                setIsDropDownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getEvents(1, searchTerm, selectedMonth);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const selectMonth = (monthValue) => {
        setSelectedMonth(monthValue);
        setIsDropDownOpen(false);
        getEvents(1, searchTerm, monthValue);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        getEvents(1, searchTerm, selectedMonth);
        scrollToId("title");
    }

    if (loading && events.length === 0) return <LoadingScreen />;

    return (
        <div className="w-full">
            <div className="grayscale mb-10">
                <SigilHero image_url={"/public/arena.jpg"} title={"The Grand Registry"} />
            </div>
 
            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-end gap-6 px-10 mb-12">
                <div className="flex-1 w-full">
                    <form onSubmit={handleSearchSubmit} className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment/30 group-focus-within:text-main-accent transition-colors" size={20} />
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by ritual name..."
                            className="w-full bg-black/20 border-b border-parchment/10 py-4 pl-12 pr-4 text-parchment font-[Montserrat] outline-none focus:border-main-accent transition-all"
                        />
                    </form>
                </div>

                <div className="w-full md:w-64 text-parchment relative" ref={dropdownRef}>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-main-accent mb-2 font-bold">
                        Filter by Lunar Cycle
                    </label>
                    <div
                        onClick={() => setIsDropDownOpen(prev => !prev)}
                        className={`w-full bg-black/40 border ${isDropDownOpen ? 'border-main-accent' : 'border-parchment/10'}
                        text-parchment py-4 px-4 font-[Montserrat] flex justify-between items-center cursor-pointer transition-all`}
                    >
                        <span className={!selectedMonth ? "opacity-40" : ""}>
                            {selectedMonth ? monthNames[selectedMonth - 1] : "All Months"}
                        </span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${isDropDownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    <div className={`absolute top-full left-0 w-full bg-[#111] border border-parchment/10 z-[100] mt-1 shadow-2xl
                    transition-all duration-500 ease-in-out origin-top overflow-hidden
                    ${isDropDownOpen ? 'max-h-60 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0 pointer-events-none'}
                    `}>
                        <div
                            onClick={() => selectMonth("")}
                            className="px-4 py-3 hover:bg-main-accent/10 hover:text-main-accent transition-colors cursor-pointer text-sm"
                        >
                            All Months
                        </div>
                        {activeMonths.map((m) => (
                            <div key={m}
                                onClick={() => selectMonth(m)}
                                className="px-4 py-3 hover:bg-main-accent/10 hover:text-main-accent transition-colors cursor-pointer text-sm border-t border-parchment/5">
                                {monthNames[m - 1]}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Events events={events} type="current"/>

            {pagination.last_page > 1 && (
                <Pagination pagination={pagination} getEvents={getEvents} />
            )}
        </div>
    );
}

export default AllEvents;