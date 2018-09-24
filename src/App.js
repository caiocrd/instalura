import React, { Component } from 'react';
import Header from './componentes/Header';
import Timeline from './componentes/Timeline';
import './css/reset.css';
import './css/timeline.css';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import TimelineApi from './stores/TimelineApi';
import { timeline } from './reducers/timeline';
import { notifica } from './reducers/header';

const reducers = combineReducers({timeline, notifica})
const store = createStore(reducers, applyMiddleware(thunkMiddleware));

class App extends Component {

  render() {
    return (
    <div id="root">
      <div className="main">
        <Header store={store}/>
        <Timeline login={this.props.params.login}  store={store}/>
      </div>
    </div>
    );
  }
}

export default App;