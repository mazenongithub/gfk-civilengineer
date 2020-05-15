import React from 'react';
import { MyStylesheet } from './styles'
import GFK from './gfk';
class ProjectID {
    findprojectbycity() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let projects = [];
        if (myuser.hasOwnProperty("projects")) {
            // eslint-disable-next-line
            myuser.projects.project.map(project => {
                if (project.city.toLowerCase().startsWith(this.state.searchcity.toLowerCase())) {
                    projects.push(project)
                }
            })

            if (projects.length > 0) {
               projects.sort((a, b) => {

                    if (Number(a.projectnumber) > Number(b.projectnumber)) {
                        return -1;
                    } else {
                        return 1;
                    }

                })
            }
        }
        return projects;
    }
    findprojectsbynumber(projectnumber) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        let projects = [];
        if (myuser.hasOwnProperty("projects")) {
            // eslint-disable-next-line
            myuser.projects.project.map(project => {
                if (project.projectnumber.startsWith(projectnumber)) {
                    projects.push(project)
                }
            })

            if (projects.length > 0) {

                projects.sort((a, b) => {

                    if (Number(a.projectnumber) > Number(b.projectnumber)) {
                        return -1;
                    } else {
                        return 1;
                    }

                })
            }
        }

        return projects


    }
    showactiveproject() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        if(this.state.activeprojectid) {
            const myproject = gfk.getprojectbyid.call(this,this.state.activeprojectid)
         
        return (<div style={{ ...regularFont, ...styles.generalFont, ...styles.bottomMargin15, ...styles.activefieldreport }} onClick={()=>{this.makeprojectactive(myproject.projectid)}}>
            Project Number {myproject.projectnumber} {myproject.title} {myproject.address} {myproject.city}
        </div>)
        }
    }
    showsearchprojectid(myproject) {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)
        return (<div style={{ ...regularFont, ...styles.generalFont, ...styles.bottomMargin15 }} onClick={()=>{this.makeprojectactive(myproject.projectid)}}>
            Project Number {myproject.projectnumber} {myproject.title} {myproject.address} {myproject.city}
        </div>)

    }
    showsearchresults() {
        const projectid = new ProjectID();
        let projects = false;
        let results = [];
        if (this.state.searchprojectnumber) {
            projects = projectid.findprojectsbynumber.call(this, this.state.searchprojectnumber)
        } else if (this.state.searchcity) {
            projects = projectid.findprojectbycity.call(this, this.state.searchcity)
        }
        if (projects.length > 0) {
            // eslint-disable-next-line
            projects.map(project => {
                results.push(projectid.showsearchprojectid.call(this, project))
            })
        }
        return results;
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

                    {projectid.showsearchresults.call(this)}

                </div>
            </div>
        )
    }
}
export default ProjectID;