handlegraphiclog(graphiclog) {
    const gfk = new GFK();
    const myuser = gfk.getuser.call(this);
    if (myuser) {
        if (this.state.activesampleid) {
            const i = gfk.getsamplekeybyid.call(this, this.state.activesampleid);
            myuser.samples.sample[i].graphiclog = graphiclog;
            this.props.reduxUser(myuser)
            this.setState({ render: 'render' })
        } else {
            const sampleid = makeID(16);
            const boringid = this.props.match.params.boringid;
            const samplenumber = this.state.samplenumber;
            const sampledepth = this.state.sampledepth;
            const sampleset = this.state.sampleset;
            const depth = this.state.depth;
            const diameter = this.state.diameter;
            const pi = this.state.pi;
            const uscs = this.state.uscs;
            const drywgt = this.state.drywgt;
            const tarewgt = this.state.tarewgt;
            const wetwgt = this.state.wgtwgt;
            const wetwgt_2 = this.state.wetwgt_2;
            const tareno = this.state.tareno;
            const samplelength = this.state.samplelength;
            const description = this.state.description;
            const spt = this.state.spt;
            const ll = this.state.ll;
            const newSample = Sample(sampleid, boringid, sampledepth, depth, samplenumber, sampleset, diameter, samplelength, description, uscs, spt, wetwgt, wetwgt_2, drywgt, tarewgt, tareno, graphiclog, ll, pi)
            const samples = gfk.getsamples.call(this)
            if (samples) {
                myuser.samples.sample.push(newSample)

            } else {
                myuser.samples = { sample: [newSample] }

            }
            this.props.reduxUser(myuser)
            this.setState({ activesampleid: sampleid, graphiclog: '' })

        }
    }


}
getgraphiclog() {
    const gfk = new GFK();
    if (this.state.activesampleid) {
        const sample = gfk.getsamplebyid.call(this, this.state.activesampleid);
        return sample.graphiclog;
    } else {
        return this.state.graphiclog;
    }
}