import React, { useEffect, useState } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import axios from "axios";
import { Button, Input, Card, Layout, Typography, List, message as antdMessage, Spin, Alert } from "antd";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const ChannelList = () => {
    const [channels, setChannels] = useState([]);
    const [teamId, setTeamId] = useState("cba0dd4e-956d-476a-b8f9-9658f8bee60c");
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            setTeamId(context.teamId);
        });
    }, []);

    useEffect(() => {
        if (teamId) {
            fetchChannels(teamId);
        }
    }, [teamId]);

    const fetchChannels = async (teamId) => {
        setLoading(true);
        setError(null);
        try {
            const token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IllBVXVzUG0wNHVxZlctenJNcFNwMHNPQ2NLMWR6Qmo1OTcwTnJZTllSLW8iLCJhbGciOiJSUzI1NiIsIng1dCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEvIiwiaWF0IjoxNzM4NzMzNDAwLCJuYmYiOjE3Mzg3MzM0MDAsImV4cCI6MTczODgyMDEwMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhaQUFBQXhTWGkyYjUxREE2RWd3bUZhVFdjV1JOTXdxVnBMSWVjWHhLSUJMRUZZcW9pNlQ1NncvYTZjTnFhVzU4ZmRZTFF4Nkt4QTBvd2p2ckJtOEtleXdtUVdEb2RSVmU1U0d5ZEtJWmFJZ1VpR3ZnPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiVGVhbSIsImdpdmVuX25hbWUiOiJEZXZlbG9wbWVudCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjI0MDE6NDkwMDoxYzQ1OmNjZjQ6NThhZTo4NzIzOjczMzM6NzI4NSIsIm5hbWUiOiJEZXZlbG9wbWVudCBUZWFtIiwib2lkIjoiMTM2MGJjNzktYTBlMi00YjcwLTg5YWYtZGMxYjAzNWEzMDM0IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDA0M0Q2RTlFRDgiLCJyaCI6IjEuQVQwQXcyRnNZTDZTMVVtTXh5VWhVUzdiWVFNQUFBQUFBQUFBd0FBQUFBQUFBQUE5QVBZOUFBLiIsInNjcCI6IkNoYW5uZWwuUmVhZEJhc2ljLkFsbCBDaGFubmVsTWVzc2FnZS5TZW5kIENoYXQuQ3JlYXRlIE5vdGlmaWNhdGlvbnMuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBvcGVuaWQgcHJvZmlsZSBUZWFtLkNyZWF0ZSBUZWFtLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkIFVzZXIuUmVhZEJhc2ljLkFsbCBVc2VyQWN0aXZpdHkuUmVhZFdyaXRlLkNyZWF0ZWRCeUFwcCBlbWFpbCIsInNpZCI6IjAwMWYyOGE5LTMxODctNjAzNi02YTU2LTMyMzQyNDExZTc4NyIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IlE0ZUc5TTBYUlJNMzR1UzhPTjNfdjBKODNtaEF0RFhXYkFpanFtRHZ5Z2siLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiI2MDZjNjFjMy05MmJlLTQ5ZDUtOGNjNy0yNTIxNTEyZWRiNjEiLCJ1bmlxdWVfbmFtZSI6ImRldnRlYW1AY29ubmVjdGljdXMuaW4iLCJ1cG4iOiJkZXZ0ZWFtQGNvbm5lY3RpY3VzLmluIiwidXRpIjoiMElQNVBWX2JoRU95bGtoQWtJZFlBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19jYyI6WyJDUDEiXSwieG1zX2Z0ZCI6IkJxQkxSSkVEdFd0Sm9tTWY0dzNKMnJWa1lhUWFSRnUzYTZoUkZGbkNaWHMiLCJ4bXNfaWRyZWwiOiIxIDIyIiwieG1zX3NzbSI6IjEiLCJ4bXNfc3QiOnsic3ViIjoid051UXdST2ZROThuRHBQcHlBVUtMSXVVaHhVUjl5el9mSzF2ejhENHlGcyJ9LCJ4bXNfdGNkdCI6MTU1ODc2MTUyOH0.WaGO3Hc7o9fXkvZ_UTsyx2oinxJC_2rj0ScardjaW7OYn4l6tQZN7ofBXuXnhdFaka62DOzSOzrDlXjPfiOujPnbJelkAhxDWq-jhsA-r_GAzsp6ZTgjhM4AD7RDIofdUDZofCEZuQbs7rBZaAYWKC6ePEX6I9CpPKaTJVLWDlKKXJaXG8M_pnO8WMuuGn_sZYwU8DM0FbUqn_DmO3HdcLBqiI2aMw1ymqCvtHrp6uPnuTe12ySL0_wxTOf2kLP4zxHdM54rI9e08CP5ekGM2PF6g2sqQ9b6BQOpXXu3WLSqqYjzRjljhgMiS5blglpM7wJjREqiY4b1Gmsjmc3J1w";
            const response = await axios.get(
                `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(response.data.value);   
            setChannels(response.data.value);
        } catch (error) {
            setError("Failed to fetch channels. Please try again.");
            console.error("Error fetching channels:", error);
        }
        setLoading(false);
    };

    const fetchMessages = async (channelId) => {
        setLoading(true);
        setError(null);
        try {
            const token = await microsoftTeams.authentication.getAuthToken();
            const response = await axios.get(
                `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(response.data.value);
            setSelectedChannel(channelId);
        } catch (error) {
            setError("Failed to fetch messages. Please try again.");
            console.error("Error fetching messages:", error);
        }
        setLoading(false);
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const token = await microsoftTeams.authentication.getAuthToken();
            await axios.post(
                `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${selectedChannel}/messages`,
                { body: { content: newMessage } },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setNewMessage("");
            fetchMessages(selectedChannel);
            antdMessage.success("Message sent successfully!");
        } catch (error) {
            setError("Failed to send message. Please try again.");
            console.error("Error sending message:", error);
        }
        setLoading(false);
    };

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider width={250} style={{ background: "#001529", padding: "20px" }}>
                <Title level={3} style={{ color: "white", marginBottom: "20px" }}>Channels</Title>
                {loading ? <Spin /> : null}
                <List
                    bordered
                    dataSource={channels}
                    renderItem={(channel) => (
                        <List.Item
                            style={{
                                cursor: "pointer",
                                background: selectedChannel === channel.id ? "#1890ff" : "#f0f0f0",
                                color: selectedChannel === channel.id ? "white" : "black",
                                padding: "10px",
                                borderRadius: "5px",
                                marginBottom: "5px",
                            }}
                            onClick={() => fetchMessages(channel.id)}
                        >
                            {channel.displayName}
                        </List.Item>
                    )}
                />
            </Sider>
            <Layout>
                <Header style={{ background: "#fff", padding: "10px", textAlign: "center" }}>
                    <Title level={3}>{selectedChannel ? "Messages" : "Select a Channel"}</Title>
                </Header>
                <Content style={{ padding: "20px", overflowY: "auto" }}>
                    {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: "10px" }} />}
                    <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "5px" }}>
                        {loading ? <Spin /> : null}
                        {messages.map((msg) => (
                            <Card key={msg.id} style={{ marginBottom: "10px" }}>
                                <b>{msg.from?.user?.displayName || "Unknown User"}:</b>
                                <p>{msg.body.content}</p>
                            </Card>
                        ))}
                    </div>
                </Content>
                {selectedChannel && (
                    <div style={{ padding: "10px", background: "#fff", borderTop: "1px solid #ddd", display: "flex" }}>
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            style={{ flex: 1, marginRight: "10px" }}
                        />
                        <Button type="primary" onClick={sendMessage} loading={loading}>
                            Send
                        </Button>
                    </div>
                )}
            </Layout>
        </Layout>
    );
};

export default ChannelList;