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
        const token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6Ii1FcU4xQlhGcFRFYkdubWxjeUdJS2NkMU5VblZUN19WVzFzdnc0cmtXakkiLCJhbGciOiJSUzI1NiIsIng1dCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEvIiwiaWF0IjoxNzM4NzQ3NzAxLCJuYmYiOjE3Mzg3NDc3MDEsImV4cCI6MTczODgzNDQwMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhaQUFBQWxrUmVCZUxPUGxCV0ZCR3VNQmREQ0JYL0dWaFpMa212bE0zVkU4Yi9oK2FxSFpuQmJSSlJtMWIzQjlvemRuUlpZR08rS1gyai9FQ0U0SW8xRDl6M0l1K3JBRWY4VnJhbDV2c0RFejR2ajBJPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiRGVzaG11a2giLCJnaXZlbl9uYW1lIjoiUnVwYWxpIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjQwMTo0OTAwOjFjNDU6Y2NmNDo0OTZhOmNlYmQ6ZTEwMTo5ODliIiwibmFtZSI6IlJ1cGFsaSBEZXNobXVraCIsIm9pZCI6ImQ0MTkxZGZlLTMwOGQtNGQxYy1hMDQ5LTFiZTg4MmNjYjBkMSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMDRBNzU2QTM3IiwicmgiOiIxLkFUMEF3MkZzWUw2UzFVbU14eVVoVVM3YllRTUFBQUFBQUFBQXdBQUFBQUFBQUFBOUFEdzlBQS4iLCJzY3AiOiJDaGFubmVsLkNyZWF0ZSBDaGFubmVsLlJlYWRCYXNpYy5BbGwgQ2hhbm5lbE1lc3NhZ2UuU2VuZCBDaGF0LkNyZWF0ZSBDaGF0LlJlYWRXcml0ZSBvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQgZW1haWwgQ2hhbm5lbE1lc3NhZ2UuUmVhZC5BbGwiLCJzaWQiOiIwMDFmNGZiOS0yNDg2LWVjZmUtMDIwNi03MzE0MzdmZTQ2YzQiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJTcVJSX3QyamF4M1JyaFB4YUk2SHp2RHBOeU05SDNHS0N5amlKTVU2MUhRIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiNjA2YzYxYzMtOTJiZS00OWQ1LThjYzctMjUyMTUxMmVkYjYxIiwidW5pcXVlX25hbWUiOiJydXBhbGkuZGVzaG11a2hAY29ubmVjdGljdXMuaW4iLCJ1cG4iOiJydXBhbGkuZGVzaG11a2hAY29ubmVjdGljdXMuaW4iLCJ1dGkiOiJ5UjA1ZDJoR1JrMm52N3IzS3p4bEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCI2OTA5MTI0Ni0yMGU4LTRhNTYtYWE0ZC0wNjYwNzViMmE3YTgiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfZnRkIjoiaGRxZzBQU29mRE41ZkR0a19OeExvVjdLM1FHN2hDWWFGZmxweW1KWkNrUSIsInhtc19pZHJlbCI6IjEgMzAiLCJ4bXNfc3NtIjoiMSIsInhtc19zdCI6eyJzdWIiOiI0eUdhdjR5cFNBZHU5b2R3YmJzOWM5ZjJ4Vi0xeVI3RzJVZTl4b3M3ZjVNIn0sInhtc190Y2R0IjoxNTU4NzYxNTI4fQ.ODXR5GUX0vZRZxWNf9YhU9YqSS0KB8ZSxNN2Om9mekJyixOhCDXbuXNNqOGyxCOypiXjXmnTeDDWWKCsQbbJhWi25cRiZ2NLBlmLuQl8eL24DXVwUBpjAfk_q1MMZHx0-Lt49aba0HwugMldnG1cetDzUT4L5dKor8IMJxjrxeHACLsywJG2IwjGJ6rCUKSisWdZL8H07zXzHvu15miFR5IahxrZcRbIZgGoTLoJAwomd_WV5jltzDIuLqHDIawYaSW5PKdzaP7CyzxAKDngEtqqm5HQqkTlxOyXfDaDR213uFJy4CP0X8XubDbDbSL56t5vYjpqS-yJUEbFgafZRA"
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
