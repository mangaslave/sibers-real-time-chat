import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useSocket } from "../context/SocketContext";
import { useState, useMemo } from "react";
import Face from "../assets/loginFront.png";

export default function ChannelMembersModal({ isVisible, onClose, channel }) {
  const { user } = useAuth();
  const socket = useSocket();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = useMemo(() => {
    if (!channel || !Array.isArray(channel.membersData)) return [];
    const term = searchTerm.toLowerCase();
    return channel.membersData.filter(
      (m) =>
        (m.name && m.name.toLowerCase().includes(term)) ||
        (m.email && m.email.toLowerCase().includes(term))
    );
  }, [channel, searchTerm]);

  const handleRemove = (memberEmail) => {
    if (!window.confirm(`Remove ${memberEmail} from this channel?`)) return;
    if (!socket) return;

    socket.emit("kick_user", {
      channelId: channel.id,
      targetEmail: memberEmail,
    });
  };

  if (!isVisible || !channel || !Array.isArray(channel.membersData)) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-97.5 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-[#727272]">
            Channel Members
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-gray-200">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members..."
            className="w-full px-4 py-2 border rounded-lg outline-none text-[#727272]"
          />
        </div>

        {/* Members List */}
        <div className="px-6 py-4 space-y-4">
          {filteredMembers.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No members found.
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.email}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar || Face}
                    alt={member.name || member.email}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-[#727272] font-medium">
                    {member.name || member.email}
                  </span>
                </div>

                {/* Remove button (admin only) */}
                {channel.admin === user.email &&
                  member.email !== user.email && (
                    <button
                      onClick={() => handleRemove(member.email)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      Remove
                    </button>
                  )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
