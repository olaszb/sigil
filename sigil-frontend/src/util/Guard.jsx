import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

const PrivateGuard = () => {
    const {user} = useAuth();
    return user ? <Outlet/> : <Navigate to="/login"/>;
};

const PublicGuard = () => {
    const {user} = useAuth();
    return !user ? <Outlet/> : <Navigate to="/profile"/>;
};

const AdminGuard = () => {
    const {user} = useAuth();
    return user.role === 'admin' ? <Outlet /> : <Navigate to="/"/>;
}

const AdminOrOrganizerGuard = () => {
    const {user} = useAuth();
    return (user.role === 'admin' || user.role === 'organizer') ? <Outlet /> : <Navigate to="/"/>;
}

const VerifiedGuard = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;
    
    if (!user.email_verified_at) {
        return <Navigate to="/verify-notice" />;
    }

    return <Outlet />;
}

export {PrivateGuard, PublicGuard, AdminGuard, AdminOrOrganizerGuard, VerifiedGuard};