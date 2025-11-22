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
        const projects = gfk.getProjects.call(this)
        const { projectid, boringid } = this.props.match.params;
        if (projects) {
            const project = gfk.getProjectById.call(this, projectid, boringid)
            if (project) {
                const i = gfk.getProjectKeyById.call(this, projectid)

                const boring = gfk.getBoringById.call(this, projectid, boringid)
                if (boring) {
                    const j = gfk.getBoringKeyById.call(this, projectid, boringid)
                    if (this.state.activesampleid) {
                        const sample = gfk.getSampleById.call(this, projectid, boringid, this.state.activesampleid)
                        if (sample) {
                            const k = gfk.getSampleKeyById.call(this, projectid, boringid, this.state.activesampleid);
                            projects[i].boring[j].samples[k].graphiclog = graphiclog;
                            this.props.reduxProjects(projects)
                            this.setState({ render: 'render' })

                        }
                    }

                }

            }
        }
    }

    getimages() {
        const gfk = new GFK();
        const myuser = gfk.getUser.call(this);
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this);
        const graphiclog = new GraphicLog();
        console.log(process.env.REACT_APP_SERVER_API)

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
                            <img src={`${process.env.REACT_APP_SERVER_API}${image.graphiclog}`} alt={image.description} />
                        </div>
                    </div>
                    <div style={{ ...styles.flex5 }}>
                        <div style={{ ...styles.generalContainer, ...regularFont, ...styles.generalFont }}>
                            {process.env.REACT_APP_SERVER_API}{image.graphiclog}
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
                                <img src={`${process.env.REACT_APP_SERVER_API}${image.graphiclog}`} alt={image.description} />
                            </div>
                        </div>
                        <div style={{ ...styles.flex3 }}>
                            <div style={{ ...styles.generalContainer, ...regularFont, ...styles.generalFont }}>
                               {process.env.REACT_APP_SERVER_API}{image.graphiclog}
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
                                <img src={`${process.env.REACT_APP_SERVER_API}${image.graphiclog}`} alt={image.description} />
                            </div>
                        </div>
                        <div style={{ ...styles.flex2 }}>
                            <div style={{ ...styles.generalContainer, ...regularFont, ...styles.generalFont }}>
                                {process.env.REACT_APP_SERVER_API}{image.graphiclog}
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
            const samples = gfk.getAllSampleImages.call(this)
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
    const { projectid, boringid } = this.props.match.params;

    // Validate required fields early
    const project = gfk.getProjectById.call(this, projectid);
    if (!project) return alert("Project not found");

    const boring = gfk.getBoringById.call(this, projectid, boringid);
    if (!boring) return alert("Boring not found");

    const sampleid = this.state.activesampleid;
    if (!sampleid) return alert("No active sample selected");

    const sample = gfk.getSampleById.call(this, projectid, boringid, sampleid);
    if (!sample) return alert("Sample not found");

    // Get the file input
    const fileInput = document.getElementById("graphic-log");
    if (!fileInput?.files?.length) return alert("Please select an image");

    // Build FormData
    const formData = new FormData();
    formData.append("graphiclog", fileInput.files[0]);
    formData.append("projectid", projectid);
    formData.append("boringid", boringid);
    formData.append("sampleid", sampleid);

    try {
        const response = await UploadGraphicLog(formData);
        console.log(response)
        if (!response?.borings) {
            return alert("Upload failed: missing returned borings.");
        }

        // Update projects in Redux
        const projects = gfk.getProjects.call(this);
        const projectIndex = gfk.getProjectKeyById.call(this, projectid);
        const {borings} = response.borings
        if (projectIndex !== false && projects[projectIndex]) {
            projects[projectIndex].borings = borings;
            this.props.reduxProjects(projects);
        }

        this.setState({ message: response.message });

    } catch (err) {
        console.error("Upload error:", err);
        alert(err);
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
                                value={this.getGraphicLog()}
                                onChange={event => { this.handleGraphicLog(event.target.value) }}
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