// src/pages/IdeaDetailsPage.jsx
import { useState } from "react";
import { ArrowLeft, Sparkles, Loader2, Copy, Check, Play } from "lucide-react";
import CodeWindow from "../components/CodeWindow";

export default function IdeaDetailsPage({ onNavigate, selectedIdea }) {
  const [script, setScript] = useState(null);
  const [loadingScript, setLoadingScript] = useState(false);
  const [scriptError, setScriptError] = useState("");
  const [showAllTTS, setShowAllTTS] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVoiceoverChange = (index, newValue) => {
    const updatedScript = { ...script };
    updatedScript.tts_script[index].voiceover = newValue;
    setScript(updatedScript);
  };

  const handleCloserChange = (newValue) => {
    setScript({ ...script, closer: newValue });
  };

  const getAllTTSText = () => {
    if (!script) return "";
    const allTTS = script.tts_script.map((step) => step.voiceover).join("\n\n");
    return `${allTTS}\n\n${script.closer}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getAllTTSText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateScript = async () => {
    setLoadingScript(true);
    setScriptError("");
    setScript(null);

    // ... (Keep existing prompt logic exactly as it was) ...
    const prompt = `You are an expert content creator for TikTok-style Python tutorials in the style of "1-Minute Python".  
You are given a single **video idea/topic**: "${selectedIdea?.video_idea}"

Generate a **step-by-step Python tutorial script** optimized for **TikTok virality** and **direct use in text-to-speech (ElevenLabs)**.

Requirements:
1. **FIRST STEP MUST BE THE VIRAL HOOK:**
   - The VERY FIRST item in tts_script MUST be a hook with NO code_snippet (leave it empty string "")
   - Examples: "I just deleted 10,000 files in two seconds with Python."
   - Keep it under 15 words but pack maximum impact.
   - NO CODE SHOWN during the hook.
   
2. **EACH STEP SHOWS ONLY NEW CODE** - Do NOT repeat previous code in snippets.
   
3. After the hook, break the tutorial into **teaching steps**, each containing:  
   - **Voiceover:** Short, direct explanation.
   - **Code snippet:** The code SO FAR (cumulative).
   
4. Include a **viral TikTok-style closer** (1-2 sentences).
   
5. Provide a **full combined Python script** at the end.

Output format (JSON) EXACTLY like this:
{
  "tts_script": [
    {
      "voiceover": "VIRAL HOOK - question or bold statement",
      "code_snippet": ""
    },
    {
      "voiceover": "First we import this library",
      "code_snippet": "import requests"
    }
  ],
  "closer": "Follow for daily Python tricks.",
  "full_script": "import requests..."
}

Output **JSON only**, no extra text.`;

    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      setScriptError(
        "OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file"
      );
      setLoadingScript(false);
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
                  "You are a helpful assistant that generates ONLY valid JSON. Ensure all strings/code are properly escaped.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.8,
            max_tokens: 3000,
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      let clean = data.choices[0].message.content
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      // Find JSON object wrapper if text exists around it
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (jsonMatch) clean = jsonMatch[0];

      // Sanitization
      clean = clean
        .replace(/\\n/g, "\\n")
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '\\"')
        .replace(/[\u0000-\u0019]+/g, "");

      const parsed = JSON.parse(clean);

      // Basic validation
      if (!parsed.tts_script || !Array.isArray(parsed.tts_script)) {
        throw new Error("Invalid structure: missing tts_script array");
      }

      setScript(parsed);
    } catch (err) {
      setScriptError(`Failed to generate script: ${err.message}`);
      console.error(err);
    } finally {
      setLoadingScript(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1016] text-white flex flex-col items-center p-6 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl w-full z-10 pt-10 pb-20">
        <button
          onClick={() =>
            onNavigate(selectedIdea?.isCustom ? "custom" : "generate")
          }
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Production Studio</h2>
          <p className="text-gray-400">Review and refine your content</p>
        </div>

        {/* Selected Idea Card */}
        <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-blue-500 to-purple-500" />
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Target Topic
          </h3>
          <p className="text-xl md:text-2xl font-medium text-white mb-2 leading-relaxed">
            {selectedIdea?.video_idea}
          </p>
          {selectedIdea?.tiktok_caption && (
            <div className="mt-4 p-4 bg-black/20 rounded-xl border border-white/5">
              <p className="text-sm text-gray-400 font-mono">
                {selectedIdea.tiktok_caption}
              </p>
            </div>
          )}
        </div>

        {/* Actions Area */}
        <div className="space-y-8">
          {!script && (
            <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-3xl border-dashed">
              <button
                onClick={generateScript}
                disabled={loadingScript}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-500 hover:to-purple-500 focus:outline-none ring-offset-2 focus:ring-2 ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
              >
                {loadingScript ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Generating Magic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    <span>Generate Full Script</span>
                  </>
                )}
              </button>
              {scriptError && (
                <div className="mt-4 text-red-400 bg-red-900/20 px-4 py-2 rounded-lg border border-red-500/20">
                  {scriptError}
                </div>
              )}
            </div>
          )}

          {script && (
            <div className="animate-fade-in space-y-8">
              {/* Script Steps */}
              <div className="space-y-12">
                {script.tts_script.map((step, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -left-4 md:-left-12 top-0 text-gray-600 font-mono text-sm hidden md:block">
                      {index === 0 ? "HOOK" : `0${index}`}
                    </div>

                    {/* Voiceover Input */}
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {index === 0
                          ? "Viral Hook (Voiceover)"
                          : "Voiceover Explanation"}
                      </label>
                      <textarea
                        value={step.voiceover}
                        onChange={(e) =>
                          handleVoiceoverChange(index, e.target.value)
                        }
                        className="w-full bg-[#1c1c1c] text-gray-200 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none leading-relaxed text-lg"
                        rows={index === 0 ? 2 : 3}
                      />
                    </div>

                    {/* Code Display */}
                    {step.code_snippet && step.code_snippet.trim() !== "" && (
                      <div className="mt-4 pl-0 md:pl-4 border-l-2 border-white/5">
                        <CodeWindow code={step.code_snippet} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Closer Section */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Outro / Closer
                </label>
                <textarea
                  value={script.closer}
                  onChange={(e) => handleCloserChange(e.target.value)}
                  className="w-full bg-[#1c1c1c] text-gray-200 border border-white/10 rounded-xl p-4 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                  rows="2"
                />
              </div>

              {/* Tools Section */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setShowAllTTS(!showAllTTS)}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {showAllTTS ? "Hide TTS Script" : "Show Full TTS Script"}
                </button>

                {showAllTTS && (
                  <div className="bg-[#1c1c1c] rounded-xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                      <span className="text-sm font-medium text-gray-400">
                        Full Voiceover Script
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copied ? "Copied!" : "Copy Text"}
                      </button>
                    </div>
                    <div className="p-6">
                      <pre className="whitespace-pre-wrap text-gray-300 font-sans leading-relaxed text-sm md:text-base">
                        {getAllTTSText()}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                      Final Code
                    </span>
                    <div className="h-px flex-1 bg-white/10"></div>
                  </div>
                  <CodeWindow code={script.full_script} />
                </div>
              </div>

              {/* Re-generate Button (Bottom) */}
              <div className="pt-8 flex justify-center">
                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                  Scroll to Top
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
