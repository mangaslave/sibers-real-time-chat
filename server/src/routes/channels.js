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
router.post("/", auth, createChannelController);
router.get("/:channelId", auth, getChannelbyIdController);
router.post("/:channelId/join", auth, joinChannelController);
router.get("/:channelId/messages", auth, getChannelMessagesController);
router.get("/:channelId/members", auth, channelMemberController);
router.delete(
  "/:channelId/members/:email",
  auth,
  channelAdminOnly,
  removeMemberController
);

export default router;