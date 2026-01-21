import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";

const PrivateGuard = () => {
    const {user} = useAuth();
    return user ? <Outlet/> : <Navigate to="/login"/>;
};

const PublicGuard = () => {
    const {user} = useAuth();
    return !user ? <Outlet/> : <Navigate to="/"/>;
};

export {PrivateGuard, PublicGuard};