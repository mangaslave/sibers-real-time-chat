export default function socketEvents(io) {
  const channelMembers = {};
  const channelMessages = {};

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_channel", ({ channelId, user }) => {
      socket.join(channelId);

      if (!channelMembers[channelId]) channelMembers[channelId] = [];
      if (!channelMessages[channelId]) channelMessages[channelId] = [];

      channelMembers[channelId].push(user);

      io.to(channelId).emit("members_updated", channelMembers[channelId]);
    });

    socket.on("send_message", ({ channelId, message }) => {
      channelMessages[channelId].push(message);
      io.to(channelId).emit("new_message", message);
    });

    socket.on("kick_user", ({ channelId, targetId }) => {
      channelMembers[channelId] = channelMembers[channelId].filter(
        (u) => u.id !== targetId
      );
      io.to(channelId).emit("members_updated", channelMembers[channelId]);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
