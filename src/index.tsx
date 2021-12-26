import './index.css';

import * as React from 'react';

import { chunk, flatten, range, shuffle, unzip } from 'lodash';

import { render } from 'react-dom';

function bingo() {
  const numbers = chunk(
    range(75).map((n) => `${n + 1}`),
    15
  );
  const shuffled = flatten(
    unzip(numbers.map((n) => shuffle(n)).map((n) => n.slice(0, 5)))
  );
  shuffled[12] = '★';
  return shuffled;
}

const letters = ['B', 'I', 'N', 'G', 'O'];

function Logo() {
  return (
    <p style={{ padding: 10 }}>
      <span style={{ fontSize: 18, letterSpacing: 1, color: '#aaa' }}>
        premiumbingocards.com
      </span>
    </p>
  );
}

function useBingos(n: number) {
  return React.useMemo(() => {
    return range(n).map(() => bingo());
  }, [n]);
}

function Bingo({ premium }: { premium: boolean }) {
  const [n, setN] = React.useState(1);
  const inputRef = React.useRef<HTMLInputElement>();
  const bingos = useBingos(n);

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    setN(Math.max(1, +inputRef.current.value));
    requestAnimationFrame(() => window.print());
  };

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
              <div className="box" key={letter}>
                <strong>{letter}</strong>
              </div>
            ))}
            {bingo.map((value) => (
              <div className="box" key={value}>
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

render(<Bingo premium={false} />, document.getElementById('root'));
