import React, { Component } from 'react';
import Header from './componentes/Header';
import Timeline from './componentes/Timeline';
import './css/reset.css'
import './css/timeline.css'
import TimelineStore from './stores/TimelineStore';

class App extends Component {
  constructor(){
    super();
    this.timelineStore = new TimelineStore([]);
  }

  render() {
    return (
    <div id="root">
      <div className="main">
        <Header/>
        <Timeline login={this.props.params.login} timelineStore={this.timelineStore}/>
      </div>
    </div>
    );
  }
}

export default App;