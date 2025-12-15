import { removeMemberFromChannel } from "../services/channelsService.js";
import { addMessage } from "../services/chatService.js ";

const onlineUsers = new Map();

export default function socketEvents(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join channel
    socket.on("join_channel", ({ channelId, user }) => {

      onlineUsers.set(user.email, socket.id);

      socket.join(channelId);

      io.to(channelId).emit("member_joined", {
        email: user.email,
        profile: {
          name: user.name,
          email: user.email,
          avatar: user.avatar || null,
        },
      });
    });

    // Send message 
    socket.on("send_message", ({ channelId, user, text }) => {
      if (!user || !text?.trim()) return;

      const message = addMessage(channelId, user, text);
      io.to(channelId).emit("new_message", message);
    });

    // Kick user
    socket.on("kick_user", ({ channelId, targetEmail }) => {
      const removed = removeMemberFromChannel(channelId, targetEmail);
      if (!removed) return;

      // Update everyone immediately
      io.to(channelId).emit("member_removed", { email: targetEmail });

      const targetSocketId = onlineUsers.get(targetEmail);
      if (!targetSocketId) return;

      const targetSocket = io.sockets.sockets.get(targetSocketId);

      if (targetSocket) {
        // Notify kicked user
        targetSocket.emit("you_were_removed", { channelId });

        // Force leave room
        targetSocket.leave(channelId);
      }
    });

    // Disconnect socket
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      
      let disconnectedEmail = null;
      for (const [email, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedEmail = email;
          break;
        }
      }

      if (disconnectedEmail) {
        onlineUsers.delete(disconnectedEmail);
        console.log(`User ${disconnectedEmail} disconnected and removed from onlineUsers.`);
      }
    });
  });
}
