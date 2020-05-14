import React from 'react';
import { MyStylesheet } from './styles'
import GFK from './gfk';
import { addNewImage } from './svg'
import { UploadGraphicLog } from './actions/api'

class GraphicLog {
    constructor() {
        this.images = [];
    }

    getimages() {
        const gfk = new GFK();
        const myuser = gfk.getuser.call(this);
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this)
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
                return (<div style={{ ...styles.generalFlex }}>
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
                    <div style={{ ...styles.generalFlex }}>
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
                    <div style={{ ...styles.generalFlex }}>
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
            const samples = gfk.getsamples.call(this)
            if (samples) {
                // eslint-disable-next-line
                samples.map(sample => {
                    if (sample.hasOwnProperty("graphiclog")) {
                        if (sample.graphiclog) {
                            let boring = gfk.getboringbyid.call(this, sample.boringid);
                            const projectid = boring.projectid;
                            const project = gfk.getprojectbyid.call(this, projectid)
                            let projectnumber = project.projectnumber;
                            let graphiclog = sample.graphiclog;
                            let description = sample.description;
                            let newImage = { projectnumber, project, graphiclog, description }
                            let validate = validatenewimage(images, newImage)
                            if (validate) {
                                images.push(newImage)
                            }

                        }
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
        if (this.state.activesampleid) {
            const sample = gfk.getsamplebyid.call(this, this.state.activesampleid)
            let formData = new FormData();
            let myfile = document.getElementById("graphic-log");
            formData.append("graphiclog", myfile.files[0]);
            formData.append("sample", JSON.stringify(sample))
            let response = await UploadGraphicLog(formData);
            if(response.hasOwnProperty("sample")) {
                const sample = response.sample[0];
                const sampleid = sample.sampleid;
                const i = gfk.getsamplekeybyid.call(this,sampleid)
                myuser.samples.sample[i] = sample;
                this.props.reduxUser(myuser)
                this.setState({render:'render'})
                
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