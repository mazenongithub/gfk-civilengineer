import React from 'react';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { addNewImage } from './svg'
import { UploadGraphicLog } from './actions/api'

class GraphicLog {
    constructor() {
        this.images = [];
    }

    updateactiveimage(graphiclog) {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        if (myuser) {
            if (this.state.activesampleid) {
                const i = gfk.getsamplekeybyid.call(this, this.state.activesampleid);
                myuser.samples.sample[i].graphiclog = graphiclog;
                this.props.reduxUser(myuser);
                this.setState({ render: 'render' })
            }
        }
    }

    getimages() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this);
        const graphiclog = new GraphicLog();

        let myimages = [];
        const imageContainer = () => {
            if (this.state.width > 1200) {
                return ({ width: '160px', height: 'auto' })
            } else if (this.state.width > 800) {
                return ({ width: '110px', height: 'auto' })
            } else {
                return ({ width: '90px', height: 'auto' })
            }
        }
        const showimage = (image) => {
            if (this.state.width > 1200) {
                return (<div style={{ ...styles.generalFlex }} onClick={() => { graphiclog.updateactiveimage.call(this, image.graphiclog) }} key={image.sampleid}>
                    <div style={{ ...styles.flex1 }}>
                        <div style={{ ...styles.generalContainer, ...styles.alignRight }}>
                            <img src={image.graphiclog} alt={image.description} />
                        </div>
                    </div>
                    <div style={{ ...styles.flex5 }}>
                        <div style={{ ...styles.generalContainer, ...regularFont, ...styles.generalFont }}>
                            {image.graphiclog}
                        </div>
                        <div style={{ ...styles.generalContainer, ...regularFont, ...styles.generalFont }}>
                            Project Number {image.projectnumber} {image.description}
                        </div>

                    </div>
                </div>)
            } else if (this.state.width > 800) {

                return (
                    <div style={{ ...styles.generalFlex }} onClick={() => { graphiclog.updateactiveimage.call(this, image.graphiclog) }}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...styles.alignRight }}>
                                <img src={image.graphiclog} alt={image.description} />
                            </div>
                        </div>
                        <div style={{ ...styles.flex3 }}>
                            <div style={{ ...styles.generalContainer, ...regularFont, ...styles.generalFont }}>
                                {image.graphiclog}
                            </div>
                            <div style={{ ...styles.generalContainer, ...regularFont, ...styles.generalFont }}>
                                Project Number {image.projectnumber} {image.description}
                            </div>
                        </div>
                    </div>)

            } else {

                return (
                    <div style={{ ...styles.generalFlex }} onClick={() => { graphiclog.updateactiveimage.call(this, image.graphiclog) }} key={image.sampleid}>
                        <div style={{ ...styles.flex1 }}>
                            <div style={{ ...styles.generalContainer, ...imageContainer(), ...styles.alignRight }}>
                                <img src={image.graphiclog} alt={image.description} />
                            </div>
                        </div>
                        <div style={{ ...styles.flex2 }}>
                            <div style={{ ...styles.generalContainer, ...regularFont, ...styles.generalFont }}>
                                {image.graphiclog}
                            </div>
                            <div style={{ ...styles.generalContainer, ...regularFont, ...styles.generalFont }}>
                                Project Number {image.projectnumber} {image.description}
                            </div>
                        </div>
                    </div>)

            }
        }

        const validatenewimage = (images, newImage) => {
            let validate = true;
            if (images.length > 0) {
                // eslint-disable-next-line
                images.map(image => {
                    if (newImage.graphiclog === image.graphiclog) {
                        validate = false;
                    }
                })

            }
            return validate;

        }
        if (myuser) {
            let images = [];
            const samples = gfk.getallsampleimages.call(this)
            if (samples) {
                // eslint-disable-next-line
                samples.map(sample => {



                    let validate = validatenewimage(images, sample)
                    if (validate) {
                        images.push(sample)
                    }




                })
            }
            if (images.length > 0) {
                // eslint-disable-next-line
                images.map(image => {
                    myimages.push(showimage(image))
                })
            }

        }
        return myimages;
    }
    async uploadnewimage() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this)
        const boringid = this.props.match.params.boringid;
        const boring = gfk.getboringbyid.call(this, boringid)
        if (boring) {
            const i = gfk.getboringkeybyid.call(this,boringid)

            if (this.state.activesampleid) {
                const sampleid = this.state.activesampleid;
                const sample = gfk.getsamplebyid.call(this, boringid,sampleid)
                console.log(sample)
                let formData = new FormData();
                let myfile = document.getElementById("graphic-log");
                formData.append("graphiclog", myfile.files[0]);
                formData.append("sample", JSON.stringify(sample))
                let response = await UploadGraphicLog(formData);
                if (response.hasOwnProperty("sample")) {
                    const sample = response.sample;
                    const sampleid = sample.sampleid;
                    const j = gfk.getsamplekeybyid.call(this, boringid,sampleid)
                    myuser.borings[i].samples[j] = sample;
                    this.props.reduxUser(myuser)
                    this.setState({ render: 'render' })

                }
            }

        }
    }

    showgraphiclog() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this);
        const graphiclog = new GraphicLog();
        const addnewimage = () => {
            if (this.state.width > 1200) {
                return ({ width: '221px', height: '46px' })
            } else if (this.state.width > 800) {
                return ({ width: '146px', height: '34px' })
            } else {
                return ({ width: '116px', height: '27px' })
            }
        }
        const buttonMargin = () => {
            if (this.state.width > 1200) {
                return ({ marginLeft: '78px' })
            } else if (this.state.width > 800) {
                return ({ marginLeft: '55px' })
            } else {
                return ({ marginLeft: '22px' })
            }
        }
        const maxHeight = () => {
            if (this.state.width > 1200) {
                return ({
                    height: '250px',
                    overflow: 'scroll',
                    padding: '10px'
                })
            } else if (this.state.width > 800) {
                return ({
                    height: '200px',
                    overflow: 'scroll',
                    padding: '10px'
                })
            } else {
                return ({
                    height: '150px',
                    overflow: 'scroll',
                    padding: '10px'
                })
            }

        }
        return (
            <div style={{ ...styles.generalFlex, ...maxHeight() }} className="hidescroll">
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                            Graphic Log
                            <input type="text" style={{ ...styles.generalFont, ...regularFont, ...styles.generalField }}
                                value={this.getgraphiclog()}
                                onChange={event => { this.handlegraphiclog(event.target.value) }}
                            />
                        </div>
                    </div>

                    <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>
                            <input type="file" id="graphic-log" /> <button style={{ ...styles.generalButton, ...addnewimage(), ...buttonMargin() }} onClick={() => { graphiclog.uploadnewimage.call(this) }}>{addNewImage()}</button>
                        </div>
                    </div>

                    {graphiclog.getimages.call(this)}



                </div>
            </div>
        )
    }

}
export default GraphicLog;