import { getChannelById } from "../services/channelsService.js";

export const channelAdminOnly = (req, res, next) => {
  const { channelId } = req.params;
  const channel = getChannelById(channelId);

  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }

  if (channel.creatorEmail !== req.user.email) {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};
