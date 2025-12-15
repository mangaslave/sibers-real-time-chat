import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import {
  fetchChannelById,
  fetchChannelMessages,
  joinChannel as joinChannelApi,
} from "../api/channelsApi";


export default function Chat() {
  console.log("=== CHAT COMPONENT RENDERING ===");

  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user, token } = useAuth();

  console.log("Chat - id:", id);
  console.log("Chat - user:", user);
  console.log("Chat - socket:", socket);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isMember, setIsMember] = useState(true);

  const [channel, setChannel] = useState(null);


  const bottomRef = useRef(null);

  useEffect(() => {
    console.log("=== CHAT LOAD EFFECT ===");
    console.log("User object:", user);
    console.log("Token:", token);
    console.log("Channel ID:", id);
    async function loadData() {
        try {
        const channelRes = await fetchChannelById(token, id);
        console.log("Channel loaded:", channelRes.data);
        const channel = channelRes.data;
        
        console.log("Channel loaded:", channel);
        console.log("Channel members:", channel.members);
        console.log("User email:", user.email);
        console.log("Is member?", channel.members.includes(user.email));

        setChannel(channel);
        setIsMember(channel.members.includes(user.email));

        const messagesRes = await fetchChannelMessages(token, id);
        setMessages(messagesRes.data);
        } catch (err) {
        console.error("Failed to load channel", err);
        }
    }

    if (token) loadData();
    }, [id, user]);



  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("join_channel", { channelId: id, user });

    const handler = (msg) => {
        setMessages((prev) => [...prev, msg]);
    };

    socket.on("new_message", handler);

    return () => socket.off("new_message", handler);
  }, [socket, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !text.trim()) return;

    socket.emit("send_message", {
        channelId: id,
        user,
        text,
    });

    setText("");
  };

  const handleJoin = async () => {
    await joinChannelApi(token, id, user.email);
    const updated = await fetchChannelById(token, id);
    setChannel(updated.data);
    setIsMember(true);
  };


  return (
    <div className="w-screen h-screen flex justify-center bg-[#f7f3ee]">
      <div className="w-full max-w-[390px] bg-white flex flex-col">

        {/* Header */}
        <div
          onClick={() => navigate(`/channels/${id}/info`)}
          className="flex items-center justify-between px-4 py-3 border-b cursor-pointer"
        >
          <span className="font-semibold text-[#727272]"># {channel?.name}</span>
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
          <button 
            onClick={handleJoin}
            className="m-4 py-3 rounded-full bg-blue-500 text-white font-semibold">
            Join channel
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-3 border-t text-[#727272]">
            <input
                value={text}
                disabled={!socket}
                onChange={(e) => setText(e.target.value)}
                placeholder={socket ? "Message..." : "Connecting..."}
                className="flex-1 px-4 py-2 rounded-full border outline-none disabled:opacity-50"
            />
            <button
                disabled={!socket}
                onClick={sendMessage}
                className="w-10 h-10 rounded-full bg-green-500 text-white disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
