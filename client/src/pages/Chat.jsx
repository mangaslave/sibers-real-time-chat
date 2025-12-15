import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import {
    channelMember,
  fetchChannelById,
  fetchChannelMessages,
  joinChannel as joinChannelApi,
} from "../api/channelsApi";
import { useAuth } from "../context/useAuth";
import ChannelMembersModal from "../components/ChannelMembersModal";
import Face from "../assets/loginFront.png";


export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user, token } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isMember, setIsMember] = useState(true);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);


  const [channel, setChannel] = useState(null);


  const bottomRef = useRef(null);

  const uniqueByEmail = (list = []) => {
    const map = new Map();
    list.forEach(item => map.set(item.email, item));
    return Array.from(map.values());
  };

  // Load channel info and messages
  useEffect(() => {;
    async function loadData() {
        try {
        const channelRes = await fetchChannelById(token, id);
        const channel = channelRes.data;

        const admin = channel.members[0];

        const membersRes = await channelMember(token, id);
        const membersData = membersRes.data.map(m => ({
            name: m.name,
            email: m.email,
            avatar: m.avatar || null,
        }));

        console.log("Members data:", membersData);
        console.log("Admin data:", admin);
        console.log("Channel data:", channel);

        // bugfix: channel data doesn't have membersData field with avatar info

        setChannel({ ...channel, membersData, admin});
        setIsMember(channel.members.includes(user.email));

        console.log("Loading data for channel:", channel);
        const messagesRes = await fetchChannelMessages(token, id);
        
        setMessages(messagesRes.data);
        } catch (err) {
        console.error("Failed to load channel", err);
        }
    }

    if (token) loadData();
    }, [id, user, token]);


  // Real-time updates for messages and members
  useEffect(() => {
    if (!socket || !user || !channel) return;

    if (!channel.members.includes(user.email)) {
        setIsMember(false);
        return;
    }

    // Join room
    socket.emit("join_channel", { channelId: id, user });

    // New message
    const messageHandler = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("new_message", messageHandler);

    // Member joined
    const memberJoinedHandler = (newMember) => {
        setChannel((prev) => ({
            ...prev,
            members: Array.from(new Set([...prev.members, newMember.email])),
            membersData: uniqueByEmail([
                ...(prev.membersData || []),
                {
                    name: newMember.profile.name,
                    email: newMember.profile.email,
                    avatar: newMember.profile.avatar || null,
                },
            ]),
        }));
    };

    socket.on("member_joined", memberJoinedHandler);

    // Member removed
    const memberRemovedHandler = ({ email }) => {
      setChannel(prev => ({
        ...prev,
        members: [...prev.members.filter(m => m !== email)],
        membersData: [...prev.membersData.filter(m => m.email !== email)],
      }));
    };

    socket.on("member_removed", memberRemovedHandler);

    // Removed member
    const youWereRemovedHandler = ({ channelId }) => {
        if (channelId !== id) return;

        setIsMember(false);
        setMessages([]);
        setText("");

        setChannel(prev => ({
            ...prev,
            members: prev.members.filter(m => m !== user.email),
            membersData: prev.membersData.filter(m => m.email !== user.email),
        }));

        navigate("/channels");
    };

    socket.on("you_were_removed", youWereRemovedHandler);

    return () => {
      socket.off("new_message", messageHandler);
      socket.off("member_joined", memberJoinedHandler);
      socket.off("member_removed", memberRemovedHandler);
      socket.off("you_were_removed", youWereRemovedHandler);
    };
  }, [socket, id, user, channel, setIsMember, navigate]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !text.trim()) return;

    socket.emit("send_message", {
        channelId: id,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        },
        text,
    });

    setText("");
  };

  // Handle joining the channel
  const handleJoin = async () => {
    await joinChannelApi(token, id, user.email);
    const updated = await fetchChannelById(token, id);
    const membersRes = await channelMember(token, id);
    const membersData = membersRes.data.map(m => ({
        name: m.name,
        email: m.email,
        avatar: m.avatar || null,
    }));
    
    setChannel({ ...updated.data, membersData, admin: updated.data.members[0] });

    setIsMember(true);
  };


  return (
    <div className="w-screen h-screen flex justify-center bg-[#f7f3ee]"> 
      <div className="w-full max-w-97.5 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 border-b-2 border-amber-50 sticky top-0 z-10 cursor-pointer" 
        >
          <div>
            <button onClick={() => navigate(-1)} className="text-2xl text-[#727272]">←</button>
          </div>
          <span className="text-xl font-semibold text-[#727272]">{channel?.name}</span>

          <button onClick={() => setIsMembersModalOpen(true)} className="text-2xl text-[#727272]">⋮</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 text-[#727272]">
          {messages.map((m, i) => {
            const isMe = m.userId === user.id;

            return (
                <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start gap-2 max-w-[70%]">
                    {/* Avatar for others */}
                    {!isMe && (
                    <img
                        src={m.userAvatar || Face}
                        alt={m.userName || m.userEmail}
                        className="w-8 h-8 rounded-full object-cover mt-1"
                    />
                    )}

                    <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow
                        ${isMe
                        ? "bg-[#ddb665] text-white rounded-br-sm"
                        : "bg-stone-200 text-[#727272] rounded-bl-sm"}
                    `}
                    >
                    {/* Show name except logged user */}
                    {!isMe && (
                        <div className="text-xs font-semibold text-[#555] mb-1">
                        {m.userName || m.userEmail}
                        </div>
                    )}
                    <div>{m.text}</div>
                    </div>
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
            className="m-4 py-3 rounded-full bg-[#ddb665] hover:bg-[#c29c5a] transition text-white font-semibold"> 
            Join channel
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-3 border-t-2 border-amber-50 text-[#727272]">
            <input
                value={text}
                disabled={!socket}
                onChange={(e) => setText(e.target.value)}
                placeholder={socket ? "Message..." : "Connecting..."}
                className="flex-1 px-4 py-2 rounded-full border-none outline-none text-[#727272] bg-white shadow-inner disabled:opacity-50" 
            />
            <button
                disabled={!socket || !text.trim()}
                onClick={sendMessage}
                className="w-10 h-10 rounded-full bg-[#ddb665] text-white flex items-center justify-center hover:bg-[#c29c5a] transition disabled:opacity-50"
            >
              <span className="translate-x-0.5">➤</span> 
            </button>
          </div>
        )}
      </div>
      <ChannelMembersModal
        key={channel?.membersData?.length}
        isVisible={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        channel={channel}
        // onMemberRemoved={(removedEmail) => {
        //     setChannel((prev) => ({
        //     ...prev,
        //     members: prev.members.filter((m) => m !== removedEmail),
        //     membersData: prev.membersData.filter((m) => m.email !== removedEmail),
        //     }));
        // }}
        />
    </div>
  );
}