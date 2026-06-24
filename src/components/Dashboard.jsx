import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <h1 className="Display-2 text-primary">Dashboard</h1>
            <p>Este es el dashboard</p>

        </div>
    );
}

export default Dashboard;