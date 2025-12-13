 import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

export default function Chat() {
  const { id } = useParams();
  const socket = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_channel", { channelId: id, user });

    socket.on("new_message", (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => socket.off("new_message");
  }, [socket]);

  const sendMessage = () => {
    const message = {
      text,
      user: user.name,
      timestamp: Date.now(),
    };

    socket.emit("send_message", { channelId: id, message });
    setText("");
  };

  return (
    <div>
      <h3>Chat</h3>

      {messages.map((m, i) => (
        <div key={i}>
          <b>{m.user}</b>: {m.text}
        </div>
      ))}

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
