// src/pages/GeneratePage.jsx
import { useState } from "react";
import { Sparkles } from "lucide-react";

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
  Examples:
  - "Python just shut down my computer 😳💻"
  - "This Python script feels illegal…"
  - "Hackers use THIS Python trick 👀"
- Use emojis naturally (😳 💻 🔐 🕵️‍♂️ 🚀 👀)
- Use short punchy sentences or ellipses
- Make it feel exclusive or urgent ("Save this", "Before it's gone")
- Sound like hacker behavior
- Include exactly **4 or 5 hashtags**
- Hashtags should be relevant and commonly viral (e.g. #Python #Hacking #CyberSecurity #LearnPython #Coding #TechTricks)
- DO NOT include ethical disclaimers like "Don't use this for evil" or "Use responsibly" in the caption
CONTENT RULES:
- Ideas must be programming-related
- Beginner-friendly but impressive
- Each idea must feel different
OUTPUT RULES:
- Output valid JSON only
- No explanations
- No markdown
- No extra text
Now generate ${numIdeas} video ideas following ALL rules above.`;

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
                  "You are a helpful assistant that generates JSON output only. Never include markdown code blocks or explanations. Ensure all strings in JSON are properly escaped, especially code snippets with quotes and backslashes.",
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

      if (data.error) {
        throw new Error(data.error.message);
      }

      const text = data.choices[0].message.content;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      setIdeas(parsed);
    } catch (err) {
      setError(`Failed to generate ideas: ${err.message}`);
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => onNavigate("home")}
          className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium transition duration-200"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Generate Video Ideas
          </h2>
          <p className="text-gray-600">
            AI-powered Python tutorial ideas for your TikTok
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Number of Ideas
            </label>
            <input
              type="number"
              min="1"
              max="15"
              value={numIdeas}
              onChange={(e) => setNumIdeas(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-purple-500 focus:outline-none transition duration-200"
              placeholder="Enter number of ideas"
            />
          </div>

          <button
            onClick={generateIdeas}
            disabled={loading}
            className="w-full bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Generating..."
              : `Generate ${numIdeas} ${numIdeas == 1 ? "Idea" : "Ideas"}`}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 min-h-48">
            {ideas.length === 0 && !loading && (
              <p className="text-gray-400 text-center">
                Generated ideas will appear here
              </p>
            )}
            {loading && (
              <p className="text-gray-600 text-center">
                Generating your video ideas...
              </p>
            )}
            {ideas.length > 0 && (
              <div className="space-y-4">
                {ideas.map((idea, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      onSelectIdea(idea);
                      onNavigate("idea-details");
                    }}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-400 hover:shadow-md transition duration-200 cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {index + 1}. {idea.video_idea}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {idea.tiktok_caption}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
