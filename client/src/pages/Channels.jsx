import { useEffect, useState } from "react";
import { fetchChannels, createChannel } from "../api/channelsApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Channels() {
  const { token } = useAuth();
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchChannels(token).then((res) => setChannels(res.data));
  }, []);

  const handleCreate = async () => {
    await createChannel(token, name);
    const res = await fetchChannels(token);
    setChannels(res.data);
  };

  return (
    <div>
      <h2>Channels</h2>

      <input
        placeholder="New channel name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleCreate}>Create</button>

      <ul>
        {channels.map((c) => (
          <li key={c.id} onClick={() => navigate(`/channels/${c.id}`)}>
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
