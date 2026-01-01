// src/utils/syntaxHighlight.js

export const BREEZE_COLORS = {
    background: "#1e1e1e",
    foreground: "#FFFFFF",
    keyword: "#6599FF",
    function: "#F8518D",
    string: "#E9AEFE",
    number: "#55E7B2",
    comment: "#8A757D",
    punctuation: "#F8518D",
    property: "#49E8F2",
    constant: "#49E8F2",
};

export const highlightPython = (code) => {
    if (!code) return [];

    const tokens = [];
    const regex =
        /(".*?"|'.*?'|#.*$|\b(def|class|return|import|from|if|else|elif|while|for|in|try|except|print|True|False|None|and|or|not|as|with|await|async)\b|\b\d+\b|\b[a-zA-Z_][a-zA-Z0-9_]*\b|[(){}\[\]:,.=<>!+\-*/%&|^~])/gm;

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(code)) !== null) {
        if (match.index > lastIndex) {
            tokens.push({ type: "text", value: code.slice(lastIndex, match.index) });
        }

        const value = match[0];
        let type = "text";

        if (value.startsWith("#")) type = "comment";
        else if (value.startsWith('"') || value.startsWith("'")) type = "string";
        else if (/^\d+$/.test(value)) type = "number";
        else if (match[2]) type = "keyword";
        else if (/[(){}\[\]:,.=<>!+\-*/%&|^~]/.test(value)) type = "punctuation";
        else if (/^[a-zA-Z_]/.test(value)) {
            if (code[regex.lastIndex] === "(") type = "function";
            else if (/^[A-Z]/.test(value)) type = "constant";
            else type = "foreground";
        }

        tokens.push({ type, value });
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < code.length) {
        tokens.push({ type: "text", value: code.slice(lastIndex) });
    }

    return tokens;
};