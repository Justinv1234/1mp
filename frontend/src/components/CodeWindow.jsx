// src/components/CodeWindow.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import { BREEZE_COLORS, highlightPython } from "../utils/syntaxHighlight";

const CodeWindow = ({ code }) => {
  const [highlightedTokens, setHighlightedTokens] = useState([]);
  const [lines, setLines] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const tokens = highlightPython(code);
    setHighlightedTokens(tokens);
    setLines(code.split("\n"));
  }, [code]);

  const handleDownload = useCallback(async () => {
    if (ref.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "ray-so-export.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  }, [ref]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-2xl">
        {/* Download button OUTSIDE the screenshot area */}
        <button
          onClick={handleDownload}
          className="absolute -top-10 right-0 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm font-medium"
          title="Export as PNG"
        >
          <Download className="w-4 h-4" />
          <span>Download PNG</span>
        </button>

        {/* Screenshot area */}
        <div ref={ref} className="p-4 w-full bg-transparent">
          <div
            className="rounded-xl overflow-hidden shadow-2xl border border-gray-700/50"
            style={{ backgroundColor: "#0e1016" }}
          >
            <div className="px-4 py-3 flex items-center justify-between bg-white/5 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
            </div>

            <div className="p-4 overflow-x-auto bg-[#1e1e1e]">
              <div className="flex font-mono text-sm leading-6">
                <div className="flex flex-col text-right pr-4 select-none text-gray-600 border-r border-gray-700/50 mr-4">
                  {lines.map((_, i) => (
                    <span key={i} className="h-6">
                      {i + 1}
                    </span>
                  ))}
                </div>

                <div className="flex-1 whitespace-pre">
                  {highlightedTokens.map((token, i) => (
                    <span
                      key={i}
                      style={{
                        color:
                          BREEZE_COLORS[token.type] || BREEZE_COLORS.foreground,
                      }}
                    >
                      {token.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeWindow;
