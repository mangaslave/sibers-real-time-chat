import { useEffect, useState } from "react";
import { fetchChannels, createChannel } from "../api/channelsApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function Channels() {
  const { token } = useAuth();
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchChannels(token).then((res) => setChannels(res.data));
  }, [token]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createChannel(token, name);
    const res = await fetchChannels(token);
    setChannels(res.data);
    setName("");
  };

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-[#f7f3ee] px-4">
      <div className="w-full max-w-[390px] flex flex-col items-center">

        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-2xl font-bold mb-4 text-[#727272] ">channels.</h2>
          <button
            onClick={handleCreate}
            className="w-1/3 h-1/3 rounded-full text-white flex items-center justify-end"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* New channel input */}
        <div className="px-4 py-2 border-b">
          <input
            placeholder="New channel name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-400 text-[#727272]"
          />
        </div>

        {/* Channels list */}
        <div className="flex-1 overflow-y-auto">
          {channels.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/channels/${c.id}`)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 active:bg-gray-200"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {c.name.charAt(0).toUpperCase()}
              </div>

              <span className="text-base font-medium text-[#727272]">{c.name}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
