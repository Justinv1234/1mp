// src/components/CodeWindow.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Check } from "lucide-react";
import { toPng } from "html-to-image";
import { BREEZE_COLORS, highlightPython } from "../utils/syntaxHighlight";

const CodeWindow = ({ code }) => {
  const [highlightedTokens, setHighlightedTokens] = useState([]);
  const [lines, setLines] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const tokens = highlightPython(code);
    setHighlightedTokens(tokens);
    setLines(code.split("\n"));
  }, [code]);

  const handleDownload = useCallback(async () => {
    if (ref.current === null) return;

    try {
      setIsDownloading(true);

      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "transparent",
        filter: (node) => {
          // Exclude the download button from the screenshot
          if (node.classList && node.classList.contains("export-exclude")) {
            return false;
          }
          return true;
        },
      });

      const link = document.createElement("a");
      link.download = "1minutepython-export.png";
      link.href = dataUrl;
      link.click();

      setTimeout(() => setIsDownloading(false), 2000);
    } catch (err) {
      console.error("Failed to generate image", err);
      setIsDownloading(false);
    }
  }, [ref]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-fit max-w-full min-w-75">
        <div ref={ref} className="bg-transparent">
          <div
            className="rounded-xl overflow-hidden shadow-2xl border border-white/10"
            style={{ backgroundColor: "#0e1016" }}
          >
            {/* Header / Title Bar */}
            <div className="px-4 py-3 flex items-center justify-between bg-white/5 border-b border-white/5">
              {/* Traffic Lights */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>

              {/* Download Button (Excluded from screenshot) */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="export-exclude group flex items-center gap-2 text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                title="Download PNG"
              >
                <span className="text-[10px] font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                  {isDownloading ? "Saved" : "Save Image"}
                </span>
                {isDownloading ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Code Area */}
            <div className="p-4 overflow-x-auto bg-[#0e1016]">
              <div className="flex font-mono text-sm leading-6">
                {/* Line Numbers */}
                <div className="flex flex-col text-right pr-4 select-none text-gray-600 border-r border-white/10 mr-4">
                  {lines.map((_, i) => (
                    <span key={i} className="h-6">
                      {i + 1}
                    </span>
                  ))}
                </div>

                {/* Code Content */}
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
