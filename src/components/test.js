getcity() {
    const gfk = new GFK();

    if (this.state.activeprojectid) {
        const myproject = gfk.getprojectbyid.call(this, this.state.activeprojectid);
        return myproject.city;
    } else {
        return this.state.city;
    }

}
handlecity(city) {
    const makeid = new MakeID();
    const gfk = new GFK();
    const myuser = gfk.getuser.call(this)
    if (myuser) {
        const engineerid = myuser.engineerid;
        if (this.state.activeprojectid) {
            const i = gfk.getprojectkeybyid.call(this,this.state.activeprojectid)
            myuser.projects.project[i].city = city;
            this.props.reduxUser(myuser);
            this.setState({render:'render'})

        } else {
            const projectid = makeid.projectid.call(this);
            const series = this.state.series;
            const projectnumber = '0';
            const title = this.state.title
            const address = this.state.address;
            const proposedproject = this.state.proposedproject;
            const projectapn = this.state.projectapn;
            const clientid = this.state.clientid;
            let newproject = CreateProject(projectid, projectnumber, series, title, address, city, proposedproject, projectapn, engineerid, clientid);
            const projects = gfk.getprojects.call(this);
            if(projects) {
                myuser.projects.project.push(newproject)
            } else {
                const project = {project:[newproject]}
                myuser.projects = project;
            }
            this.props.reduxUser(myuser)
            this.setState({activeprojectid:projectid})
        }
    }
}
