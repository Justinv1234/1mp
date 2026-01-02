// src/pages/CustomPage.jsx
import { useState } from "react";
import { Zap, ArrowLeft } from "lucide-react";

export default function CustomPage({ onNavigate, onSelectIdea }) {
  const [customIdea, setCustomIdea] = useState("");

  const handleSubmit = () => {
    if (customIdea.trim()) {
      onSelectIdea({
        video_idea: customIdea,
        tiktok_caption: "",
        isCustom: true,
      });
      onNavigate("idea-details");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1016] text-white flex flex-col items-center p-6 relative overflow-hidden">
      {/* Ambient Background Effects (Emerald/Teal Theme) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] left-[20%] w-[60%] h-[60%] bg-emerald-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-teal-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-2xl w-full z-10 pt-10">
        <button
          onClick={() => onNavigate("home")}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20">
              <Zap className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Input Custom Idea</h2>
            <p className="text-gray-400">Describe your Python tutorial concept</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3 ml-1">
                Your Video Idea
              </label>
              <textarea
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                className="w-full bg-[#0e1016] border border-white/10 rounded-xl p-5 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-600 leading-relaxed"
                rows="6"
                placeholder="e.g. How to create a fake hacking screen in Python with 3 lines of code..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!customIdea.trim()}
              className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-white/10"
            >
              <span>Continue to Script</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}