import { v4 as uuid } from "uuid";

const messages = {};

// Add a new message to a channel with user details
export function addMessage(channelId, user, text) {
  if (!messages[channelId]) {
    messages[channelId] = [];
  }

  const message = {
    id: uuid(),
    userId: user.id,
    userName: user.name,          
    userAvatar: user.avatar || null, 
    userEmail: user.email, 
    text: text.trim(),
    timestamp: Date.now(),
  };

  messages[channelId].push(message);
  return message;
}

export function getMessages(channelId) {
  return messages[channelId] || [];
}