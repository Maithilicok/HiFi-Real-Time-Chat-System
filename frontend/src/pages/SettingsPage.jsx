import { useThemeStore } from "../store/useThemeStore";

const THEMES = [
  { name: "light", colors: ["#ffffff", "#e5e6e6", "#1f2937", "#3b82f6"] },
  { name: "dark", colors: ["#1d232a", "#191e24", "#a6adbb", "#3b82f6"] },
  { name: "cupcake", colors: ["#faf7f5", "#efeae6", "#291334", "#65c3c8"] },
  { name: "bumblebee", colors: ["#ffffff", "#e5e6e6", "#1f2937", "#e0a82e"] },
  { name: "emerald", colors: ["#ffffff", "#e5e6e6", "#1f2937", "#66cc8a"] },
  { name: "corporate", colors: ["#ffffff", "#e5e6e6", "#1f2937", "#4b6bfb"] },
  { name: "synthwave", colors: ["#1a1333", "#1a1333", "#e2d9f3", "#e779c1"] },
  { name: "retro", colors: ["#e4d8b4", "#d6c9a1", "#282425", "#ef9995"] },
  { name: "cyberpunk", colors: ["#ffee00", "#ff7598", "#1f2937", "#ff7598"] },
  { name: "valentine", colors: ["#fae6f0", "#f0c6d8", "#632c3b", "#e96d7b"] },
  { name: "halloween", colors: ["#212121", "#181818", "#f8f8f8", "#f28c18"] },
  { name: "garden", colors: ["#e9e7e7", "#d5d3d3", "#100f0f", "#5c7f67"] },
  { name: "forest", colors: ["#171212", "#211c1c", "#d4d4d4", "#1eb854"] },
  { name: "aqua", colors: ["#345da7", "#2951a3", "#d4d4d4", "#09ecf3"] },
  { name: "lofi", colors: ["#ffffff", "#e5e6e6", "#1f2937", "#1a1a1a"] },
  { name: "dracula", colors: ["#282a36", "#21222c", "#f8f8f2", "#ff79c6"] },
  { name: "night", colors: ["#0f1729", "#1e2434", "#b3c5ef", "#38bdf8"] },
  { name: "coffee", colors: ["#20161f", "#120d0f", "#c8b8c0", "#db924b"] },
  { name: "winter", colors: ["#ffffff", "#e5e6e6", "#1f2937", "#047aed"] },
  { name: "dim", colors: ["#2a303c", "#242933", "#a6adbb", "#9be1fb"] },
  { name: "nord", colors: ["#242933", "#2e3440", "#d8dee9", "#88c0d0"] },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen pt-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-1 text-base-content">Settings</h1>
        <p className="text-base-content/60 mb-8">Choose a theme for your chat interface</p>

        {/* Theme Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-10">
          {THEMES.map((t) => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={`
                flex flex-col items-center gap-2 p-2 rounded-xl cursor-pointer
                transition-all duration-200 hover:scale-105
                ${theme === t.name ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100" : ""}
              `}
            >
              {/* Color swatch */}
              <div className="grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden w-16 h-10 shadow">
                {t.colors.map((color, i) => (
                  <div key={i} style={{ backgroundColor: color }} className="w-full h-full" />
                ))}
              </div>
              <span className="text-xs capitalize text-base-content/70 font-medium">{t.name}</span>
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="bg-base-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-base-content">Preview</h2>
          <div data-theme={theme} className="rounded-xl p-4 bg-base-100 flex flex-col gap-3">
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm">Primary</button>
              <button className="btn btn-secondary btn-sm">Secondary</button>
              <button className="btn btn-accent btn-sm">Accent</button>
            </div>
            <input className="input input-bordered w-full" placeholder="Sample input..." />
            <div className="chat chat-start">
              <div className="chat-bubble">Hey! How's it going? 👋</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-primary">I'm doing great! 😊</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;