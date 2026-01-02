// src/pages/HomePage.jsx
import { Sparkles, Zap, Code2, ArrowRight } from "lucide-react";

export default function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#0e1016] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl w-full z-10">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl mb-2 ring-1 ring-white/10 shadow-2xl backdrop-blur-md">
            <Code2 className="w-10 h-10 text-blue-400" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              1MinutePython
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Create viral, hacker-style Python content in seconds.
            <br className="hidden md:block" />
            Generate ideas, scripts, and beautiful code snippets instantly.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Generator Card */}
          <button
            onClick={() => onNavigate("generate")}
            className="group relative flex flex-col items-start p-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-3xl transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20"
          >
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
              <ArrowRight className="w-6 h-6 text-purple-400" />
            </div>

            <div className="p-4 bg-purple-500/10 rounded-2xl mb-6 group-hover:bg-purple-500/20 transition-colors border border-purple-500/10">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>

            <h2 className="text-2xl font-bold mb-3 text-white">
              Generate Ideas
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Let AI brainstorm viral topics, catchy hooks, and curious concepts
              for you automatically.
            </p>
          </button>

          {/* Custom Idea Card */}
          <button
            onClick={() => onNavigate("custom")}
            className="group relative flex flex-col items-start p-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 rounded-3xl transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/20"
          >
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
              <ArrowRight className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-2xl mb-6 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/10">
              <Zap className="w-8 h-8 text-emerald-400" />
            </div>

            <h2 className="text-2xl font-bold mb-3 text-white">Custom Topic</h2>
            <p className="text-gray-400 leading-relaxed">
              Have a specific concept? Turn your own idea into a full script and
              code snippet instantly.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
