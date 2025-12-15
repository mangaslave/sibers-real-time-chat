import {
  createChannel,
  getAllChannels,
  removeMemberFromChannel,
  joinChannel,
  getChannelMessages,
  getChannelById,
  getMembers
} from "../services/channelsService.js";

export const createChannelController = (req, res) => {
  const { name } = req.body;
  const email = req.user.email;

  const ch = createChannel(name, email);
  res.json(ch);
};

export const getChannelsController = (req, res) => {
  res.json(getAllChannels());
};

export const joinChannelController = (req, res) => {
  const { channelId } = req.params;
  const { email } = req.body;

  const ch = joinChannel(channelId, email);

  if (!ch) return res.status(404).json({ message: "Channel not found" });
  res.json(ch);
};

export const removeMemberController = (req, res) => {
  const { channelId, email } = req.params;

  const ch = removeMemberFromChannel(channelId, email);

  if (!ch) return res.status(404).json({ message: "Channel not found" });
  res.json(ch);
};

export const getChannelMessagesController = (req, res) => {
  const { channelId } = req.params;

  const ch = getChannelMessages(channelId);

  if (!ch) return res.status(404).json({ message: "Channel not found" });
  res.json(ch);
};

export const getChannelbyIdController = (req, res) => {
  const { channelId } = req.params;

  const ch = getChannelById(channelId);

  if (!ch) return res.status(404).json({ message: "Channel not found" });
  res.json(ch);
};

export const channelMemberController = (req, res) => {
  const { channelId } = req.params;
  const members = getMembers(channelId);

  if (!members) return res.status(404).json({ message: "Channel not found" });

  res.json(members); 
};
