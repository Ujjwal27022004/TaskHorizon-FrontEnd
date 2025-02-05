import React, { useEffect, useState } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import axios from "axios";

const TeamsAndChannels = () => {
    const [teams, setTeams] = useState([]);
    const [channels, setChannels] = useState({});
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        microsoftTeams.initialize();
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        const token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IllBVXVzUG0wNHVxZlctenJNcFNwMHNPQ2NLMWR6Qmo1OTcwTnJZTllSLW8iLCJhbGciOiJSUzI1NiIsIng1dCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEvIiwiaWF0IjoxNzM4NzMzNDAwLCJuYmYiOjE3Mzg3MzM0MDAsImV4cCI6MTczODgyMDEwMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhaQUFBQXhTWGkyYjUxREE2RWd3bUZhVFdjV1JOTXdxVnBMSWVjWHhLSUJMRUZZcW9pNlQ1NncvYTZjTnFhVzU4ZmRZTFF4Nkt4QTBvd2p2ckJtOEtleXdtUVdEb2RSVmU1U0d5ZEtJWmFJZ1VpR3ZnPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiVGVhbSIsImdpdmVuX25hbWUiOiJEZXZlbG9wbWVudCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjI0MDE6NDkwMDoxYzQ1OmNjZjQ6NThhZTo4NzIzOjczMzM6NzI4NSIsIm5hbWUiOiJEZXZlbG9wbWVudCBUZWFtIiwib2lkIjoiMTM2MGJjNzktYTBlMi00YjcwLTg5YWYtZGMxYjAzNWEzMDM0IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDA0M0Q2RTlFRDgiLCJyaCI6IjEuQVQwQXcyRnNZTDZTMVVtTXh5VWhVUzdiWVFNQUFBQUFBQUFBd0FBQUFBQUFBQUE5QVBZOUFBLiIsInNjcCI6IkNoYW5uZWwuUmVhZEJhc2ljLkFsbCBDaGFubmVsTWVzc2FnZS5TZW5kIENoYXQuQ3JlYXRlIE5vdGlmaWNhdGlvbnMuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBvcGVuaWQgcHJvZmlsZSBUZWFtLkNyZWF0ZSBUZWFtLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkIFVzZXIuUmVhZEJhc2ljLkFsbCBVc2VyQWN0aXZpdHkuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBlbWFpbCIsInNpZCI6IjAwMWYyOGE5LTMxODctNjAzNi02YTU2LTMyMzQyNDExZTc4NyIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IlE0ZUc5TTBYUlJNMzR1UzhPTjNfdjBKODNtaEF0RFhXYkFpanFtRHZ5Z2siLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiI2MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEiLCJ1bmlxdWVfbmFtZSI6ImRldnRlYW1AY29ubmVjdGljdXMuaW4iLCJ1cG4iOiJkZXZ0ZWFtQGNvbm5lY3RpY3VzLmluIiwidXRpIjoiMElQNVBWX2JoRU95bGtoQWtJZFlBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19jYyI6WyJDUDEiXSwieG1zX2Z0ZCI6IkJxQkxSSkVEdFd0Sm9tTWY0dzNKMnJWa1lhUWFSRnUzYTZoUkZGbkNaWHMiLCJ4bXNfaWRyZWwiOiIxIDIyIiwieG1zX3NzbSI6IjEiLCJ4bXNfc3QiOnsic3ViIjoid051UXdST2ZROThuRHBQcHlBVUtMSXVVaHhVUjl5el9mSzF2ejhENHlGcyJ9LCJ4bXNfdGNkdCI6MTU1ODc2MTUyOH0.WaGO3Hc7o9fXkvZ_UTsyx2oinxJC_2rj0ScardjaW7OYn4l6tQZN7ofBXuXnhdFaka62DOzSOzrDlXjPfiOujPnbJelkAhxDWq-jhsA-r_GAzsp6ZTgjhM4AD7RDIofdUDZofCEZuQbs7rBZaAYWKC6ePEX6I9CpPKaTJVLWDlKKXJaXG8M_pnO8WMuuGn_sZYwU8DM0FbUqn_DmO3HdcLBqiI2aMw1ymqCvtHrp6uPnuTe12ySL0_wxTOf2kLP4zxHdM54rI9e08CP5ekGM2PF6g2sqQ9b6BQOpXXu3WLSqqYjzRjljhgMiS5blglpM7wJjREqiY4b1Gmsjmc3J1w";
        const response = await axios.get("https://graph.microsoft.com/v1.0/me/joinedTeams", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(response.data.value);
    };

    const fetchChannels = async (teamId) => {
        const token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IllBVXVzUG0wNHVxZlctenJNcFNwMHNPQ2NLMWR6Qmo1OTcwTnJZTllSLW8iLCJhbGciOiJSUzI1NiIsIng1dCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEvIiwiaWF0IjoxNzM4NzMzNDAwLCJuYmYiOjE3Mzg3MzM0MDAsImV4cCI6MTczODgyMDEwMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhaQUFBQXhTWGkyYjUxREE2RWd3bUZhVFdjV1JOTXdxVnBMSWVjWHhLSUJMRUZZcW9pNlQ1NncvYTZjTnFhVzU4ZmRZTFF4Nkt4QTBvd2p2ckJtOEtleXdtUVdEb2RSVmU1U0d5ZEtJWmFJZ1VpR3ZnPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiVGVhbSIsImdpdmVuX25hbWUiOiJEZXZlbG9wbWVudCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjI0MDE6NDkwMDoxYzQ1OmNjZjQ6NThhZTo4NzIzOjczMzM6NzI4NSIsIm5hbWUiOiJEZXZlbG9wbWVudCBUZWFtIiwib2lkIjoiMTM2MGJjNzktYTBlMi00YjcwLTg5YWYtZGMxYjAzNWEzMDM0IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDA0M0Q2RTlFRDgiLCJyaCI6IjEuQVQwQXcyRnNZTDZTMVVtTXh5VWhVUzdiWVFNQUFBQUFBQUFBd0FBQUFBQUFBQUE5QVBZOUFBLiIsInNjcCI6IkNoYW5uZWwuUmVhZEJhc2ljLkFsbCBDaGFubmVsTWVzc2FnZS5TZW5kIENoYXQuQ3JlYXRlIE5vdGlmaWNhdGlvbnMuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBvcGVuaWQgcHJvZmlsZSBUZWFtLkNyZWF0ZSBUZWFtLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkIFVzZXIuUmVhZEJhc2ljLkFsbCBVc2VyQWN0aXZpdHkuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBlbWFpbCIsInNpZCI6IjAwMWYyOGE5LTMxODctNjAzNi02YTU2LTMyMzQyNDExZTc4NyIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IlE0ZUc5TTBYUlJNMzR1UzhPTjNfdjBKODNtaEF0RFhXYkFpanFtRHZ5Z2siLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiI2MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEiLCJ1bmlxdWVfbmFtZSI6ImRldnRlYW1AY29ubmVjdGljdXMuaW4iLCJ1cG4iOiJkZXZ0ZWFtQGNvbm5lY3RpY3VzLmluIiwidXRpIjoiMElQNVBWX2JoRU95bGtoQWtJZFlBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19jYyI6WyJDUDEiXSwieG1zX2Z0ZCI6IkJxQkxSSkVEdFd0Sm9tTWY0dzNKMnJWa1lhUWFSRnUzYTZoUkZGbkNaWHMiLCJ4bXNfaWRyZWwiOiIxIDIyIiwieG1zX3NzbSI6IjEiLCJ4bXNfc3QiOnsic3ViIjoid051UXdST2ZROThuRHBQcHlBVUtMSXVVaHhVUjl5el9mSzF2ejhENHlGcyJ9LCJ4bXNfdGNkdCI6MTU1ODc2MTUyOH0.WaGO3Hc7o9fXkvZ_UTsyx2oinxJC_2rj0ScardjaW7OYn4l6tQZN7ofBXuXnhdFaka62DOzSOzrDlXjPfiOujPnbJelkAhxDWq-jhsA-r_GAzsp6ZTgjhM4AD7RDIofdUDZofCEZuQbs7rBZaAYWKC6ePEX6I9CpPKaTJVLWDlKKXJaXG8M_pnO8WMuuGn_sZYwU8DM0FbUqn_DmO3HdcLBqiI2aMw1ymqCvtHrp6uPnuTe12ySL0_wxTOf2kLP4zxHdM54rI9e08CP5ekGM2PF6g2sqQ9b6BQOpXXu3WLSqqYjzRjljhgMiS5blglpM7wJjREqiY4b1Gmsjmc3J1w";
        const response = await axios.get(`https://graph.microsoft.com/v1.0/teams/${teamId}/channels`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setChannels((prev) => ({ ...prev, [teamId]: response.data.value }));
    };

    const fetchChatMessages = async (teamId, channelId) => {
        const token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IllBVXVzUG0wNHVxZlctenJNcFNwMHNPQ2NLMWR6Qmo1OTcwTnJZTllSLW8iLCJhbGciOiJSUzI1NiIsIng1dCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEvIiwiaWF0IjoxNzM4NzMzNDAwLCJuYmYiOjE3Mzg3MzM0MDAsImV4cCI6MTczODgyMDEwMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhaQUFBQXhTWGkyYjUxREE2RWd3bUZhVFdjV1JOTXdxVnBMSWVjWHhLSUJMRUZZcW9pNlQ1NncvYTZjTnFhVzU4ZmRZTFF4Nkt4QTBvd2p2ckJtOEtleXdtUVdEb2RSVmU1U0d5ZEtJWmFJZ1VpR3ZnPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiVGVhbSIsImdpdmVuX25hbWUiOiJEZXZlbG9wbWVudCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjI0MDE6NDkwMDoxYzQ1OmNjZjQ6NThhZTo4NzIzOjczMzM6NzI4NSIsIm5hbWUiOiJEZXZlbG9wbWVudCBUZWFtIiwib2lkIjoiMTM2MGJjNzktYTBlMi00YjcwLTg5YWYtZGMxYjAzNWEzMDM0IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDA0M0Q2RTlFRDgiLCJyaCI6IjEuQVQwQXcyRnNZTDZTMVVtTXh5VWhVUzdiWVFNQUFBQUFBQUFBd0FBQUFBQUFBQUE5QVBZOUFBLiIsInNjcCI6IkNoYW5uZWwuUmVhZEJhc2ljLkFsbCBDaGFubmVsTWVzc2FnZS5TZW5kIENoYXQuQ3JlYXRlIE5vdGlmaWNhdGlvbnMuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBvcGVuaWQgcHJvZmlsZSBUZWFtLkNyZWF0ZSBUZWFtLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkIFVzZXIuUmVhZEJhc2ljLkFsbCBVc2VyQWN0aXZpdHkuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBlbWFpbCIsInNpZCI6IjAwMWYyOGE5LTMxODctNjAzNi02YTU2LTMyMzQyNDExZTc4NyIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IlE0ZUc5TTBYUlJNMzR1UzhPTjNfdjBKODNtaEF0RFhXYkFpanFtRHZ5Z2siLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiI2MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEiLCJ1bmlxdWVfbmFtZSI6ImRldnRlYW1AY29ubmVjdGljdXMuaW4iLCJ1cG4iOiJkZXZ0ZWFtQGNvbm5lY3RpY3VzLmluIiwidXRpIjoiMElQNVBWX2JoRU95bGtoQWtJZFlBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19jYyI6WyJDUDEiXSwieG1zX2Z0ZCI6IkJxQkxSSkVEdFd0Sm9tTWY0dzNKMnJWa1lhUWFSRnUzYTZoUkZGbkNaWHMiLCJ4bXNfaWRyZWwiOiIxIDIyIiwieG1zX3NzbSI6IjEiLCJ4bXNfc3QiOnsic3ViIjoid051UXdST2ZROThuRHBQcHlBVUtMSXVVaHhVUjl5el9mSzF2ejhENHlGcyJ9LCJ4bXNfdGNkdCI6MTU1ODc2MTUyOH0.WaGO3Hc7o9fXkvZ_UTsyx2oinxJC_2rj0ScardjaW7OYn4l6tQZN7ofBXuXnhdFaka62DOzSOzrDlXjPfiOujPnbJelkAhxDWq-jhsA-r_GAzsp6ZTgjhM4AD7RDIofdUDZofCEZuQbs7rBZaAYWKC6ePEX6I9CpPKaTJVLWDlKKXJaXG8M_pnO8WMuuGn_sZYwU8DM0FbUqn_DmO3HdcLBqiI2aMw1ymqCvtHrp6uPnuTe12ySL0_wxTOf2kLP4zxHdM54rI9e08CP5ekGM2PF6g2sqQ9b6BQOpXXu3WLSqqYjzRjljhgMiS5blglpM7wJjREqiY4b1Gmsjmc3J1w";
        const response = await axios.get(`https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data.value);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for Teams */}
            <div className="w-1/4 bg-blue-900 text-white p-4">
                <h2 className="text-lg font-bold mb-4">Teams</h2>
                {teams.map((team) => (
                    <div 
                        key={team.id} 
                        className={`p-2 cursor-pointer rounded-lg hover:bg-blue-700 ${selectedTeam === team.id ? "bg-blue-700" : ""}`} 
                        onClick={() => {
                            setSelectedTeam(team.id);
                            fetchChannels(team.id);
                        }}>
                        {team.displayName}
                    </div>
                ))}
            </div>

            {/* Sidebar for Channels */}
            {selectedTeam && (
                <div className="w-1/4 bg-gray-800 text-white p-4">
                    <h2 className="text-lg font-bold mb-4">Channels</h2>
                    {channels[selectedTeam]?.map((channel) => (
                        <div 
                            key={channel.id} 
                            className={`p-2 cursor-pointer rounded-lg hover:bg-gray-600 ${selectedChannel === channel.id ? "bg-gray-600" : ""}`} 
                            onClick={() => {
                                setSelectedChannel(channel.id);
                                fetchChatMessages(selectedTeam, channel.id);
                            }}>
                            {channel.displayName}
                        </div>
                    ))}
                </div>
            )}

            {/* Chat Window */}
            {selectedChannel && (
                <div className="w-1/2 bg-white p-4 flex flex-col">
                    <h2 className="text-lg font-bold mb-4">Chat</h2>
                    <div className="flex-grow overflow-y-auto border rounded p-2 bg-gray-100">
                        {messages.map((msg, index) => (
                            <div key={index} className="p-2 bg-white rounded-lg shadow mb-2">
                                <strong>{msg.from?.user?.displayName || "Unknown"}:</strong> {msg.body?.content}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamsAndChannels;
