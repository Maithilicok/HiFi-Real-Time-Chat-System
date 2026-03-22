import { useState, useRef } from "react";
import { Reply, MoreHorizontal } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { formatMessageTime } from "../lib/utils";
import { ReactionQuickBar, EmojiGrid } from "./EmojiPicker";

const GRADIENTS = [
  "linear-gradient(135deg,#FF6B6B,#FF8E53)",
  "linear-gradient(135deg,#4ECDC4,#44A08D)",
  "linear-gradient(135deg,#A29BFE,#6C5CE7)",
  "linear-gradient(135deg,#FD79A8,#E84393)",
  "linear-gradient(135deg,#FDCB6E,#E17055)",
  "linear-gradient(135deg,#74B9FF,#0984E3)",
];
const getGradient = (id = "") => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
};

const MessageBubble = ({ message, isMine, authUser, selectedUser }) => {
  const [showActions, setShowActions] = useState(false);
  const [showQuickBar, setShowQuickBar] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const gridAnchorRef = useRef(null);

  const { reactToMessage, deleteMessage, setReplyingTo } = useChatStore();

  const pic = isMine ? authUser.profilePic : selectedUser.profilePic;
  const gradient = getGradient(isMine ? authUser._id : selectedUser._id);
  const initials = (isMine ? authUser.fullName : selectedUser.fullName)
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const reactionsObj =
    message.reactions instanceof Map
      ? Object.fromEntries(message.reactions)
      : message.reactions && typeof message.reactions === "object"
      ? message.reactions
      : {};

  const myReaction = reactionsObj[authUser._id] || null;

  const grouped = Object.values(reactionsObj).reduce((acc, emoji) => {
    acc[emoji] = (acc[emoji] || 0) + 1;
    return acc;
  }, {});

  const isSeen = message.seenBy?.includes(selectedUser._id);
  const isDeleted = message.deletedForEveryone;

  const handleReact = (emoji) => {
    reactToMessage(message._id, emoji === myReaction ? "" : emoji);
  };

  return (
    <div
      className={`flex items-end gap-2 msg-appear ${isMine ? "flex-row-reverse" : "flex-row"}`}
      style={{ marginBottom: 6 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowQuickBar(false);
        if (!showGrid) setShowDeleteMenu(false);
      }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mb-1">
        {pic ? (
          <img src={pic} alt="" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: gradient }}>
            {initials}
          </div>
        )}
      </div>

      <div className={`flex flex-col max-w-[65%] ${isMine ? "items-end" : "items-start"}`}>

        {/* Reply preview */}
        {message.replyTo && !isDeleted && (
          <div className="px-3 py-1.5 mb-1 rounded-xl text-xs max-w-full bg-base-200 border-l-2 border-primary">
            <span className="text-primary" style={{ fontSize: 10 }}>Replying to</span>
            <p className="truncate mt-0.5 text-base-content/50" style={{ maxWidth: 200 }}>
              {message.replyTo.text || "Image"}
            </p>
          </div>
        )}

        {/* Bubble */}
        <div className="relative" ref={gridAnchorRef}>

          {/* Hover quick bar */}
          {showActions && !isDeleted && showQuickBar && (
            <ReactionQuickBar
              onReact={handleReact}
              onOpenGrid={() => setShowGrid(true)}
              myReaction={myReaction}
              isMine={isMine}
            />
          )}

          {isDeleted ? (
            <div className="px-4 py-2.5 text-sm italic rounded-2xl bg-base-200 border border-base-300 text-base-content/40">
              This message was deleted
            </div>
          ) : (
            <div
              className="px-4 py-2.5 text-sm leading-relaxed"
              style={
                isMine
                  ? { background: "oklch(var(--p))", color: "oklch(var(--pc))", borderRadius: "18px 18px 4px 18px" }
                  : { background: "oklch(var(--b2))", color: "oklch(var(--bc))", borderRadius: "18px 18px 18px 4px", border: "0.5px solid oklch(var(--b3))" }
              }
            >
              {message.image && (
                <img src={message.image} alt="Attachment" className="rounded-2xl mb-2" style={{ maxWidth: 200 }} />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          )}

          {/* Floating action buttons */}
          {!isDeleted && showActions && (
            <div
              className={`absolute flex items-center gap-1 ${isMine ? "right-full mr-2" : "left-full ml-2"}`}
              style={{ bottom: 4, zIndex: 10 }}
            >
              {/* React */}
              <button
                onClick={() => setShowQuickBar((v) => !v)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm
                  bg-base-200 border border-base-300 hover:bg-base-300 transition-all"
              >
                {myReaction || "😊"}
              </button>

              {/* Reply */}
              <button
                onClick={() => setReplyingTo(message)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all
                  bg-base-200 border border-base-300 text-base-content/50
                  hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              >
                <Reply className="w-3.5 h-3.5" />
              </button>

              {/* More / Delete */}
              <div className="relative">
                <button
                  onClick={() => setShowDeleteMenu((v) => !v)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all
                    bg-base-200 border border-base-300 text-base-content/50 hover:bg-base-300"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
                {showDeleteMenu && (
                  <div className="absolute rounded-xl overflow-hidden bg-base-200 border border-base-300 z-30"
                    style={{ top: "calc(100% + 4px)", right: 0, minWidth: 170, boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
                    <button
                      onClick={() => { deleteMessage(message._id, "me"); setShowDeleteMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-base-content/75 hover:bg-base-300 transition-colors"
                    >
                      Delete for me
                    </button>
                    {isMine && (
                      <button
                        onClick={() => { deleteMessage(message._id, "everyone"); setShowDeleteMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        Delete for everyone
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Full emoji grid */}
        {showGrid && (
          <EmojiGrid
            onReact={handleReact}
            onClose={() => setShowGrid(false)}
            myReaction={myReaction}
            anchorRef={gridAnchorRef}
          />
        )}

        {/* Reaction pills */}
        {Object.keys(grouped).length > 0 && !isDeleted && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(grouped).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all"
                style={{
                  background: myReaction === emoji ? "oklch(var(--p)/0.2)" : "oklch(var(--b2))",
                  border: `0.5px solid ${myReaction === emoji ? "oklch(var(--p)/0.4)" : "oklch(var(--b3))"}`,
                  color: "oklch(var(--bc)/0.7)",
                }}
              >
                {emoji}
                {count > 1 && <span style={{ color: "oklch(var(--bc)/0.5)", fontSize: 11 }}>{count}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Time + seen */}
        <div className="flex items-center gap-1.5 mt-1 px-1">
          <span className="text-xs text-base-content/30">
            {formatMessageTime(message.createdAt)}
          </span>
          {isMine && !isDeleted && (
            <span style={{ color: isSeen ? "oklch(var(--p))" : "oklch(var(--bc)/0.3)", fontSize: 10 }}>
              {isSeen ? "Seen" : "Sent"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;