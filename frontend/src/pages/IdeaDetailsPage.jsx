// src/pages/IdeaDetailsPage.jsx
import { useState } from "react";
import CodeWindow from "../components/CodeWindow";

export default function IdeaDetailsPage({ onNavigate, selectedIdea }) {
  const [script, setScript] = useState(null);
  const [loadingScript, setLoadingScript] = useState(false);
  const [scriptError, setScriptError] = useState("");
  const [showAllTTS, setShowAllTTS] = useState(false);

  const handleVoiceoverChange = (index, newValue) => {
    const updatedScript = { ...script };
    updatedScript.tts_script[index].voiceover = newValue;
    setScript(updatedScript);
  };

  const handleCloserChange = (newValue) => {
    setScript({ ...script, closer: newValue });
  };

  const getAllTTSText = () => {
    const allTTS = script.tts_script.map((step) => step.voiceover).join("\n\n");

    return `${allTTS}\n\n${script.closer}`;
  };

  const generateScript = async () => {
    setLoadingScript(true);
    setScriptError("");
    setScript(null);

    const prompt = `You are an expert content creator for TikTok-style Python tutorials in the style of "1-Minute Python".  
You are given a single **video idea/topic**: "${selectedIdea?.video_idea}"

Generate a **step-by-step Python tutorial script** optimized for **TikTok virality** and **direct use in text-to-speech (ElevenLabs)**.

Requirements:
1. **FIRST STEP MUST BE THE VIRAL HOOK - THIS IS CRITICAL:**
   - The VERY FIRST item in tts_script MUST be a hook with NO code_snippet (leave it empty string "")
   - This is the scroll-stopper that appears BEFORE any code is shown
   - Must create IMMEDIATE curiosity, shock, or disbelief
   - THE HOOK MUST BE EXTREMELY ATTENTION-GRABBING - Examples:
     * "I just deleted 10,000 files in two seconds with Python."
     * "Python can read your passwords right now and I'll show you how."
     * "Watch me crash a website with five lines of code."
     * "Your computer is doing this right now and you don't even know it."
     * "This Python script just emptied my recycle bin automatically."
     * "I made Python control my mouse and keyboard while I sleep."
     * "Hackers use this exact code to break into systems."
     * "Python just sent 100 emails without me touching anything."
     * "I automated my entire job with this script."
   - HOOK FORMULA: Use present tense action + shocking outcome
     * "I just [did something intense] with Python"
     * "Python can [do something forbidden-sounding]"
     * "Watch me [do something impressive] in X seconds"
     * "This script just [completed shocking action]"
     * "[Something scary] is happening right now"
   - Make it feel IMMEDIATE and REAL, not hypothetical
   - Use specific numbers when possible: "10,000 files", "five lines", "100 emails"
   - Sound like you JUST did this or are about to do it NOW
   - Keep it under 15 words but pack maximum impact
   - NO CODE SHOWN during the hook - pure attention-grabbing statement
   
2. **EACH STEP SHOWS ONLY NEW CODE** - Do NOT repeat previous code:
   - Step 1: Show ONLY the first import or line
   - Step 2: Show ONLY the NEW line(s) being added (not the import again)
   - Step 3: Show ONLY the next NEW addition
   - Each code_snippet should contain ONLY the code being discussed in that step
   - The full_script at the end will have everything combined
   - This keeps each snippet focused and avoids repetition
   
3. After the hook, break the tutorial into **teaching steps**, each containing:  
   - **Voiceover:** Short, direct explanation of what you're adding NOW
     * Keep it raw and real: "First we import this", "Now add this line", "Here's where it gets interesting"
     * No fluff, no over-explaining - just what this step does
     * Sound like you're doing something you probably shouldn't be showing
   - **Code snippet:** The code SO FAR (cumulative from start to this step)
   
4. Include a **viral TikTok-style closer** at the end that:  
   - Wraps up with understated confidence
   - Quick mention of time: "under a minute" or "that simple"
   - Direct CTA: "Follow for more", "Daily Python tricks", "Save this"
   - Keep it short - 1-2 sentences max
   
5. Provide a **full combined Python script** at the end (this will be identical to the last step's code).

CRITICAL JSON FORMATTING:
- All code snippets MUST have properly escaped special characters
- Use \\" for quotes inside code strings
- Use \\\\ for backslashes in code
- Never use single quotes in JSON - only double quotes
- Ensure all JSON keys use double quotes
- Remove any trailing commas before closing brackets
- Test that your output is valid JSON before returning it

Output format (JSON) EXACTLY like this:
{
  "tts_script": [
    {
      "voiceover": "VIRAL HOOK - question or bold statement under 15 words",
      "code_snippet": ""
    },
    {
      "voiceover": "First we import this library",
      "code_snippet": "import requests"
    },
    {
      "voiceover": "Now we set up the target",
      "code_snippet": "target = \\"example.com\\""
    },
    {
      "voiceover": "Here's where we actually make the request",
      "code_snippet": "response = requests.get(target)"
    }
  ],
  "closer": "That's it. Under 60 seconds. Follow for daily Python tricks.",
  "full_script": "import requests\\n\\ntarget = \\"example.com\\"\\nresponse = requests.get(target)"
}

VOICEOVER PERSONALITY RULES:
- Be direct and no-nonsense: "First we", "Now add", "This line does X"
- Drop the hype words unless genuinely warranted
- Sound like you're showing a friend something cool, not performing
- Slight edge: "This is the sketchy part", "Probably shouldn't show this but", "Most people don't know"
- Keep it real - if something is simple, say it's simple
- Build tension naturally through the progression, not forced excitement

Additional rules:
- Use real Python libraries relevant to the topic (requests, os, subprocess, selenium, beautifulsoup4, opencv, pyautogui, etc.)  
- Keep tutorials **actually beginner-friendly** - no unexplained complex concepts
- Code snippets must be **functional and executable**
- Each step should add 1-3 lines of code maximum
- All voiceover text must have **proper punctuation only**, suitable for TTS (no emojis, no ellipses)
- The hook MUST have an empty code_snippet field
- Output **JSON only**, no extra text, no explanations, no markdown  

Now generate a complete **TTS-ready, incrementally-built Python tutorial script** with a VIRAL HOOK as the first step.`;

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
                  "You are a helpful assistant that generates ONLY valid JSON. Never include markdown, explanations, or any text outside the JSON object. Ensure all strings are properly escaped. Always escape backslashes and quotes in code snippets. Use double quotes for JSON strings, not single quotes.",
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

      if (data.error) {
        throw new Error(data.error.message);
      }

      const text = data.choices[0].message.content;

      // More aggressive JSON extraction
      let clean = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      // Try to find the JSON object
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        clean = jsonMatch[0];
      }

      // Fix common JSON issues
      clean = clean
        .replace(/\\n/g, "\\n") // Fix newlines
        .replace(/\\'/g, "'") // Fix escaped single quotes
        .replace(/\\"/g, '\\"') // Ensure double quotes are properly escaped
        .replace(/[\u0000-\u0019]+/g, ""); // Remove control characters

      try {
        const parsed = JSON.parse(clean);

        // Validate the structure
        if (!parsed.tts_script || !Array.isArray(parsed.tts_script)) {
          throw new Error("Invalid structure: missing tts_script array");
        }
        if (!parsed.closer || !parsed.full_script) {
          throw new Error("Invalid structure: missing closer or full_script");
        }

        setScript(parsed);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Cleaned text:", clean);
        console.error("Raw response:", text);

        // Try one more aggressive fix - remove any trailing commas
        try {
          const fixedClean = clean.replace(/,(\s*[}\]])/g, "$1");
          const parsed = JSON.parse(fixedClean);
          console.log("Successfully parsed with trailing comma fix");
          setScript(parsed);
        } catch (secondError) {
          throw new Error(`Failed to parse response. ${parseError.message}`);
        }
      }
    } catch (err) {
      setScriptError(`Failed to generate script: ${err.message}`);
      console.error("API error:", err);
    } finally {
      setLoadingScript(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() =>
            onNavigate(selectedIdea?.isCustom ? "custom" : "generate")
          }
          className="mb-6 text-teal-600 hover:text-teal-800 font-medium transition duration-200"
        >
          ← Back
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Idea Details
          </h2>
          <p className="text-gray-600">Expand on your video concept</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Selected Idea:</h3>
          <p className="text-gray-700">{selectedIdea?.video_idea}</p>
          {selectedIdea?.tiktok_caption && (
            <p className="text-sm text-gray-600 mt-2">
              {selectedIdea.tiktok_caption}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">
              Text-to-Speech Script
            </h3>

            <button
              onClick={generateScript}
              disabled={loadingScript}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loadingScript ? "Generating Script..." : "Generate TTS Script"}
            </button>

            {scriptError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-4">
                {scriptError}
              </div>
            )}

            {script && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-4">
                    Tutorial Steps
                  </h4>
                  {script.tts_script.map((step, index) => (
                    <div key={index} className="mb-8">
                      <div className="bg-white rounded-lg p-4 mb-2 shadow-sm">
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          {index === 0
                            ? "Hook/Intro"
                            : `Step ${index} - Voiceover`}
                          :
                        </p>
                        <textarea
                          value={step.voiceover}
                          onChange={(e) =>
                            handleVoiceoverChange(index, e.target.value)
                          }
                          className="w-full text-gray-800 border-2 border-gray-200 rounded-lg p-3 focus:border-blue-400 focus:outline-none transition duration-200 resize-none"
                          rows="2"
                        />
                      </div>
                      {step.code_snippet && step.code_snippet.trim() !== "" && (
                        <CodeWindow code={step.code_snippet} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">
                    Closer:
                  </h4>
                  <textarea
                    value={script.closer}
                    onChange={(e) => handleCloserChange(e.target.value)}
                    className="w-full text-gray-800 border-2 border-gray-200 rounded-lg p-3 focus:border-purple-400 focus:outline-none transition duration-200 resize-none"
                    rows="2"
                  />
                </div>

                {/* Show All TTS Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAllTTS(!showAllTTS)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition duration-200 shadow-lg"
                  >
                    {showAllTTS
                      ? "🔼 Hide Full TTS Script"
                      : "📋 Show Full TTS Script"}
                  </button>
                </div>

                {/* All TTS Display */}
                {showAllTTS && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200 shadow-lg">
                    <h4 className="font-semibold text-indigo-900 mb-4 text-lg">
                      Complete TTS Script (Copy & Paste Ready)
                    </h4>
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
                        {getAllTTSText()}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Full Python Script:
                  </h4>
                  <CodeWindow code={script.full_script} />
                </div>
              </div>
            )}

            {!script && !loadingScript && (
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <p className="text-gray-500">
                  Click the button above to generate your video script
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
