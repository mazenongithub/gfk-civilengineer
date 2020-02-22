import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as actions from './components/actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './components/styles'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FieldReports from './components/fieldreports';
import Borings from './components/borings';
import Samples from './components/samples';
import Sieve from './components/sieve';
import Unconfined from './components/unconfined';
import { CheckUserLogin } from './components/actions/api';

class App extends Component {
  componentDidMount() {
    this.checkuser()
  }
  async checkuser() {
    try {
      let response = await CheckUserLogin();
      console.log(response)
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
          <Route exact path="/:engineerid/gfk/projects/:projectid/borings" component={Borings} />
          <Route exact path="/:engineerid/gfk/projects/:projectid/borings/:boringid/samples" component={Samples} />
          <Route exact path="/:engineerid/gfk/projects/:projectid/borings/:boringid/samples/:sampleid/sieve" component={Sieve} />
          <Route exact path="/:engineerid/gfk/projects/:projectid/borings/:boringid/samples/:sampleid/sieve" component={Unconfined} />
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
