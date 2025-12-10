import {
  createChannel,
  getAllChannels,
  addMemberToChannel,
  removeMemberFromChannel
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

export const addMemberController = (req, res) => {
  const { channelId } = req.params;
  const { email } = req.body;

  const ch = addMemberToChannel(channelId, email);

  if (!ch) return res.status(404).json({ message: "Channel not found" });
  res.json(ch);
};

export const removeMemberController = (req, res) => {
  const { channelId, email } = req.params;

  const ch = removeMemberFromChannel(channelId, email);

  if (!ch) return res.status(404).json({ message: "Channel not found" });
  res.json(ch);
};
