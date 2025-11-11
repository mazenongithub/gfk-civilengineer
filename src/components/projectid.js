import React from 'react';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { goToIcon } from './svg';

class ProjectID {
    findProjectByCity() {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        const { searchcity } = this.state;

        if (!Array.isArray(projects) || !searchcity) return [];

        const cityQuery = searchcity.toLowerCase();

        const filteredProjects = projects
            .filter(project => project.projectcity?.toLowerCase().includes(cityQuery))
            .sort((a, b) => Number(b.projectnumber) - Number(a.projectnumber));

        return filteredProjects;
    }

    findProjectByNumber() {
        const gfk = new GFK();
        const projects = gfk.getProjects.call(this);
        const { searchprojectnumber } = this.state;

        if (!Array.isArray(projects) || !searchprojectnumber) return [];

        const query = searchprojectnumber.toString().toLowerCase();

        const filteredProjects = projects
            .filter(project => project.projectnumber?.toString().toLowerCase().includes(query))
            .sort((a, b) => Number(b.projectnumber) - Number(a.projectnumber));

        return filteredProjects;
    }

    showactiveproject() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const engineerid = this.props.match.params.engineerid;
        const headerFont = gfk.getHeaderFont.call(this)
        const goIconWidth = gfk.getgotoicon.call(this)
        if (this.state.activeprojectid) {
            const myproject = gfk.getProjectById.call(this, this.state.activeprojectid)

            return (
                <div style={{ ...styles.generalContainer }}>
                    <div style={{ ...styles.activefieldreport, ...styles.bottomMargin15, }} onClick={() => { this.makeprojectactive(myproject.projectid) }}>
                        <span style={{ ...regularFont, ...styles.generalFont }} >Project Number {myproject.projectnumber} {myproject.title} {myproject.projectaddress} {myproject.projectcity} </span>
                    </div>
                    <div style={{ ...styles.generalContainer }}>
                        <Link style={{ ...styles.generalFont, ...headerFont, ...styles.generalLink }}
                            to={`/${engineerid}/projects/${this.state.activeprojectid}`}>
                            <button style={{ ...styles.generalButton, ...goIconWidth }}>
                                {goToIcon()}
                            </button>
                            <span style={{ ...styles.generalFont, ...regularFont }}>Go to Project</span>
                        </Link>
                    </div>

                </div>)
        }
    }
    showSearchProjectId(myproject) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        return (<div style={{ ...regularFont, ...styles.generalFont, ...styles.bottomMargin15 }} onClick={() => { this.makeprojectactive(myproject.projectid) }}>
            Project Number {myproject.projectnumber} {myproject.title} {myproject.projectaddress} {myproject.projectcity}
        </div>)

    }
   showSearchResults() {
  const projectHelper = new ProjectID();
  const { searchprojectnumber, searchcity } = this.state;

  // Determine which search function to use
  let projects = [];
  if (searchprojectnumber) {
    projects = projectHelper.findProjectByNumber.call(this, searchprojectnumber);
  } else if (searchcity) {
    projects = projectHelper.findProjectByCity.call(this, searchcity);
  }

  if (!Array.isArray(projects) || projects.length === 0) return [];

  // Generate search result elements
  return projects.map(project =>
    projectHelper.showSearchProjectId.call(this, project)
  );
}


    showprojectid() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        const projectid = new ProjectID();

        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                            Project ID
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                            Search By Project Number <br />
                            <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                value={this.state.searchprojectnumber}
                                onChange={event => { this.setState({ searchprojectnumber: event.target.value }) }}
                            />
                        </div>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                            Search By City <br />
                            <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                value={this.state.searchcity}
                                onChange={event => { this.setState({ searchcity: event.target.value }) }}
                            />
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont, ...styles.minHeight }}>
                            {projectid.showactiveproject.call(this)}
                        </div>
                    </div>

                    {projectid.showSearchResults.call(this)}

                </div>
            </div>
        )
    }
}
export default ProjectID;