// src/pages/CustomPage.jsx
import { useState } from "react";
import { Lightbulb } from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => onNavigate("home")}
          className="mb-6 text-teal-600 hover:text-teal-800 font-medium transition duration-200"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-8">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Input Custom Idea
          </h2>
          <p className="text-gray-600">Describe your Python tutorial concept</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Video Idea
            </label>
            <textarea
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-emerald-500 focus:outline-none transition duration-200 resize-none"
              rows="6"
              placeholder="Describe your video idea here..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!customIdea.trim()}
            className="w-full bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
