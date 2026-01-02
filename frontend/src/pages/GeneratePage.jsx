// src/pages/GeneratePage.jsx
import { useState } from "react";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";

export default function GeneratePage({ onNavigate, onSelectIdea }) {
  const [numIdeas, setNumIdeas] = useState(10);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateIdeas = async () => {
    setLoading(true);
    setError("");
    setIdeas([]);

    const prompt = `You are an expert short-form content creator for a programming channel called "1MinutePython".
Your job is to generate ${numIdeas} Python video ideas that feel:
- Slightly dangerous (but ethical)
- Curiosity-inducing
- Hacker-adjacent
- Beginner-friendly
- Demoable in under 1 minute
Each video should feel like:
"Python just did something it probably shouldn't 😳💻"
For each video, output in the following JSON format EXACTLY:
[
  {
    "video_idea": "Short, scroll-stopping concept/title for the video",
    "tiktok_caption": "Edgy, viral TikTok caption with emojis, curiosity hooks, short sentences or ellipses, hacker vibes, and 4–5 hashtags"
  }
]
CAPTION STYLE RULES (VERY IMPORTANT):
- Start with a shocking or curiosity hook
- Use emojis naturally (😳 💻 🔐 🕵️‍♂️ 🚀 👀)
- Use short punchy sentences
- Make it feel exclusive or urgent
- Sound like hacker behavior
- Include exactly 4 or 5 hashtags
- DO NOT include ethical disclaimers
OUTPUT RULES:
- Output valid JSON only
- No explanations
- No markdown
Now generate ${numIdeas} video ideas.`;

    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      setError(
        "OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that generates JSON output only.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.9,
            max_tokens: 4000,
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const text = data.choices[0].message.content;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setIdeas(parsed);
    } catch (err) {
      setError(`Failed to generate ideas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1016] text-white flex flex-col items-center p-6 relative overflow-hidden">
      {/* Ambient Background Effects (Purple/Blue Theme) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] left-[0%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px]" />
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
            <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-4 border border-purple-500/20">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Generate Video Ideas</h2>
            <p className="text-gray-400">AI-powered Python tutorial concepts</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3 ml-1">
                Number of Ideas to Generate
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={numIdeas}
                onChange={(e) => setNumIdeas(e.target.value)}
                className="w-full bg-[#0e1016] border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600"
                placeholder="10"
              />
            </div>

            <button
              onClick={generateIdeas}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-white/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate {numIdeas} Ideas</span>
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="mt-8 space-y-4 pb-20">
          {ideas.length > 0 && (
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-4 ml-2">
              Generated Results
            </div>
          )}

          {ideas.map((idea, index) => (
            <div
              key={index}
              onClick={() => {
                onSelectIdea(idea);
                onNavigate("idea-details");
              }}
              className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 rounded-2xl p-5 cursor-pointer transition-all duration-200"
            >
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/20">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-200 mb-2 group-hover:text-white transition-colors">
                    {idea.video_idea}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-400 line-clamp-2">
                    {idea.tiktok_caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
