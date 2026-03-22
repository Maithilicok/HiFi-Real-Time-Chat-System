import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import MessageBubble from "./MessageBubble";

const groupByDate = (messages) => {
  const groups = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const d = new Date(msg.createdAt).toDateString();
    if (d !== lastDate) {
      groups.push({ type: "date", label: formatDate(msg.createdAt) });
      lastDate = d;
    }
    groups.push({ type: "message", data: msg });
  });
  return groups;
};

const formatDate = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getGradient = (id = "") => {
  const GRADIENTS = [
    "linear-gradient(135deg,#FF6B6B,#FF8E53)",
    "linear-gradient(135deg,#4ECDC4,#44A08D)",
    "linear-gradient(135deg,#A29BFE,#6C5CE7)",
    "linear-gradient(135deg,#FD79A8,#E84393)",
    "linear-gradient(135deg,#FDCB6E,#E17055)",
    "linear-gradient(135deg,#74B9FF,#0984E3)",
  ];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
};

const TypingIndicator = ({ selectedUser }) => {
  const pic = selectedUser.profilePic;
  const gradient = getGradient(selectedUser._id);
  const initials = selectedUser.fullName
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex items-end gap-2" style={{ marginBottom: 6 }}>
      <div className="flex-shrink-0">
        {pic ? (
          <img src={pic} alt="" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: gradient }}>
            {initials}
          </div>
        )}
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1 bg-base-200 border border-base-300">
        <span className="w-2 h-2 rounded-full bg-base-content/40 typing-dot" style={{ display: "inline-block" }} />
        <span className="w-2 h-2 rounded-full bg-base-content/40 typing-dot" style={{ display: "inline-block" }} />
        <span className="w-2 h-2 rounded-full bg-base-content/40 typing-dot" style={{ display: "inline-block" }} />
      </div>
    </div>
  );
};

const ChatContainer = () => {
  const {
    messages, getMessages, isMessagesLoading, selectedUser,
    subscribeToMessages, unsubscribeFromMessages, markAsSeen, isTyping,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    markAsSeen(selectedUser._id);
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, markAsSeen]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const grouped = groupByDate(messages);

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {grouped.map((item, idx) => {
          if (item.type === "date") {
            return (
              <div key={`date-${idx}`} className="flex items-center gap-3 py-3">
                <div className="flex-1 h-px bg-base-300" />
                <span
                  className="text-xs px-3 py-1 rounded-full bg-base-200 border border-base-300 text-base-content/40"
                  style={{ fontSize: 11 }}
                >
                  {item.label}
                </span>
                <div className="flex-1 h-px bg-base-300" />
              </div>
            );
          }
          const msg = item.data;
          return (
            <MessageBubble
              key={msg._id}
              message={msg}
              isMine={msg.senderId === authUser._id}
              authUser={authUser}
              selectedUser={selectedUser}
            />
          );
        })}

        {isTyping && <TypingIndicator selectedUser={selectedUser} />}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;