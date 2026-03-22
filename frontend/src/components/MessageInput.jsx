import { useRef, useState, useEffect, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";

const TYPING_DEBOUNCE = 1500;

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [focused, setFocused] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const { sendMessage, selectedUser, replyingTo, clearReplyingTo } = useChatStore();
  const { socket } = useAuthStore();

  const emitTyping = useCallback(() => {
    if (!socket || !selectedUser) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", { receiverId: selectedUser._id });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, TYPING_DEBOUNCE);
  }, [socket, selectedUser]);

  const emitStopTyping = useCallback(() => {
    clearTimeout(typingTimeoutRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket?.emit("stopTyping", { receiverId: selectedUser?._id });
    }
  }, [socket, selectedUser]);

  useEffect(() => { return () => emitStopTyping(); }, [emitStopTyping]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    emitStopTyping();
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        replyTo: replyingTo?._id || null,
      });
      setText("");
      setImagePreview(null);
      clearReplyingTo();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const canSend = text.trim() || imagePreview;

  return (
    <div className="px-4 py-3 bg-base-100 border-t border-base-300">

      {/* Reply preview */}
      {replyingTo && (
        <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl bg-primary/10 border border-primary/25">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium mb-0.5 text-primary">Replying to message</p>
            <p className="text-xs truncate text-base-content/50">
              {replyingTo.text || "Image"}
            </p>
          </div>
          <button onClick={clearReplyingTo} className="ml-3 flex-shrink-0 text-base-content/40 hover:text-base-content">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-base-300" />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-error text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-base-content/40">Image ready to send</span>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-3">

        {/* Emoji btn */}
        <button
          type="button"
          className="flex-shrink-0 w-9 h-9 rounded-xl hidden sm:flex items-center justify-center
            bg-base-200 border border-base-300 text-base-content/40
            hover:bg-warning/10 hover:text-warning hover:border-warning/30 transition-all"
        >
          <Smile className="w-4 h-4" />
        </button>

        {/* Input */}
        <div
          className="flex-1 flex items-center gap-2 px-4 rounded-2xl bg-base-200 border transition-all"
          style={{
            borderColor: focused ? "oklch(var(--p))" : "oklch(var(--b3))",
            boxShadow: focused ? "0 0 0 3px oklch(var(--p)/0.15)" : "none",
          }}
        >
          <input
            type="text"
            className="flex-1 bg-transparent text-sm py-2.5 outline-none text-base-content placeholder:text-base-content/30"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            placeholder={replyingTo ? "Write a reply..." : "Type a message..."}
            value={text}
            onChange={(e) => { setText(e.target.value); emitTyping(); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex-shrink-0 transition-all text-base-content/30 hover:text-primary ${imagePreview ? "text-primary" : ""}`}
          >
            <Image className="w-4 h-4" />
          </button>
        </div>

        {/* Send */}
        <button
          type="submit"
          disabled={!canSend}
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all
            btn btn-primary disabled:opacity-30"
          style={{ boxShadow: canSend ? "0 0 16px oklch(var(--p)/0.35)" : "none" }}
        >
          <Send className="w-4 h-4" style={{ marginLeft: 1 }} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;