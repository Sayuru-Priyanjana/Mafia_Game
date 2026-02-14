import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) return null;

    return (
        <div className="page-container" style={{ textAlign: 'center', color: '#e0e0e0' }}>
            <div className="glass-card" style={{ maxWidth: '600px', backgroundColor: 'rgba(20, 20, 20, 0.8)' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: '#c5a059', textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
                    MAFIA WARS
                </h1>
                <p style={{ fontSize: '1.2rem', margin: '20px 0', fontFamily: 'Inter, sans-serif' }}>
                    Welcome to the family, <span style={{ color: '#c5a059', fontWeight: 'bold' }}>{user.firstname}</span>.
                </p>
                <p style={{ fontSize: '1rem', marginBottom: '30px', fontFamily: 'Inter, sans-serif' }}>
                    Loyalty is everything.
                </p>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                    <button onClick={handleLogout} style={{ width: '150px', background: '#d9534f', border: 'none', color: 'white' }}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
