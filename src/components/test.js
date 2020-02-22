handlewgt200(wgt200) {
    const gfk = new GFK();
    const myuser = gfk.getuser.call(this);
    if (myuser) {
        const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid)
        if (sieve) {
            const i = gfk.getsievekeybysampleid.call(this, this.props.match.params.sampleid)
            myuser.sieves.sieve[i].wgt200 = wgt200;
            this.props.reduxUser(myuser);
            this.setState({ render: 'render' })

        } else {
            const sampleid = this.props.match.params.sampleid;
            const wgt34 = this.state.wgt34;
            const wgt38 = this.state.wgt38;
            const wgt4 = this.state.wgt4;
            const wgt10 = this.state.wgt10;
            const wgt30 = this.state.wgt30;
            const wgt40 = this.state.wgt40;
            const wgt100 = this.state.wgt100;
            const newSieve = CreateSieve(sampleid, wgt34, wgt38, wgt4, wgt10, wgt30, wgt40, wgt100, wgt200);
            myuser.sieves = { sieve: [newSieve] }
            this.props.reduxUser(myuser);
            this.setState({ render: 'render', wgt200: '' })

        }

    }

}

getwgt200() {
    const gfk = new GFK();
    const sieve = gfk.getsievebysampleid.call(this, this.props.match.params.sampleid);
    console.log(sieve)
    if (sieve) {
        return sieve.wgt200
    } else {
        return this.state.wgt200;
    }
}