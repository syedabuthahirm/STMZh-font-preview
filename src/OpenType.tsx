import { useEffect, useRef, useState } from "react";
import opentype from "opentype.js";
import { model, models } from "makerjs";
import outline from "./utils";

const TextToPath = ({ text = "வணக்கம் வணக்கம்", fontSize = 72, fontName = "001" }) => {
  const [pathData, setPathData] = useState("");
  const [pathOuterData, setPathOuterData] = useState("");
  const svgRef = useRef(null);
  useEffect(() => {
    // Make sure the font path is correct (public folder or import)
    opentype.load(`./fonts/st-${fontName}.TTF`, (err, font) => {
      if (err) {
        console.error("Font could not be loaded:", err);
        return;
      }
      if (font) {
        // Convert text → path
        const path = font.getPath(text, 0, fontSize, fontSize);

        // Convert to SVG path string
        const d = path.toPathData(2); // 2 = precision

        let outlined = '';

        try {
          outlined = outline(d, 6, { bezierAccuracy: 10 });
        } catch (error) {
          console.error(error);
        }

        console.log(outlined);

        setPathData(d);
        setPathOuterData(outlined);
      }
    });
  }, [text, fontSize]);

  const getSVGString = () => {
    if (!svgRef.current) return "";

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgRef.current);

    // Add XML declaration (optional but cleaner for downloads)
    return `<?xml version="1.0" standalone="no"?>\n${svgString}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getSVGString());
      alert("SVG copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDownload = () => {
    const svgString = getSVGString();
    if (!svgString) return;

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `st-${fontName}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <svg ref={svgRef} width="500" height="150" viewBox="0 0 500 150">
        <path d={pathOuterData} fill="red" />
        <path d={pathData} fill="black" />
      </svg>
      <button onClick={handleCopy}>
        Copy SVG
      </button>
      <button onClick={handleDownload} style={{ marginLeft: "10px" }}>
        Download SVG
      </button>
    </div>

  );
};

export default TextToPath;