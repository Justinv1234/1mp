// src/pages/HomePage.jsx
import { Sparkles, Lightbulb } from "lucide-react";

export default function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            @1minutepython
          </h1>
          <p className="text-gray-600 text-lg">Video Idea Generator</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onNavigate("generate")}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-3 shadow-lg"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-lg">Generate Video Ideas</span>
          </button>

          <button
            onClick={() => onNavigate("custom")}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-3 shadow-lg"
          >
            <Lightbulb className="w-6 h-6" />
            <span className="text-lg">Input Custom Idea</span>
          </button>
        </div>
      </div>
    </div>
  );
}
