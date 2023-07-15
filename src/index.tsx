import './index.css';

import * as React from 'react';

import { createRoot } from 'react-dom/client';

import { chunk, flatten, range, shuffle, unzip, zip } from 'lodash';

function bingo(rows: number, cols: number) {
  const values = range(rows * cols * 3).map((n) => `${n + 1}`);
  const chunks = chunk(values, Math.ceil(values.length / rows));
  const shuffled = flatten(
    unzip(chunks.map((n) => shuffle(n)).map((n) => n.slice(0, cols))),
  );
  shuffled[Math.floor((rows * cols) / 2)] = '★';
  return shuffled;
}

function useBingos(n: number, rows: number, cols: number) {
  return React.useMemo(() => {
    return range(n).map(() => bingo(rows, cols));
  }, [n, rows, cols]);
}

interface BingoProps {
  premium: boolean;
  cols?: number;
  rows?: number;
}

function Bingo({ premium, rows = 5, cols = 5 }: BingoProps) {
  const [n, setN] = React.useState(1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const bingos = useBingos(n, rows, cols);

  const letters = zip(
    ['B', 'I', 'N', 'G', 'O'].slice(0, cols),
    range(cols),
  ).map(([a]) => a ?? '');

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    setN(Math.max(1, +inputRef.current!.value));
    requestAnimationFrame(() => window.print());
  };

  const flexBasis = `${100 / Math.max(1, cols)}%`;

  return (
    <div>
      <header>
        <h1>Premium Bingo Cards</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            required
            min={1}
            ref={inputRef}
            placeholder="How many copies do you need?"
            autoFocus
          />
          <button type="submit">Print Cards</button>
        </form>
      </header>

      {bingos.map((bingo, i) => (
        <div className="page" key={i}>
          <div className="container" key={i}>
            {letters.map((letter) => (
              <div className="box" key={letter} style={{ flexBasis }}>
                <strong>{letter}</strong>
              </div>
            ))}
            {bingo.map((value) => (
              <div className="box" key={value} style={{ flexBasis }}>
                {value}
              </div>
            ))}
          </div>
          {!premium && <Logo />}
        </div>
      ))}
    </div>
  );
}

function Logo() {
  return (
    <p style={{ padding: 10 }}>
      <span style={{ fontSize: 18, letterSpacing: 1, color: '#aaa' }}>
        premiumbingocards.com
      </span>
    </p>
  );
}

createRoot(document.getElementById('root')!).render(<Bingo premium={false} />);
