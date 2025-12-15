import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Channels from "./pages/Channels";
import Chat from "./pages/Chat";
import { useAuth } from "./context/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-[#f7f3ee] w-full min-h-screen">
          <Routes>

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />

            <Route
              path="/channels"
              element={
                <PrivateRoute>
                  <Channels />
                </PrivateRoute>
              }
            />

            <Route
              path="/channels/:id"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
