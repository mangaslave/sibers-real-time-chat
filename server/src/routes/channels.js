import express from "express";
import { auth } from "../middleware/auth.js";
import { channelAdminOnly } from "../middleware/channelAdmin.js";
import {
  createChannelController,
  getChannelsController,
  joinChannelController,
  removeMemberController,
  getChannelMessagesController,
  getChannelbyIdController,
  channelMemberController
} from "../controllers/channelsController.js";

const router = express.Router();

router.get("/", auth, getChannelsController);

// Create a new channel
router.post("/", auth, createChannelController);

// Get channel by ID
router.get("/:channelId", auth, getChannelbyIdController);

// Join a channel
router.post("/:channelId/join", auth, joinChannelController);

// Get channel messages
router.get("/:channelId/messages", auth, getChannelMessagesController);

// Get channel members
router.get("/:channelId/members", auth, channelMemberController);

// Only channel admin can remove members
router.delete(
  "/:channelId/members/:email",
  auth,
  channelAdminOnly,
  removeMemberController
);

export default router;