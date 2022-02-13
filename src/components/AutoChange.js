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

    return (textThatChanges)
  }
}

export default Home;