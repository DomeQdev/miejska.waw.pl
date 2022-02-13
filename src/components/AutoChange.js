import { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super();
    this.time = props.timeout;
    this.text = props.text;
    this.state = { textIdx: 0 };
  }

  componentDidMount() {
    this.timeout = setInterval(() => {
      let currentIdx = this.state.textIdx;
      this.setState({ textIdx: currentIdx + 1 });
    }, this.time);
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  render() {
    let textThatChanges = this.text[this.state.textIdx % this.text.length];

    return (typeof textThatChanges === "object" ? `Odjazd ${minutesUntil(textThatChanges)}` : textThatChanges)
  }
}

export default Home;

function minutesUntil(timestamp) {
  var now = new Date();
  var then = convertTimestampToUTC(timestamp);
  var diff = then.getTime() - now.getTime();
  var minutes = Math.floor(diff / 1000 / 60);
  if (minutes === 0) return "";
  if (minutes < 0) return `opóźniony o ${Math.abs(minutes)} min`;
  return `za ${minutes} min`;
}

function convertTimestampToUTC(timestamp) {
  let date = new Date(timestamp);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}