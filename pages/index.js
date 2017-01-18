import { Component } from 'react';
import Head from 'next/head';
import { shuffle, chunk, flatten, unzip, range } from 'lodash';

function bingo() {
  const numbers = chunk(range(75).map((n) => n + 1), 15);
  const shuffled = flatten(unzip(numbers.map(shuffle).map((n) => n.slice(0, 5))));
  shuffled[12] = '★';
  return shuffled;
}

const letters = ['B', 'I', 'N', 'G', 'O'];

function Logo() {
  return (
    <p style={{ padding: 10 }}>
      <span style={{ fontSize: 12 }}>premiumbingocards.com</span>
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ n: +this.input.value });
  };

  render() {
    return (
      <div>
        <Head>
          <title>Premium Bingo Cards</title>
        </Head>
        <form onSubmit={this.handleSubmit}>
          <input
            type="number"
            ref={(ref) => this.input = ref }
            placeholder="How many copies do you need?"
          />
          <button type="submit">Go</button>
        </form>

        <button onClick={() => window.print()}>Print</button>

        {range(this.state.n).map(() => (
          <div className="container">
            {letters.map((letter) => <div className="box"><strong>{letter}</strong></div>)}
            {bingo().map((value) => <div className="box">{value}</div>)}
            {!this.props.premium && <Logo />}
          </div>
        ))}

        <style jsx>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
          }

          body {
            font-family: sans-serif;
            font-size: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 30px;
          }

          form {
            display: flex;
          }

          @media print {
            form, button, input {
              display: none;
            }
          }

          input {
            flex: 1
          }

          input, button {
            padding: 5px;
            font-size: 16px;
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
