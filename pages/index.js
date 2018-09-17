import { Component } from 'react';
import Head from 'next/head';
import { shuffle, chunk, flatten, unzip, range } from 'lodash';

function bingo() {
  const numbers = chunk(range(75).map(n => n + 1), 15);
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

export default class extends Component {
  state = {
    n: 1
  };

  static async getInitialProps({ query }) {
    return {
      premium: query.premium !== undefined
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ n: Math.max(1, +this.input.value) }, () => window.print());
  };

  render() {
    return (
      <div>
        <Head>
          <title>Premium Bingo Cards</title>
          <meta
            name="description"
            content="Bingo card generator with a slight premium feel."
          />
          <meta name="keywords" content="bingo, cards, generator" />
        </Head>
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

        <style jsx>{`
          :global(*) {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
          }

          :global(body) {
            font-family: system-ui, sans-serif;
            font-size: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 30px;
          }

          :global(form) {
            display: flex;
          }

          @media print {
            form,
            button,
            h1,
            input {
              display: none;
            }
          }

          input {
            padding: 10px;
            font-size: 20px;
            flex: 1;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          button {
            padding: 5px 10px;
            font-size: 20px;
            border: 0;
            cursor: pointer;
            color: #ff2d55;
          }

          .container {
            display: flex;
            flex-direction: row;
            width: 500px;
            flex-wrap: wrap;
            margin-top: 100px;
            page-break-after: always;
          }

          strong {
            font-size: 40px;
          }

          .box {
            display: flex;
            flex: 0 0 20%;
            align-items: center;
            justify-content: center;
            height: 100px;
            border: 1px solid #ddd;
          }
        `}</style>
      </div>
    );
  }
}
