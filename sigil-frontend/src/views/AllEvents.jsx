/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import Events from "../components/home/Events";
import SigilHero from "../components/SigilHero";
import axiosClient from "../services/axios-client";
import LoadingScreen from "../components/LoadingScreen";
import { scrollToId, monthNames } from "../util/helper";
import { Search } from "lucide-react";


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
        getEvents(1, "", "");
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getEvents(1, searchTerm, selectedMonth);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleMonthChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        getEvents(1, searchTerm, month);
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

                <div className="w-full md:w-64">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-main-accent mb-2 font-bold">
                        Filter by Lunar Cycle
                    </label>
                    <select 
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="w-full bg-black/40 border border-parchment/10 text-parchment py-4 px-4 outline-none focus:border-main-accent font-[Montserrat] appearance-none cursor-pointer"
                    >
                        <option value="">All Cycles</option>
                        {monthNames.map((name, index) => (
                            <option key={name} value={index + 1}>
                                {name}
                            </option>
                        ))}
                    </select>
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