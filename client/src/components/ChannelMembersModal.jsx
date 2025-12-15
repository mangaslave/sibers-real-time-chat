import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useSocket } from "../context/SocketContext";

export default function ChannelMembersModal({ isVisible, onClose, channel }) {
  const { user } = useAuth();
  const socket = useSocket();

  if (!isVisible || !channel || !Array.isArray(channel.membersData)) {
    return null;
  }

  const members = Array.isArray(channel.membersData)
    ? channel.membersData
    : [];

  const handleRemove = (memberEmail) => {
    if (!window.confirm(`Remove ${memberEmail} from this channel?`)) return;

    if (!socket) return;

    socket.emit("kick_user", {
      channelId: channel.id,
      targetEmail: memberEmail,
    });
  };

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

        {/* Members List */}
        <div className="px-6 py-4 space-y-4">
          {members.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No members found.
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.email}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar || "/default-avatar.png"}
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
