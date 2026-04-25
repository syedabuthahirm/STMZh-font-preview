import { useEffect, useState } from 'react'
import './App.css'
import TextToPath from './OpenType';
import MakerjsDemo from './Makerjs';

function addZero(char: string) {
  if (char.length == 1) {
    return `00${char}`;
  }
  if (char.length === 2) {
    return `0${char}`;
  }

  return char;
}
const range = (start: number, stop: number, step: number) =>
  Array.from(
    { length: Math.ceil((stop - start) / step) },
    (_, i) => start + i * step,
  );

const pages = range(1, 29, 1);
function App() {
  const [word, setWord] = useState('அபுதாஹிர்');
  const [fontSize, setFontSize] = useState(60);
  const [currentPage, setCurrentPage] = useState(1);
  const [fontsToLoad, setFontsToLoad] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

  useEffect(() => {
    // @ts-ignore
    window.pramukhIME.setLanguage('tamil', 'pramukhindic');
    // @ts-ignore
    window.pramukhIME.enable();
    return function cleanup() {
      // @ts-ignore
      window.pramukhIME.disable();
    }
  }, []);

  const onchange = (e: any) => {
    console.log(setWord(e.target.value));
  };

  const onSizeChange = (e: any) => {
    console.log(e.target.value);
    setFontSize(e.target.value)
  }
  // @ts-ignore
  const convertedWord = window.startTextS(word);
  console.log(convertedWord, 'convertedWord');

  return (
    <>
      <div>
        <label>Font Size</label>
        <input type="range" onChange={onSizeChange} value={fontSize} min={10} max={120} />
      </div>
      <div>
        <label>Text</label>
        <input type='text' value={word} onChange={onchange} />
      </div>
      {/* <MakerjsDemo text={convertedWord} fontName="Coiny-Regular.ttf" /> */}
      {/* <MakerjsDemo text={convertedWord} fontSize={fontSize} fontName="st-002.TTF" /> */}
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        {fontsToLoad.map((fontIndex) => {
          const fontName = `STMZh${addZero(fontIndex.toString())}-font`;
          return (
            <div key={fontName} style={{ border: '1px solid red' }}>
              <p>fontname: {fontName.split('-')[0]}</p>
              <TextToPath text={convertedWord} fontName={addZero(fontIndex.toString())} fontSize={fontSize} />
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        {fontsToLoad.map((fontIndex) => {
          const fontName = `STMZh${addZero(fontIndex.toString())}-font`;
          return (
            <div key={fontName} style={{ border: '1px solid red' }}>
              <p>fontname: {fontName.split('-')[0]}</p>
              <p className={`font ${fontName}`} style={{ fontSize: `${fontSize}px`, lineHeight: `${fontSize}px`, }}>{convertedWord}</p>
            </div>
          )
        })}
      </div>
      <footer style={{ margin: '2rem 0' }}>
        {pages.map((page) => {
          return (
            <button key={page} style={{ background: currentPage === page ? 'blue' : 'inherit' }}
              onClick={() => {
                setCurrentPage(page);
                const f = page === 28 ? range(1, 6, 1) : range(1, 11, 1);
                setFontsToLoad(prev => f.map(p => (p + (page * 10)).toString()));
              }}>
              {page}
            </button>
          )
        })}
      </footer>
    </>
  )
}

export default App
