getYcoord() {

    let ycoord = "";
    const gfk = new GFK();
    const projectid = this.props.match.params.projectid;
    if (this.state.activesectionid) {
        const sectionid = this.state.activesectionid;

        if (this.state.activelayerid) {
            const layerid = this.state.activelayerid;


            if (this.state.activepointid) {
                const pointid = this.state.activepointid;
                const point = gfk.getSlopePointByID.call(this, projectid, sectionid, layerid, pointid)
                if (point) {
                    ycoord = point.ycoord;
                }

            }

        }
    }
    return ycoord;

}

handleYcoord(value) {

    const gfk = new GFK();
    const projectid = this.props.match.params.projectid;
    const sections = gfk.getSlopeStability.call(this)
    const makeid = new MakeID();
    if (this.state.activesectionid) {
        const sectionid = this.state.activesectionid;
        const section = gfk.getSlopebySectionID.call(this, projectid, sectionid)
        if (section) {
            const i = gfk.getSlopeKeybySectionID.call(this, projectid, sectionid)
            if (this.state.activelayerid) {
                const layerid = this.state.activelayerid;
                const layer = gfk.getSlopeLayerByID.call(this, projectid, sectionid, layerid)
                if (layer) {
                    const j = gfk.getSlopeLayerKeyByID.call(this, projectid, sectionid, layerid)
                    if (this.state.activepointid) {
                        const pointid = this.state.activepointid;
                        const point = gfk.getSlopePointByID.call(this, projectid, sectionid, layerid, pointid)
                        if (point) {
                            const k = gfk.getSlopePointKeyByID.call(this, projectid, sectionid, layerid, pointid)
                            sections[i].layers[j].points[k].ycoord = value
                            this.props.reduxSlopeStability(sections)
                            this.setState({ render:'render' })

                        }

                    } else {
                        // new point
                        const pointid = makeid.pointID.call(this)
                        const xcoord= this.state.xcoord;
                        const newpoint = newPoint(pointid,xcoord,value)
                        if(layer.hasOwnProperty("points")) {
                            sections[i].layers[j].points.push(newpoint)
                        } else {
                            sections[i].layers[j].points = [newpoint]
                        }
                        this.setState({activepointid:pointid})

                    }


                }

            }
        }

    }

}