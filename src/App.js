import React, { Component } from 'react';
import './App.css';
import './components/landing.css'
import * as actions from './components/actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './components/styles'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Profile from './components/profile';
import Login from './components/login';
import { CheckUser, LogoutUser } from './components/actions/api'
import Projects from './components/projects';
import ViewProject from './components/viewproject';
import GFK from './components/gfk'
import { Link } from 'react-router-dom';
import Landing from './components/landing';
import Clients from './components/clients';
import Company from './components/company'
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Features from './components/features';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = { render: '', width: 0, height: 0, open: false }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateWindowDimensions();
    this.checkUser()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  projectsLink() {
    const gfk = new GFK();
    const user = gfk.getUser.call(this);

    return user && user._id ? (
      <Link onClick={() => { this.closeMenu() }} to={`/${user.engineerid}/projects`}>Projects</Link>
    ) : (
      <Link onClick={() => { this.closeMenu() }} to={`/contact`}>Contact</Link>
    );
  }

  profileLink() {
    const gfk = new GFK();
    const user = gfk.getUser.call(this);

    return user && user._id ? (
      <Link onClick={() => { this.closeMenu() }} to={`/${user.engineerid}/profile`}>Profile</Link>
    ) : (
      <span>&nbsp;</span>
    );
  }

  companyLink() {

    const gfk = new GFK();
    const user = gfk.getUser.call(this);

    return user && user._id ? (
      <Link onClick={() => { this.closeMenu() }} to={`/gfk`}>Company</Link>
    ) : (
      <Link onClick={() => { this.closeMenu() }} to={`/features`}>Features</Link>
    );

  }



  loginLink() {
    const gfk = new GFK();
    const user = gfk.getUser.call(this);

    return user && user._id ? (
      <a onClick={() => this.logout()}>Logout</a>
    ) : (
      <Link onClick={() => { this.closeMenu() }} to="/access/login">Login</Link>
    );
  }


  async logout() {
    try {
      const gfk = new GFK();
      const user = gfk.getUser.call(this);

      if (!user || !user.engineerid) return;

      try {
        const response = await LogoutUser(user.engineerid);

        if (response?.message) {
          // Clear Redux user state
          this.props.reduxUser(null);
          this.props.reduxCompany(null)
          this.props.reduxProjects(null)  // You probably want to reset user, not set message
          this.setState({ message: response.message });

          // Optionally show success message

        }
      } catch (err) {
        alert(err.errorMessage || err.message || String(err));
      }
    } catch (err) {
      console.error("Unexpected logout error:", err);
    }
  }






  openMenu() {
    this.setState({ open: true });
  }

  closeMenu() {
    this.setState({ open: false });
  };

  async checkUser() {
    try {
      const response = await CheckUser();
      console.log(response)
      // Update engineer
      if (response?.engineer) {
        this.props.reduxUser(response.engineer);
      } else {
        console.warn("⚠️ No engineer returned.");
      }

      if (response?.gfk) {
        this.props.reduxCompany(response.gfk)
      }

      // Update projects
      if (Array.isArray(response?.projects) && response.projects.length > 0) {
        this.props.reduxProjects(response.projects);
      } else {
        console.warn("⚠️ No projects found for this engineer.");
      }

      // Trigger render update
      this.setState({ render: 'render' });

    } catch (err) {
      console.error("❌ Error checking user:", err);
      alert(
        typeof err === "string"
          ? err
          : err.message || "Failed to verify user."
      );
    }
  }

  homeLink() {
    return (<Link onClick={() => { this.closeMenu() }} to={`/`}>Home</Link>)
  }

  showApp() {
    const styles = MyStylesheet()
    const { open } = this.state;
    return (

      <div style={{ ...styles.generalContainer }}>

        <div style={{ ...styles.generalContainer }}>
          <nav style={{ ...styles.navColor }} className="navbar">
            <div className="nav-logo">https://gfk.civilengineer.io</div>

            {/* Desktop Links */}
            <div style={{ ...styles.mobileColor }} className="nav-links">
              {this.homeLink()}
              {this.companyLink()}
              {this.projectsLink()}
              {this.profileLink()}
              {this.loginLink()}
            </div>

            {/* Hamburger */}
            <button className="nav-hamburger" onClick={() => { this.openMenu() }}>
              <span style={{ ...styles.mobileColor }}>☰ </span>
            </button>
          </nav>

          {/* Overlay */}
          {open && <div className="overlay" onClick={() => { this.closeMenu() }}></div>}

          {/* Mobile Drawer */}
          <div className={`mobile-menu ${open ? "open" : ""}`}>
            <button className="close-btn" onClick={() => { this.closeMenu() }}>×</button>

            {this.homeLink()}
            {this.companyLink()}
            {this.projectsLink()}
            {this.profileLink()}
            {this.loginLink()}
          </div>

        </div>


      </div>)

  }


  render() {
    const styles = MyStylesheet();
    const profile = new Profile();
    const gfk = new GFK();
    const regularFont = gfk.getRegularFont.call(this)

    const showprofile = () => {
      return (profile.showprofile.call(this))
    }


    return (

      <div style={{ ...styles.generalContainer }}>
        {/* Landing Page Content */}
        <div className="landing-content">
          <BrowserRouter>
            <HelmetProvider>
              {this.showApp()}
              <div style={{ ...styles.generalContainer }}>
                <Helmet>
                    {/* Base title (can be overridden per page) */}
                    <title>Geotechnical Engineering Software | Reports, Logs, & Analysis | CivilEngineer.io</title>

                    {/* Default meta description */}
                    <meta
                        name="description"
                        content="Comprehensive geotechnical engineering software for California projects. Manage borings, lab data, soil logs, analysis, and professional reports online—secure, fast, and built by licensed engineers."
                    />
                    {/* Canonical (base) */}
                    <link rel="canonical" href="https://gfk.civilengineer.io/" />

                    {/* Open Graph */}
                    <meta property="og:site_name" content="https://gfk.civilengineer.io" />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="Geotechnical Engineering Software | Reports, Logs, & Analysis | CivilEngineer.io" />
                    <meta
                        property="og:description"
                        content="Comprehensive geotechnical engineering software for California projects. Manage borings, lab data, soil logs, analysis, and professional reports online—secure, fast, and built by licensed engineers."
                    />
                    <meta property="og:url" content="https://gfk.civilengineer.io/" />

                </Helmet>
                <Switch>
                  <Route exact path="/" component={Landing} />
                  <Route exact path="/gfk" component={Company} />
                  <Route exact path="/features" component={Features} />
                  <Route exact path="/access/login" component={Login} />
                  <Route exact path="/gfk/clients" component={Clients} />
                  <Route exact path="/:engineerid/profile" render={showprofile} />
                  <Route exact path="/:engineerid/projects" component={Projects} />
                  <Route path="/:engineerid/projects/:projectid" component={ViewProject} />
                </Switch>
              </div>
            </HelmetProvider>
          </BrowserRouter>
        </div>





      </div>);
  }

}

function mapStateToProps(state) {
  return {
    myuser: state.myuser,
    projects: state.projects,
    company: state.company
  }
}

export default connect(mapStateToProps, actions)(App);
