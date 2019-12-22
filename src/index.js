import React, { Component } from 'react';
import { render } from 'react-dom';
import { shuffle, chunk, flatten, unzip, range } from 'lodash';
import './index.css';

function bingo() {
  const numbers = chunk(
    range(75).map(n => n + 1),
    15
  );
  const shuffled = flatten(unzip(numbers.map(shuffle).map(n => n.slice(0, 5))));
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

class Bingo extends Component {
  state = {
    n: 1
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ n: Math.max(1, +this.input.value) }, () => window.print());
  };

  render() {
    return (
      <div>
        <h1 style={{ margin: '10px 0' }}>Premium Bingo Cards</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="number"
            min={1}
            ref={ref => (this.input = ref)}
            placeholder="How many copies do you need?"
          />
          <button type="submit">Print Cards</button>
        </form>

        {range(this.state.n).map(i => (
          <div className="container" key={i}>
            {letters.map(letter => (
              <div className="box" key={letter}>
                <strong>{letter}</strong>
              </div>
            ))}
            {bingo().map(value => (
              <div className="box" key={value}>
                {value}
              </div>
            ))}
            {!this.props.premium && <Logo />}
          </div>
        ))}
      </div>
    );
  }
}

render(<Bingo />, document.getElementById('root'));
