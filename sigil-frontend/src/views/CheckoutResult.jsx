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

    useEffect(() => {
        const run = async () => {
            if (status !== "success" || !sessionId) return;

            try {
                const res = await axiosClient.get(`/api/checkout/session/${sessionId}`);
                setData(res.data);
            } finally{
                setLoading(false);
            }
        };
        run();
    }, [status, sessionId]);

    if (status === "cancel") {
    return (
      <div className="p-8 text-parchment">
        <h1 className="text-2xl mb-4">Payment canceled</h1>
        <Link to={eventSlug ? `/events/${eventSlug}` : "/events"}>Return</Link>
      </div>
    );
  }

  return (
    <div className="p-8 text-parchment">
        <h1 className="text-2xl mb-4">Payment Successful</h1>
        {loading && <p>Finalizing your tickets...</p>}
        {!loading && data && (
            <>
                <p>Status: {data.status}</p>
                <p>Total: {data.amount_total} {data.currency.toUpperCase()}</p>
                <p>Tickets: {data.tickets.length}</p>
                <Link to="/profile">Go to profile</Link>
            </>
        )}
    </div>
  );
};

export default CheckoutResult;