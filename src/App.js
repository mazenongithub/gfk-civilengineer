import React, { Component } from 'react';
import './App.css';
import * as actions from './components/actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './components/styles'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FieldReports from './components/fieldreports';
import Borings from './components/borings';
import Profile from './components/profile';
import Samples from './components/samples';
import Sieve from './components/sieve';
import Unconfined from './components/unconfined';
import Login from './components/login';
import Timesheet from './components/timesheet'
import { CheckUserLogin } from './components/actions/api'
import Projects from './components/projects';
import ViewProject from './components/viewproject';
import ViewFieldReport from './components/viewfieldreport';
import LogDraft from './components/logdraft'
import LabSummary from './components/labsummary';
import PTSlab from './components/ptslab';
import Seismic from './components/seismic'
class App extends Component {

  constructor(props) {
    super(props);
    this.state = { render: '', width: 0, height: 0 }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
}
componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();
    this.checkuser()
}

componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
}

updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
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
    const profile = new Profile();

    const showprofile = () => {
      return(profile.showprofile.call(this))
    }
   

    return (<BrowserRouter>
      <div style={{ ...styles.generalContainer }}>
        <Switch>
          <Route exact path="/" render={showprofile} />
          <Route exact path="/engineer/login" component={Login} />
          <Route exact path="/:engineerid" render={showprofile} />
          <Route exact path="/:engineerid/projects" component={Projects} />
          <Route exact path="/:engineerid/projects/:projectid" component={ViewProject} />
          <Route exact path="/:engineerid/projects/:projectid/fieldreports" component={FieldReports} />
          <Route exact path="/:engineerid/projects/:projectid/fieldreports/:fieldid" component={ViewFieldReport} />
          <Route exact path="/:engineerid/projects/:projectid/timesheet" component={Timesheet} />
          <Route exact path="/:engineerid/projects/:projectid/borings" component={Borings} />
          <Route exact path="/:engineerid/projects/:projectid/labsummary" component={LabSummary} />
          <Route exact path="/:engineerid/projects/:projectid/ptslab" component={PTSlab} />
          <Route exact path="/:engineerid/projects/:projectid/seismic" component={Seismic} />
          <Route exact path="/:engineerid/projects/:projectid/borings/:boringid/logdraft" component={LogDraft} />
          <Route exact path="/:engineerid/projects/:projectid/borings/:boringid/samples" component={Samples} />
          <Route exact path="/:engineerid/projects/:projectid/borings/:boringid/samples/:sampleid/sieve" component={Sieve} />
          <Route exact path="/:engineerid/projects/:projectid/borings/:boringid/samples/:sampleid/unconfined" component={Unconfined} />
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
