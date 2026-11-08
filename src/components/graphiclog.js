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
    const projects = gfk.getProjects.call(this);
    const { projectid, boringid } = this.props.match.params;
    const { activesampleid } = this.state;

    if (!Array.isArray(projects) || !activesampleid) return;

    const i = gfk.getProjectKeyById.call(this, projectid);
    const j = gfk.getBoringKeyById.call(this, projectid, boringid);
    const k = gfk.getSampleKeyById.call(
        this,
        projectid,
        boringid,
        activesampleid
    );

    if (
        !Number.isInteger(i) || i < 0 ||
        !Number.isInteger(j) || j < 0 ||
        !Number.isInteger(k) || k < 0 ||
        !projects[i]?.borings?.[j]?.samples?.[k]
    ) {
        console.error('Unable to update graphic log:', {
            projectid,
            boringid,
            activesampleid,
            i,
            j,
            k
        });
        return;
    }

    const updatedProjects = projects.map((project, projectIndex) => {
        if (projectIndex !== i) return project;

        return {
            ...project,
            borings: project.borings.map((boring, boringIndex) => {
                if (boringIndex !== j) return boring;

                return {
                    ...boring,
                    samples: boring.samples.map((sample, sampleIndex) => {
                        if (sampleIndex !== k) return sample;

                        return {
                            ...sample,
                            graphiclog
                        };
                    })
                };
            })
        };
    });

    this.props.reduxProjects(updatedProjects);
    
};
    getimages() {
        const gfk = new GFK();
        const myuser = gfk.getUser.call(this);
        const styles = MyStylesheet();
        const regularFont = gfk.getRegularFont.call(this);
        const graphiclog = new GraphicLog();
      
        const {projectid, boringid} = this.props.match.params;
        const sampleid = this.state.activesampleid

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
    const { projectid, boringid } = this.props.match.params;
    const { width } = this.state;

    if (!image?.sampleid || !image?.graphiclog) return null;

    const imageUrl =
        `${process.env.REACT_APP_SERVER_API}/gfk/graphiclog/` +
        `${encodeURIComponent(projectid)}/` +
        `${encodeURIComponent(boringid)}/` +
        `${encodeURIComponent(image.sampleid)}`;

    const textFlex = width > 1200
        ? styles.flex5
        : width > 800
            ? styles.flex3
            : styles.flex2;

    const imageStyle = width <= 800
        ? imageContainer()
        : {};

    return (
        <div
            key={image.sampleid}
            style={{
                ...styles.generalFlex,
                cursor: 'pointer'
            }}
            onClick={() =>
                graphiclog.updateactiveimage.call(
                    this,
                    image.graphiclog
                )
            }
        >
            <div style={{ ...styles.flex1 }}>
                <div
                    style={{
                        ...styles.generalContainer,
                        ...imageStyle,
                        ...styles.alignRight
                    }}
                >
                    <img
                        src={imageUrl}
                        alt={image.description || 'Graphic Log'}
                        style={{
                            maxWidth: '100%',
                            height: 'auto'
                        }}
                    />
                </div>
            </div>

            <div style={textFlex}>
                <div
                    style={{
                        ...styles.generalContainer,
                        ...regularFont,
                        ...styles.generalFont
                    }}
                >
                    {image.graphiclog}
                </div>

                <div
                    style={{
                        ...styles.generalContainer,
                        ...regularFont,
                        ...styles.generalFont
                    }}
                >
                    Project Number {image.projectnumber} {image.description}
                </div>
            </div>
        </div>
    );
};

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