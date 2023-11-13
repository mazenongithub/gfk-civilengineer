removeimage(imageid) {
    const gfk = new GFK();
    const myuser = gfk.getuser.call(this);
    if (myuser) {
        if (this.state.activefieldid) {
            const fieldid = this.state.activefieldid;
            const fieldreport = gfk.getfieldreportbyid.call(this, fieldid);
            if (fieldreport) {
                const i = gfk.getfieldkeybyid.call(this, fieldid)
                const image = gfk.getfieldimagebyid.call(this, fieldid, imageid)
                if (image) {
                    if (window.confirm(`Are you sure you want to delete image number ${image.image}?`)) {


                        const j = gfk.getcompactionfieldimagekeybyid.call(this, fieldid, imageid)

                        myuser.fieldreports[i].images.splice(j, 1);
                        if (myuser.fieldreports[i].images.length === 0) {
                            delete myuser.fieldreports[i].images

                        }
                        this.props.reduxUser(myuser);
                        this.setState({ activeimageid: false })

                    }

                }

            }

        }


    }
}