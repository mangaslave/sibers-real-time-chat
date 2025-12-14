import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isMember, setIsMember] = useState(true);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_channel", { channelId: id, user });

    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("new_message");
  }, [socket, id, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const message = {
      text,
      user: user.name,
      userId: user.id,
      timestamp: Date.now(),
    };

    socket.emit("send_message", { channelId: id, message });
    setText("");
  };

  return (
    <div className="w-screen h-screen flex justify-center bg-[#f7f3ee]">
      <div className="w-full max-w-[390px] bg-white flex flex-col">

        {/* Header */}
        <div
          onClick={() => navigate(`/channels/${id}/info`)}
          className="flex items-center justify-between px-4 py-3 border-b cursor-pointer"
        >
          <span className="font-semibold text-[#727272]"># channel-name</span>
          <span className="text-xl">⋮</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 text-[#727272]">
          {messages.map((m, i) => {
            const isMe = m.userId === user.id;

            return (
              <div
                key={i}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow
                    ${isMe
                      ? "bg-green-500 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"}
                  `}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        {!isMember ? (
          <button className="m-4 py-3 rounded-full bg-blue-500 text-white font-semibold">
            Join channel
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-3 border-t text-[#727272]">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message..."
              className="flex-1 px-4 py-2 rounded-full border outline-none focus:ring-2 focus:ring-green-400 text-[#727272]"
            />
            <button
              onClick={sendMessage}
              className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center"
            >
              ➤
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
