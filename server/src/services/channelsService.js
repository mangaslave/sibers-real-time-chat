import { v4 as uuid } from "uuid";

let channels = [];

// Create a new channel with admin email
export const createChannel = (name, creatorEmail) => {
  const newChannel = {
    id: uuid(),
    name,
    creatorEmail,
    members: [creatorEmail]
  };

  channels.push(newChannel);
  return newChannel;
};

export const getAllChannels = () => channels;

export const getChannelById = (id) =>
  channels.find((ch) => ch.id === id);

export const addMemberToChannel = (channelId, email) => {
  const ch = getChannelById(channelId);
  if (!ch) return null;

  if (!ch.members.includes(email)) {
    ch.members.push(email);
  }

  return ch;
};

export const removeMemberFromChannel = (channelId, email) => {
  const ch = getChannelById(channelId);
  if (!ch) return null;

  ch.members = ch.members.filter((m) => m !== email);
  return ch;
};
