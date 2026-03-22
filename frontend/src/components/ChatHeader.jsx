import { X, Phone, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

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

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  const initials = selectedUser.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="px-4 py-3 flex items-center justify-between bg-base-100 border-b border-base-300">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          {selectedUser.profilePic ? (
            <img
              src={selectedUser.profilePic}
              alt={selectedUser.fullName}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: "2px solid rgba(108,99,255,0.4)" }}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ background: getGradient(selectedUser._id), border: "2px solid rgba(108,99,255,0.4)" }}
            >
              {initials}
            </div>
          )}
          {isOnline && (
            <span
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full online-pulse"
              style={{ background: "#00D68F", border: "2px solid var(--fallback-b1,oklch(var(--b1)))" }}
            />
          )}
        </div>

        {/* Name + status */}
        <div>
          <h3
            className="font-semibold text-sm text-base-content"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {selectedUser.fullName}
          </h3>
          <div className="flex items-center gap-1.5">
            {isOnline && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00D68F" }} />
            )}
            <p
              className="text-xs"
              style={{ color: isOnline ? "#00D68F" : "oklch(var(--bc)/0.45)" }}
            >
              {isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <HeaderBtn icon={<Video className="w-4 h-4" />} />
        <HeaderBtn icon={<Phone className="w-4 h-4" />} />
        <button
          onClick={() => setSelectedUser(null)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all
            text-base-content/40 hover:bg-error/10 hover:text-error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const HeaderBtn = ({ icon }) => (
  <button
    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all
      bg-base-200 border border-base-300 text-base-content/50
      hover:bg-primary/10 hover:text-primary"
  >
    {icon}
  </button>
);

export default ChatHeader;