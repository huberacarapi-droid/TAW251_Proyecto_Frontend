import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <>
            <Navbar />
            <div className="container-fluid mt-4">
                <Outlet />
            </div>
        </>
    );
}

export default MainLayout;