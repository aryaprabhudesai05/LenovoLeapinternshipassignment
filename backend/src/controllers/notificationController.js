import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  const unread = notifications.filter((n) => !n.read).length;
  res.json({ notifications: notifications.map((n) => ({ ...n, id: n._id.toString() })), unread });
});

export const markRead = asyncHandler(async (req, res) => {
  const n = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true },
    { new: true }
  ).lean();
  if (!n) return res.status(404).json({ error: "NotFound", message: "Notification not found" });
  res.json({ ...n, id: n._id.toString() });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
  res.json({ ok: true });
});
