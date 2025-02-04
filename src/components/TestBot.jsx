import React, { useState } from "react";
import { Textarea, Button, Card } from "@fluentui/react-components";
import { TeamsFxContext } from "./Context";

export default function TestBot() {
  const { teamsUserCredential } = React.useContext(TeamsFxContext);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };
    setChatHistory([...chatHistory, userMessage]);

    try {
      // Send message to bot backend (replace with your bot API)
      const response = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();

      // Bot's response
      const botMessage = { role: "bot", text: data.reply };
      setChatHistory([...chatHistory, userMessage, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage(""); // Clear input
  };

  return (
    <Card style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Chat with Jira Bot</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "10px" }}>
        {chatHistory.map((msg, index) => (
          <p key={index} style={{ color: msg.role === "user" ? "blue" : "green" }}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <Textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <Button onClick={sendMessage} appearance="primary">Send</Button>
    </Card>
  );
}
