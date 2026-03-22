import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io, getReceiverSocketId } from "../lib/socket.js";


const emitToUser = (userId, event, data) => {
  const socketId = getReceiverSocketId(userId);
  if (socketId) io.to(socketId).emit(event, data);
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
      deletedFor: { $ne: myId },        
      deletedForEveryone: { $ne: true }, 
    }).populate("replyTo", "text image senderId"); 

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

      const formData = new URLSearchParams();
      formData.append("file", image);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      imageUrl = uploadData.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      replyTo: replyTo || null,
    });

    await newMessage.save();

   
    await newMessage.populate("replyTo", "text image senderId");

  
    emitToUser(receiverId, "newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const reactToMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id.toString();

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    if (emoji) {
      message.reactions.set(userId, emoji);
    } else {
      message.reactions.delete(userId);
    }

    await message.save();

    
    const otherId =
      message.senderId.toString() === userId
        ? message.receiverId
        : message.senderId;

    const payload = { messageId, reactions: Object.fromEntries(message.reactions) };
    emitToUser(otherId, "messageReaction", payload);

    res.status(200).json(payload);
  } catch (error) {
    console.log("Error in reactToMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const markMessagesAsSeen = async (req, res) => {
  try {
    const { senderId } = req.params;
    const myId = req.user._id;

  
    await Message.updateMany(
      {
        senderId,
        receiverId: myId,
        seenBy: { $ne: myId },
      },
      { $addToSet: { seenBy: myId } }
    );

    
    emitToUser(senderId, "messagesSeen", { by: myId, from: senderId });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in markMessagesAsSeen:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { deleteFor } = req.body; 
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    
    if (deleteFor === "everyone" && message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Only the sender can delete for everyone" });
    }

    if (deleteFor === "everyone") {
      message.deletedForEveryone = true;
      message.text = null;
      message.image = null;
    } else {
      message.deletedFor.addToSet(userId);
    }

    await message.save();

    const otherId =
      message.senderId.toString() === userId.toString()
        ? message.receiverId
        : message.senderId;

    const payload = {
      messageId,
      deletedForEveryone: message.deletedForEveryone,
      deletedFor: deleteFor,
    };

    emitToUser(otherId, "messageDeleted", payload);

    res.status(200).json(payload);
  } catch (error) {
    console.log("Error in deleteMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

