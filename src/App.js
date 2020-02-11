import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as actions from './components/actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './components/styles'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FieldReports from './components/fieldreports';
import { CheckUserLogin } from './components/actions/api';

class App extends Component {
  componentDidMount() {
    this.checkuser()
  }
  async checkuser() {
    try {
      let response = await CheckUserLogin();
      if (response.hasOwnProperty("engineerid")) {
        this.props.reduxUser(response)
      }
    } catch (err) {
      alert(err)
    }
  }
  render() {
    const styles = MyStylesheet();
    const defaultComponent = () => {
      return (<div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
        </a>
        </header>
      </div>)

    }

    return (<BrowserRouter>
      <div style={{ ...styles.generalContainer }}>
        <Switch>
          <Route exact path="/" component={defaultComponent} />
          <Route exact path="/:engineerid/gfk/projects/:projectid/fieldreports" component={FieldReports} />
        </Switch>
      </div>
    </BrowserRouter>);
  }

}

function mapStateToProps(state) {
  return {
    myuser: state.myuser
  }
}

export default connect(mapStateToProps, actions)(App);
