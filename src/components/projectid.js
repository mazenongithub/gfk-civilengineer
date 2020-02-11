import React from 'react';
import { MyStylesheet } from './styles';
import GFK from './gfk'
class ProjectID {

    showsearchresult(project) {
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this);
        const styles = MyStylesheet();
        return (<div style={{ ...styles.generalContainer, ...regularFont, ...styles.generalFont }}>
            ProjectID:{project.projectid} ProjectNumber:{project.projectnumber} {project.title} {project.city}
        </div>)
    }
    showsearchresults() {
        const gfk = new GFK();
        const projectid = new ProjectID()
        let searchresults = [];
        if (this.state.projectnumber) {
            const projectnumber = this.state.projectnumber;
            const projects = gfk.getprojects.call(this)

            if (projects) {
                // eslint-disable-next-line
                projects.map(project => {
                    if (project.projectnumber.startsWith(projectnumber) && projectnumber.length > 1) {
                        searchresults.push(projectid.showsearchresult.call(this, project))
                    }
                })
            }
        }
        return searchresults;
    }

    showprojectid() {
        const gfk = new GFK();
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this)
        const projectid = new ProjectID();
        if (this.state.width > 800) {
            return (<div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                            Project ID
                         </div>
                        <div style={{ ...styles.flex2, ...styles.generalFont, ...regularFont, ...styles.generalField }}>
                            {this.getprojectid()}
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                            Project Number
                         </div>
                        <div style={{ ...styles.flex2 }}>
                            <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }} />
                        </div>
                    </div>
                    {projectid.showsearchresults.call(this)}
                </div>
            </div>)

        } else {
            return (<div style={{ ...styles.generalContainer }}>
                <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}>
                    Project ID
                </div>
                <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont, ...styles.showBorder, ...styles.minHeight, ...styles.generalField }}>
                    {this.getprojectid()}
                </div>
                <div style={{ ...styles.generalContainer, ...styles.generalFont, ...regularFont }}>
                    Project Number
                </div>
                <div style={{ ...styles.generalContainer }}>
                    <input type="text"
                        value={this.state.projectnumber}
                        onChange={event => { this.setState({ projectnumber: event.target.value }) }}
                        style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }} />
                </div>
                {projectid.showsearchresults.call(this)}

            </div>)
        }
    }

}
export default ProjectID