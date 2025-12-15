import { useEffect, useState } from "react";
import { fetchChannels} from "../api/channelsApi";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import CreateChannelModal from "../components/CreateChannel";
import { useAuth } from "../context/useAuth";

export default function Channels() {
  const { token, logout } = useAuth();
  const [channels, setChannels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const navigate = useNavigate();

  // Function to fetch and update channels list
  // bugfix: add socket dependency to refresh list on new channel creation
  const getChannels = async () => {
    setLoadingChannels(true);
    try {
        const res = await fetchChannels(token);
        setChannels(res.data);
    } catch (error) {
        console.error("Error fetching channels:", error);
    } finally {
        setLoadingChannels(false);
    }
  };

  useEffect(() => {
    getChannels();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-[#f7f3ee]">
      <div className="w-full max-w-97.5 min-h-screen flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between py-2 border-b-2 border-amber-50 sticky top-0 z-10 mb-2">
          <h2 className="text-xl font-bold text-[#727272]">channels.</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 rounded-full bg-[#ddb665] text-white flex items-center justify-center hover:bg-[#727272] transition p-0 m-0 border-none leading-none"           
            aria-label="Create new channel"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto">
            {loadingChannels ? (
                <div className="p-5 text-center text-[#727272]">Loading channels...</div>
            ) : channels.length === 0 ? (
                <div className="p-5 text-center text-[#727272]">No channels found. Create one to get started!</div>
            ) : (
                channels.map((c) => (
                    <div
                        key={c.id}
                        onClick={() => navigate(`/channels/${c.id}`)}
                        className="flex items-center gap-4 px-0.5 py-1 cursor-pointer hover:bg-stone-200 active:bg-gray-100 transition"
                    >
                        <div className="w-12 h-12 min-w-12 rounded-full bg-[#ddb665] flex items-center justify-center text-white text-lg font-semibold">
                            {c.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-base font-semibold text-[#727272] truncate">
                                {c.name}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
        {/* Logout */}
        <div className="sticky bottom-0 z-20 w-full p-4 bg-[#f7f3ee] border-t-2 border-amber-50">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-full bg-[#727272] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#ddb665] transition shadow-lg"
            aria-label="Log out of the application"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>

      </div>

      <CreateChannelModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChannelCreated={getChannels}
      />
    </div>
  );
}