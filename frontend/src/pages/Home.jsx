import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [team, setTeam] = useState(null);
    const [teamName, setTeamName] = useState("");
    const [memberEmail, setMemberEmail] = useState("");

    // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchTeam(parsedUser.id || parsedUser._id);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const fetchTeam = async (userId) => {
        try {
            const res = await axios.get(`${API_URL}/team/${userId}`);
            if (res.data.success && res.data.team) {
                setTeam(res.data.team);
            }
        } catch (error) {
            console.error("Error fetching team:", error);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/team/create`, {
                userId: user.id || user._id,
                name: teamName
            });
            if (res.data.success) {
                setTeam(res.data.team);
                alert("Team created successfully!");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Error creating team");
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/team/addMember`, {
                teamId: team._id,
                email: memberEmail
            });
            if (res.data.success) {
                setTeam(res.data.team);
                setMemberEmail("");
                alert("Member added successfully!");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Error adding member");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) return null;

    return (
        <div className="page-container" style={{ textAlign: 'center', color: '#e0e0e0', padding: '20px' }}>
            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'rgba(20, 20, 20, 0.8)' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: '#c5a059', textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
                    MAFIA WARS
                </h1>
                <p style={{ fontSize: '1.2rem', margin: '20px 0', fontFamily: 'Inter, sans-serif' }}>
                    Welcome to the family, <span style={{ color: '#c5a059', fontWeight: 'bold' }}>{user.firstname}</span>.
                </p>

                {/* Team Section */}
                <div style={{ marginTop: '40px', padding: '20px', borderTop: '1px solid #333' }}>
                    {team ? (
                        <div>
                            <h2 style={{ color: '#c5a059' }}>Team: {team.name}</h2>
                            <div style={{ marginTop: '20px', textAlign: 'left' }}>
                                <h3>Members:</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {team.members.map((member) => (
                                        <li key={member._id} style={{ padding: '10px', borderBottom: '1px solid #444' }}>
                                            {member.firstname} ({member.email})
                                            {member._id === team.leader && <span style={{ color: '#c5a059', marginLeft: '10px' }}>(Leader)</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <form onSubmit={handleAddMember} style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <input
                                    type="email"
                                    placeholder="Member Email"
                                    value={memberEmail}
                                    onChange={(e) => setMemberEmail(e.target.value)}
                                    required
                                    style={{ padding: '10px', width: '250px' }}
                                />
                                <button type="submit" style={{ padding: '10px 20px', background: '#c5a059', border: 'none', color: '#000', fontWeight: 'bold' }}>
                                    Add Member
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ color: '#e0e0e0' }}>Create Your Crew</h2>
                            <form onSubmit={handleCreateTeam} style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Team Name"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    required
                                    style={{ padding: '10px', width: '250px' }}
                                />
                                <button type="submit" style={{ padding: '10px 20px', background: '#c5a059', border: 'none', color: '#000', fontWeight: 'bold' }}>
                                    Create Team
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                    <button onClick={handleLogout} style={{ width: '150px', background: '#d9534f', border: 'none', color: 'white' }}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
