import { useEffect, useRef, useState, type Ref } from "react";
import opentype from "opentype.js";
import outline from "./utils";

const TextToPath = ({ text = "வணக்கம் வணக்கம்", fontSize = 72, fontName = "001" }) => {
  const [pathData, setPathData] = useState("");
  const [pathOuterData, setPathOuterData] = useState("");
  const svgRef = useRef(null);
  const svgOuterRef = useRef(null);
  const svgFullRef = useRef(null);
  const [bezierAccuracy, setBezierAccuracy] = useState(0.50);
  const [outerLength, setOuterLength] = useState(5);

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
          outlined = outline(d, outerLength, { bezierAccuracy: bezierAccuracy });
        } catch (error) {
          console.error(error);
        }

        setPathData(d);
        setPathOuterData(outlined);
      }
    });
  }, [text, fontSize, bezierAccuracy, outerLength]);

  const getSVGString = (ref: any) => {
    if (!ref.current) return "";

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(ref.current);

    // Add XML declaration (optional but cleaner for downloads)
    return `<?xml version="1.0" standalone="no"?>\n${svgString}`;
  };

  const handleOuterDownload = () => {
    const svgString = getSVGString(svgOuterRef);
    if (!svgString) return;

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `st-${fontName}-font-${text}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleTextDownload = () => {
    const svgString = getSVGString(svgRef);
    if (!svgString) return;

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `st-${fontName}-text-${text}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleFullDownload = () => {
    const svgString = getSVGString(svgFullRef);
    if (!svgString) return;

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `st-${fontName}-full-${text}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div>
        <label>Bezier Accuracy</label>
        <input type="range" min="0" max="1" step="0.1" value={bezierAccuracy} onChange={(e) => setBezierAccuracy(e.target.valueAsNumber)} />
      </div>
      <div>
        <label>Outer Width</label>
        <input type="range" min="1" max="20" step="1" value={outerLength} onChange={(e) => setOuterLength(e.target.valueAsNumber)} />
      </div>
      <div style={{ display: 'flex' }}>
        <svg ref={svgOuterRef} width="500" height="150" viewBox="0 0 500 150">
          <path d={pathOuterData} fill="red" />
        </svg>
        <svg ref={svgRef} width="500" height="150" viewBox="0 0 500 150">
          <path d={pathData} fill="black" />
        </svg>
        <svg ref={svgFullRef} width="500" height="150" viewBox="0 0 500 150">
          <path d={pathOuterData} fill="yellow" />
          <path d={pathData} fill="red" />
        </svg>
      </div>
      <button onClick={handleTextDownload} style={{ marginLeft: "10px" }}>
        Download Text SVG
      </button>
      <button onClick={handleOuterDownload} style={{ marginLeft: "10px" }}>
        Download Outer SVG
      </button>
      <button onClick={handleFullDownload} style={{ marginLeft: "10px" }}>
        Download Full SVG
      </button>
    </div>

  );
};

export default TextToPath;