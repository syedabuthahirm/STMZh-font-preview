import * as makerjs from 'makerjs';
import opentype from 'opentype.js';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  text: string;
  fontName: string;
  fontSize: number;
}


function MakerjsDemo({ text, fontName, fontSize }: Props) {
  const [font, setFont] = useState<null | opentype.Font>(null);

  useEffect(() => {
    // Make sure the font path is correct (public folder or import)
    opentype.load(`./fonts/${fontName}`, (err, font) => {
      if (err) {
        console.error("Font could not be loaded:", err);
        return;
      }
      if (font) {
        setFont(font);
      }
    });
  }, [fontName]);

  const textModel = useMemo(() => {
    if (font) {
      return new makerjs.models.Text(font, text, fontSize, true);
    }
    return new makerjs.models.Oval(20, 10);
  }, [font, fontSize]);

  let svg: string = '';
  if (font) {
    const combinemodel = {
      models: {
        word: makerjs.model.simplify(textModel)
      }
    }
    // makerjs.exporter.toSVG(makerjs.model.expandPaths(makerjs.model.simplify(textModel), 8, 0));
    // const model = new makerjs.models.Text(font, text, 12, true); //new makerjs.models.Star(7, 100, 50);
    svg = makerjs.exporter.toSVG(combinemodel);
  }

  const getSVGString = () => {
    // Add XML declaration (optional but cleaner for downloads)
    return `<?xml version="1.0" standalone="no"?>\n${svg}`;
  };

  const handleDownload = () => {
    const svgString = getSVGString();
    if (!svgString) return;

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "text.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const onclick = () => handleDownload();

  return (
    <div>
      <h1>as</h1>
      <div dangerouslySetInnerHTML={{ __html: svg }}>
      </div>
      <button onClick={onclick}>
        download
      </button>
    </div>
  )
}

export default MakerjsDemo;