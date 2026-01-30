import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="page-container" style={{ textAlign: 'center', color: '#e0e0e0' }}>
            <div className="glass-card" style={{ maxWidth: '600px', backgroundColor: 'rgba(20, 20, 20, 0.8)' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: '#c5a059', textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
                    MAFIA WARS
                </h1>
                <p style={{ fontSize: '1.2rem', margin: '20px 0', fontFamily: 'Inter, sans-serif' }}>
                    Welcome to the family. Loyalty is everything.
                    <br />
                    Join the syndicate and rise through the ranks.
                </p>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                    <Link to="/login">
                        <button style={{ width: '150px' }}>Login</button>
                    </Link>
                    <Link to="/register">
                        <button style={{ width: '150px', background: 'transparent', border: '2px solid #c5a059', color: '#c5a059' }}>
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
