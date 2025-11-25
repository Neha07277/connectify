import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

/** ===============================
 *  GET ALL CONTACTS (EXCEPT ME)
 * =============================== */
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/** ===============================
 *  GET CHAT PARTNERS
 * =============================== */
export const getChatPartners = async (req, res) => {
  try {
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: myId }, { receiverId: myId }],
    }).sort({ createdAt: -1 });

    if (messages.length === 0) {
      return res.status(200).json([]);
    }

    const partnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === myId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const users = await User.find({ _id: { $in: partnerIds } }).select("-password");

    const chatList = users.map((user) => {
      const lastMsg = messages.find(
        (m) =>
          m.senderId.toString() === user._id.toString() ||
          m.receiverId.toString() === user._id.toString()
      );

      return {
        user,
        lastMessage: lastMsg ? lastMsg.text || lastMsg.image : "",
        status: lastMsg ? lastMsg.status : "sent",
        timestamp: lastMsg ? lastMsg.createdAt : "",
      };
    });

    res.status(200).json(chatList);
  } catch (error) {
    console.error("getChatPartners error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/** ===============================
 *  GET MESSAGES BETWEEN TWO USERS
 * =============================== */
export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id.toString();
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    const cleaned = messages.map(m => ({
      ...m._doc,
      senderId: m.senderId.toString(),
      receiverId: m.receiverId.toString(),
    }));

    res.status(200).json(cleaned);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


/** ===============================
 *  SEND MESSAGE (TEXT / IMAGE)
 * =============================== */
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id.toString();

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }

    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      status: "sent",
    });

    await newMessage.save();

    const cleaned = {
      ...newMessage._doc,
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
    };

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", cleaned);
    }

    res.status(201).json(cleaned);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


/** ===============================
 *  MARK AS DELIVERED
 * =============================== */
export const markMessagesAsDelivered = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: senderId } = req.params;

    await Message.updateMany(
      { senderId, receiverId: myId, status: "sent" },
      { $set: { status: "delivered" } }
    );

    const socketId = getReceiverSocketId(senderId);
    if (socketId) {
      io.to(socketId).emit("messagesDelivered", { from: myId });
    }

    res.status(200).json({ message: "Delivered updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

/** ===============================
 *  MARK AS SEEN
 * =============================== */
export const markMessageAsSeen = async (req, res) => {
  try {
    const myId = req.user._id;
    const { messageId } = req.params;

    const msg = await Message.findOne({
      _id: messageId,
      receiverId: myId,
    });

    if (!msg) return res.status(404).json({ error: "Message not found" });

    msg.status = "seen";
    await msg.save();

    const socketId = getReceiverSocketId(msg.senderId);
    if (socketId) {
      io.to(socketId).emit("messageSeen", { messageId });
    }

    res.status(200).json({ message: "Marked as seen" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
