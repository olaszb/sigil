import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axiosClient from "../services/axios-client";

const CheckoutResult = () => {
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");
    const sessionId = searchParams.get("session_id");
    const eventSlug = searchParams.get("event");


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(status === "success");
    const [error, setError] = useState("");

    useEffect(() => {
        const run = async () => {
            if (status !== "success" || !sessionId) return;

            try {
                const res = await axiosClient.get(`/api/checkout/session/${sessionId}`);
                setData(res.data);
            } catch (err) {
                console.error("Checkout session fetch failed:", err);
                setError("The ledger could not be finalized. Please check your profile or contact support.");
            } finally{
                setLoading(false);
            }
        };
        run();
    }, [status, sessionId]);

    const isCancelled = status === "cancel";

    const formattedTotal = data && Number(data.amount_total ?? 0) > 0
        ? new Intl.NumberFormat("en-Us", { 
            style: "currency", 
            currency: (data.currency || "HUF").toUpperCase(),
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
        .format(Number(data.amount_total))
        : null;

    const actionLink = isCancelled 
        ? eventSlug 
            ? `/events/${eventSlug}` 
            : "/events" 
        : "/profile";

    const actionText = isCancelled ? "Return" : "Go to profile";

    return (
        <>
            <img
                src="/Vampire_Castle.jpg"
                className="fixed inset-0 z-0 h-full w-full object-cover opacity-80 grayscale"
                alt="Castle archive"
            />
            <div className="fixed inset-0 z-10 bg-black/80" />
            <div className="fixed inset-0 z-15 bg-[radial-gradient(circle,transparent_40%,black_120%)] pointer-events-none" />

            <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl border border-parchment/20 bg-primary-bg/90 shadow-[0_0_35px_rgba(154,0,0,0.2)] backdrop-blur-sm">
                    <div className="flex items-center justify-between border-b border-parchment/10 bg-black/20 px-6 py-4">
                        <span
                            className={`inline-flex items-center gap-2 border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] ${
                                isCancelled
                                ? "border-parchment/30 text-parchment/80"
                                : "border-main-accent/40 bg-main-accent/10 text-main-accent"
                            }`}
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${
                                isCancelled ? "bg-parchment/80" : "bg-main-accent"
                                }`}
                            />
                            {isCancelled ? "Order paused" : "Receipt confirmed"}
                        </span>

                        <span className="text-[10px] uppercase tracking-[0.3em] text-parchment/40">
                        Sigil Checkout
                        </span>
                    </div>

                    <div className="p-6 md:p-8">
                        <h1 className="text-3xl md:text-4xl font-[Cinzel] uppercase tracking-[0.06em] text-parchment">
                            {isCancelled ? "The ritual was paused" : "Your tickets are secured"}
                        </h1>

                        <p className="mt-3 max-w-xl text-sm md:text-base font-[Montserrat] leading-relaxed text-parchment/70">
                            {isCancelled
                                ? "No charge was processed and your reservation remains open. You can return to the event and try again whenever you're ready."
                                : "Your purchase has been recorded. The archive is now preparing your tickets and seat details for your profile."}
                        </p>

                        {loading && (
                            <div className="mt-8 flex items-center gap-3 rounded border border-main-accent/20 bg-main-accent/5 p-4">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-main-accent/40 border-t-main-accent" />
                                <p className="font-[Montserrat] text-sm text-parchment/80">
                                Finalizing your tickets...
                                </p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="mt-8 rounded border border-red-500/30 bg-red-500/5 p-4">
                                <p className="font-[Montserrat] text-sm text-red-200">{error}</p>
                            </div>
                        )}

                        {!loading && !isCancelled && data && (
                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                <div className="border border-parchment/10 bg-black/20 p-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-parchment/40">
                                    Status
                                </p>
                                <p className="mt-2 font-[Cinzel] text-xl text-parchment">
                                    {data.status}
                                </p>
                                </div>

                                <div className="border border-parchment/10 bg-black/20 p-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-parchment/40">
                                    Total
                                </p>
                                <p className="mt-2 font-[Cinzel] text-xl text-main-accent">
                                    {formattedTotal}
                                </p>
                                </div>

                                <div className="border border-parchment/10 bg-black/20 p-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-parchment/40">
                                    Ticket(s)
                                </p>
                                <p className="mt-2 font-[Cinzel] text-xl text-parchment">
                                    {data.tickets?.length ?? 0}
                                </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to={actionLink}
                                className="inline-flex items-center justify-center border border-main-accent/40 bg-main-accent/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-main-accent transition-all duration-300 hover:bg-main-accent hover:text-primary-bg hover:shadow-[0_0_20px_rgba(154,0,0,0.3)]"
                            >
                                {actionText}
                            </Link>

                            {!isCancelled && (
                                <Link
                                to="/events"
                                className="inline-flex items-center justify-center border border-parchment/20 bg-black/20 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-parchment/80 transition-all duration-300 hover:border-main-accent/40 hover:text-parchment"
                                >
                                Browse more events
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutResult;