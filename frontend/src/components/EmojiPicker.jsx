import { useState, useRef, useEffect, useCallback } from "react";


const CATEGORIES = [
  {
    label: "Quick picks",
    emojis: ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "👏"],
  },
  {
    label: "Smileys",
    emojis: ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🥰","😍","🤩","😘","😋","😛","😜","🤪","😎","🥳","😏","😒","😔","😢","😭","😤","😠","😡","🤯","😳","🥺","😬","🤭","🤫","🤔"],
  },
  {
    label: "Gestures",
    emojis: ["👍","👎","👏","🙌","🤝","✊","👊","✋","👋","🤙","💪","🦾","🤞","🤟","🤘","☝️","👆","👇","👈","👉"],
  },
  {
    label: "Hearts & stars",
    emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","💕","💞","💓","💗","💖","💘","💝","🔥","⭐","✨","💫","🌟","⚡","🎊","🎉","🎈"],
  },
  {
    label: "Objects",
    emojis: ["🚀","💻","📱","🎮","🏆","🥇","🎯","💡","🔑","💎","📸","🎵","🎶","🍕","🍔","☕","🍺","🎂","🌈","🌙","☀️","🌊"],
  },
];

const ALL_EMOJIS = [...new Set(CATEGORIES.flatMap((c) => c.emojis))];


const QUICK_EMOJIS = ["👍", "❤️", "😂", "🔥", "😮", "😢"];

export const ReactionQuickBar = ({ onReact, onOpenGrid, myReaction, isMine }) => {
  return (
    <div
      className="flex items-center gap-1 px-2 py-1.5 rounded-3xl"
      style={{
        background: "#1c1c28",
        border: "0.5px solid rgba(255,255,255,0.12)",
        position: "absolute",
        bottom: "calc(100% + 8px)",
        ...(isMine ? { right: 0 } : { left: 0 }),
        zIndex: 20,
        whiteSpace: "nowrap",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {QUICK_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="flex items-center justify-center rounded-full transition-all"
          style={{
            width: 32,
            height: 32,
            fontSize: 18,
            background: myReaction === emoji ? "rgba(108,99,255,0.3)" : "transparent",
            outline: myReaction === emoji ? "1.5px solid #6C63FF" : "none",
            transform: "scale(1)",
            transition: "transform 0.12s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {emoji}
        </button>
      ))}

      <button
        onClick={onOpenGrid}
        className="flex items-center justify-center rounded-full transition-all"
        style={{
          width: 32,
          height: 32,
          fontSize: 14,
          fontWeight: 500,
          color: "rgba(255,255,255,0.5)",
          background: "rgba(255,255,255,0.07)",
          border: "0.5px solid rgba(255,255,255,0.1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.14)";
          e.currentTarget.style.color = "rgba(255,255,255,0.85)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
        }}
      >
        +
      </button>
    </div>
  );
};

 
export const EmojiGrid = ({ onReact, onClose, myReaction, anchorRef }) => {
  const [search, setSearch] = useState("");
  const boxRef = useRef(null);

  
  useEffect(() => {
    if (!anchorRef?.current || !boxRef.current) return;
    const anchor = anchorRef.current.getBoundingClientRect();
    const box = boxRef.current;
    const spaceBelow = window.innerHeight - anchor.bottom;
    const top = spaceBelow > 300
      ? anchor.bottom + 8
      : anchor.top - box.offsetHeight - 8;
    let left = anchor.left - 130;
    if (left < 8) left = 8;
    if (left + 280 > window.innerWidth) left = window.innerWidth - 288;
    box.style.top = Math.max(8, top) + "px";
    box.style.left = left + "px";
  }, [anchorRef]);

  
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const filtered = search.trim()
    ? ALL_EMOJIS.filter((e) => e.includes(search.trim()))
    : null;

  return (
    <div
      ref={boxRef}
      style={{
        position: "fixed",
        zIndex: 999,
        width: 280,
        background: "#1c1c28",
        border: "0.5px solid rgba(255,255,255,0.12)",
        borderRadius: 16,
        padding: 12,
        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
      }}
    >
      
      <input
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search emoji..."
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.06)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          padding: "7px 12px",
          fontSize: 13,
          color: "rgba(255,255,255,0.8)",
          outline: "none",
          marginBottom: 10,
          fontFamily: "inherit",
        }}
      />

      
      <div style={{ maxHeight: 260, overflowY: "auto" }}>
        {filtered ? (
          filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {filtered.map((emoji) => (
                <EmojiBtn key={emoji} emoji={emoji} selected={myReaction === emoji} onReact={onReact} onClose={onClose} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13, padding: "16px 0" }}>
              No results
            </p>
          )
        ) : (
          CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", margin: "8px 0 5px" }}>
                {cat.label}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                {cat.emojis.map((emoji) => (
                  <EmojiBtn key={emoji} emoji={emoji} selected={myReaction === emoji} onReact={onReact} onClose={onClose} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const EmojiBtn = ({ emoji, selected, onReact, onClose }) => (
  <button
    onClick={() => { onReact(emoji); onClose(); }}
    style={{
      width: 36,
      height: 36,
      borderRadius: 8,
      border: "none",
      background: selected ? "rgba(108,99,255,0.3)" : "transparent",
      outline: selected ? "1.5px solid #6C63FF" : "none",
      fontSize: 20,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.12s",
    }}
    onMouseEnter={(e) => {
      if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.1)";
      e.currentTarget.style.transform = "scale(1.18)";
    }}
    onMouseLeave={(e) => {
      if (!selected) e.currentTarget.style.background = "transparent";
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    {emoji}
  </button>
);

export default EmojiGrid;