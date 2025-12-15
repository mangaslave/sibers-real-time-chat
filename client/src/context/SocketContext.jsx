import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// SocketProvider component to wrap around the app and provide socket instance
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io("http://localhost:5001", {
      transports: ["websocket"],
    });

    console.log("socket created");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(s);

    return () => {
      console.log("socket disconnected");
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);
