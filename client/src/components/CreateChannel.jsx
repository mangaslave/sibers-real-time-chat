import { useState } from "react";
import { X } from "lucide-react";
import { createChannel } from "../api/channelsApi";
import { useAuth } from "../context/useAuth";
import { createPortal } from "react-dom";

export default function CreateChannelModal({ isVisible, onClose, onChannelCreated }) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isVisible) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createChannel(token, name);
      onChannelCreated();
      setName("");
      onClose();
    } catch (error) {
      console.error("Failed to create channel:", error);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-[#727272]">Create Channel</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Input */}
        <div className="px-6 py-6">
          <input
            placeholder="Channel name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#ddb665] text-[#727272]"
            disabled={loading}
            aria-label="New channel name input"
          />
        </div>

        {/* Modal Footer / Action Button */}
        <div className="px-6 pb-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className={`px-6 py-2 rounded-lg font-medium transition 
              ${!name.trim() || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#ddb665] text-white hover:bg-[#c29c5a]"
              }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
