
import React, { Component } from 'react';
import * as actions from './actions';
import { connect } from 'react-redux';
import { MyStylesheet } from './styles';
import GFK from './gfk';
import { Link } from 'react-router-dom';
import { HandleFigures, UploadFileImage } from './actions/api';

class Figures extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            render: 'render',
            activeFigureID: null,
            selectedFile: null,
            saving: false,
            uploading: false,
            message: ''
        };

        this.fileInput = null;

        this.updateWindowDimensions =
            this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        window.addEventListener(
            'resize',
            this.updateWindowDimensions
        );

        this.updateWindowDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener(
            'resize',
            this.updateWindowDimensions
        );
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    // ----------------------------------------
    // GET PROJECT FIGURES
    // ----------------------------------------

    getProjectFigures() {
        const gfk = new GFK();
        const { projectid } = this.props.match.params;

        return gfk.getFiguresByProjectID.call(
            this,
            projectid
        );
    }

    // ----------------------------------------
    // GET ACTIVE FIGURE
    // ----------------------------------------

    getActiveFigure() {
        const { activeFigureID } = this.state;

        if (!activeFigureID) return null;

        return this.getProjectFigures().find(
            figure => figure.figureid === activeFigureID
        ) || null;
    }

    // ----------------------------------------
    // GET FIGURE PROPERTY
    // ----------------------------------------

    getFigureValue(prop) {
        const figure = this.getActiveFigure();

        return figure?.[prop] ?? '';
    }

    // ----------------------------------------
    // UPDATE PROJECT FIGURES IN REDUX
    // ----------------------------------------

    updateLocalFigures(figures) {
        const { projectid } = this.props.match.params;
        const { projects = [] } = this.props;

        const updatedProjects = projects.map(project => {

            if (project.projectid !== projectid) {
                return project;
            }

            return {
                ...project,
                figures
            };
        });

        this.props.reduxProjects(updatedProjects);
    }

    showFigureOrientation() {

        const styles = MyStylesheet();
        const gfk = new GFK();

        const regularFont = gfk.getRegularFont.call(this);

        return (
            <div style={{
                ...styles.generalContainer,
                ...styles.bottomMargin15
            }}>

                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        Figure Orientation
                    </span>
                </div>

                <select
                    style={{
                        ...regularFont,
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                    value={this.getFigureValue('orientation')}
                    disabled={
                        this.state.saving ||
                        this.state.uploading
                    }
                    onChange={e => {
                        this.setFigureValue(
                            'orientation',
                            e.target.value
                        );
                    }}
                >
                    <option value="">
                        Select Orientation
                    </option>

                    <option value="portrait">
                        Portrait
                    </option>

                    <option value="landscape">
                        Landscape
                    </option>
                </select>

            </div>
        );
    }

    // ----------------------------------------
    // CREATE OR UPDATE FIGURE
    // ----------------------------------------

    setFigureValue(prop, value) {

        const figures = this.getProjectFigures();
        const activeFigure = this.getActiveFigure();

        if (!activeFigure) {

            // Automatically create a figure
            const figureid = window.crypto?.randomUUID?.() ||
                `${Date.now()}-${Math.random().toString(36).slice(2)}`;

            const newFigure = {
                figureid,
                figuretitle: '',
                figureurl: '',
                figurecaption: '',
                orientation: 'portrait',
                [prop]: value
            };

            this.updateLocalFigures([
                ...figures,
                newFigure
            ]);

            this.setState({
                activeFigureID: figureid,
                message: ''
            });

            return;
        }

        // Update existing active figure
        const updatedFigures = figures.map(figure => {

            if (figure.figureid !== activeFigure.figureid) {
                return figure;
            }

            return {
                ...figure,
                [prop]: value
            };
        });

        this.updateLocalFigures(updatedFigures);
    }

    // ----------------------------------------
    // SELECT / DESELECT FIGURE
    // ----------------------------------------

    selectFigure = (figureid) => {

        const { activeFigureID } = this.state;

        // Clicking active ID again deselects it
        const nextFigureID =
            activeFigureID === figureid ? null : figureid;

        if (this.fileInput) {
            this.fileInput.value = '';
        }

        this.setState({
            activeFigureID: nextFigureID,
            selectedFile: null,
            message: ''
        });
    };

    // ----------------------------------------
    // REMOVE ACTIVE FIGURE
    // ----------------------------------------

    removeFigure = () => {

        const { activeFigureID } = this.state;

        if (!activeFigureID) return;

        const figures = this.getProjectFigures().filter(
            figure => figure.figureid !== activeFigureID
        );

        this.updateLocalFigures(figures);

        if (this.fileInput) {
            this.fileInput.value = '';
        }

        this.setState({
            activeFigureID: null,
            selectedFile: null,
            message: 'Figure removed. Save to confirm.'
        });
    };

    // ----------------------------------------
    // SAVE FIGURES
    // ----------------------------------------

    saveFigures = async () => {

        const { projectid } = this.props.match.params;

        this.setState({
            saving: true,
            message: ''
        });

        try {

            const response = await HandleFigures(
                projectid,
                this.getProjectFigures()
            );

            if (Array.isArray(response.figures)) {
                this.updateLocalFigures(response.figures);
            }

            this.setState({
                message: response.message ||
                    'Figures saved successfully'
            });

        } catch (err) {

            console.error('Error saving figures:', err);

            this.setState({
                message: err.message || String(err)
            });

        } finally {

            this.setState({
                saving: false
            });
        }
    };

    // ----------------------------------------
    // UPLOAD FIGURE IMAGE
    // ----------------------------------------

    uploadFigure = async () => {

        const { projectid } = this.props.match.params;
        const { selectedFile } = this.state;

        const activeFigure = this.getActiveFigure();

        if (!activeFigure || !selectedFile) {
            this.setState({
                message: 'Select a figure and image first.'
            });

            return;
        }

        this.setState({
            uploading: true,
            message: ''
        });

        try {

            const formData = new FormData();

            formData.append(
                'fileimage',
                selectedFile
            );

            formData.append(
                'figures',
                JSON.stringify(this.getProjectFigures())
            );

            const response = await UploadFileImage(
                projectid,
                activeFigure.figureid,
                formData
            );

            const updatedFigures = Array.isArray(response)
                ? response
                : response.figures;

            if (!Array.isArray(updatedFigures)) {
                throw new Error('Invalid figures response');
            }

            this.updateLocalFigures(updatedFigures);

            if (this.fileInput) {
                this.fileInput.value = '';
            }

            this.setState({
                selectedFile: null,
                message: 'Figure image uploaded successfully'
            });

        } catch (err) {

            console.error('Error uploading figure:', err);

            this.setState({
                message: err.message || String(err)
            });

        } finally {

            this.setState({
                uploading: false
            });
        }
    };

    // ----------------------------------------
    // SHOW FIGURE INPUT FIELD
    // ----------------------------------------

    showFigureField(prop, label) {

        const styles = MyStylesheet();
        const gfk = new GFK();

        const regularFont = gfk.getRegularFont.call(this);

        return (
            <div style={{
                ...styles.generalContainer,
                ...styles.bottomMargin15
            }}>

                <div style={{ ...styles.generalContainer }}>
                    <span style={{ ...regularFont }}>
                        {label}
                    </span>
                </div>

                <input
                    type="text"
                    style={{
                        ...regularFont,
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                    value={this.getFigureValue(prop)}
                    disabled={
                        this.state.saving ||
                        this.state.uploading
                    }
                    onChange={e => {
                        this.setFigureValue(
                            prop,
                            e.target.value
                        );
                    }}
                />

            </div>
        );
    }

    // ----------------------------------------
    // SHOW FIGURE IDS AT BOTTOM
    // ----------------------------------------

    showFigureIDs() {

        const styles = MyStylesheet();
        const gfk = new GFK();

        const regularFont = gfk.getRegularFont.call(this);

        const figures = this.getProjectFigures();
        const { activeFigureID, saving, uploading } = this.state;

        return (
            <div style={{
                ...styles.generalContainer,
                ...styles.bottomMargin15
            }}>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.bottomMargin15
                }}>
                    <span style={{ ...regularFont }}>
                        Project Figures ({figures.length})
                    </span>
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                }}>

                    {figures.map((figure, i) => {

                        const isActive =
                            figure.figureid === activeFigureID;

                        return (
                            <button
                                key={figure.figureid}
                                type="button"
                                disabled={saving || uploading}
                                onClick={() => {
                                    this.selectFigure(figure.figureid);
                                }}
                                style={{
                                    ...regularFont,
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: '5px',
                                    border: isActive
                                        ? '2px solid #cc0000'
                                        : '1px solid #aaa',
                                    backgroundColor: isActive
                                        ? '#ffcccc'
                                        : 'transparent',
                                    color: isActive
                                        ? '#990000'
                                        : 'inherit',
                                    fontWeight: isActive
                                        ? 'bold'
                                        : 'normal'
                                }}
                            >
                                {figure.figureid}
                            </button>
                        );
                    })}

                </div>

            </div>
        );
    }

    // ----------------------------------------
    // SHOW FIGURE EDITOR
    // ----------------------------------------

showFigureThumbnail() {
    const styles = MyStylesheet();
    const gfk = new GFK();

    const regularFont = gfk.getRegularFont.call(this);

    const { engineerid, projectid } = this.props.match.params;

    const activeFigure = this.getActiveFigure();

    if (!activeFigure?.figureid) {
        return null;
    }

    const imageURL =
        `${process.env.REACT_APP_SERVER_API}/gfk/${projectid}/figures/${activeFigure.figureid}/image?v=${encodeURIComponent(activeFigure.figureurl || '')}`;

    const viewFigureURL =
        `/${engineerid}/projects/${projectid}/figures/${activeFigure.figureid}`;

    return (
        <div
            style={{
                ...styles.generalContainer,
                ...styles.alignCenter,
                ...styles.bottomMargin15
            }}
        >
            {activeFigure.figureurl && (
                <img
                    src={imageURL}
                    alt={activeFigure.figuretitle || 'Figure'}
                    style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'contain',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                    }}
                />
            )}

            <div
                style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.bottomMargin15
                }}
            >
                <span style={{ ...regularFont }}>
                    {activeFigure.figuretitle}
                </span>
            </div>

            <div
                style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter
                }}
            >
                <Link
                    to={viewFigureURL}
                    rel="noopener noreferrer"
                    style={{
                        ...regularFont,
                        ...styles.generalLink,
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                >
                    View Figure
                </Link>
            </div>
        </div>
    );
}

    showFigureEditor() {

        const styles = MyStylesheet();
        const gfk = new GFK();

        const regularFont = gfk.getRegularFont.call(this);

        const { saving, uploading, selectedFile } = this.state;

        const activeFigure = this.getActiveFigure();
        const busy = saving || uploading;

        return (
            <div style={{ ...styles.generalContainer }}>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.bottomMargin15
                }}>
                    <span style={{ ...regularFont }}>
                        {activeFigure
                            ? `Editing Figure: ${activeFigure.figureid}`
                            : 'New Figure - Enter information to create'}
                    </span>
                </div>

                {this.showFigureField(
                    'figuretitle',
                    'Figure Title'
                )}

                {this.showFigureField(
                    'figureurl',
                    'Figure URL'
                )}

                {this.showFigureField(
                    'figurecaption',
                    'Figure Caption'
                )}

                {this.showFigureOrientation()}

                {this.showFigureThumbnail()}

                <div style={{
                    ...styles.generalFlex,
                    ...styles.bottomMargin15,
                    gap: '15px',
                    flexWrap: 'wrap'
                }}>

                    <div style={{ ...styles.flex1 }}>

                        <button
                            className="generalButton"
                            disabled={busy}
                            onClick={this.saveFigures}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>

                    </div>

                    <div style={{ ...styles.flex1 }}>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            ref={input => {
                                this.fileInput = input;
                            }}
                            disabled={!activeFigure || busy}
                            onChange={e => {
                                this.setState({
                                    selectedFile: e.target.files?.[0] || null
                                });
                            }}
                        />

                        <button
                            className="generalButton"
                            disabled={
                                !selectedFile ||
                                !activeFigure ||
                                busy
                            }
                            onClick={this.uploadFigure}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>

                    </div>

                    <div>
                        <button
                            className="generalButton"
                            disabled={!activeFigure || busy}
                            onClick={this.removeFigure}
                        >
                            Remove
                        </button>
                    </div>

                </div>

                {this.state.message && (
                    <div style={{
                        ...styles.generalContainer,
                        ...styles.bottomMargin15
                    }}>
                        <span style={{ ...regularFont }}>
                            {this.state.message}
                        </span>
                    </div>
                )}

                {/* FIGURE IDS AT BOTTOM */}

                {this.showFigureIDs()}

            </div>
        );
    }

    // ----------------------------------------
    // RENDER
    // ----------------------------------------

    render() {

        const styles = MyStylesheet();
        const gfk = new GFK();

        const regularFont = gfk.getRegularFont.call(this);
        const headerFont = gfk.getHeaderFont.call(this);

        const { projectid } = this.props.match.params;

        const user = gfk.getUser.call(this);

        if (!user) {
            return (
                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.generalFont
                }}>
                    <span style={{ ...regularFont }}>
                        User Not Found
                    </span>
                </div>
            );
        }

        const project = gfk.getProjectById.call(
            this,
            projectid
        );

        if (!project) {
            return (
                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.generalFont
                }}>
                    <span style={{ ...regularFont }}>
                        Project Not Found
                    </span>
                </div>
            );
        }

        return (
            <div style={{
                ...styles.generalContainer,
                ...styles.generalFont
            }}>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter
                }}>
                    <Link
                        style={{
                            ...styles.generalFont,
                            ...headerFont,
                            ...styles.generalLink,
                            ...styles.boldFont
                        }}
                        to={`/${user.engineerid}/projects`}
                    >
                        /Projects
                    </Link>
                </div>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter
                }}>
                    <Link
                        style={{
                            ...styles.generalFont,
                            ...headerFont,
                            ...styles.generalLink,
                            ...styles.boldFont
                        }}
                        to={`/${user.engineerid}/projects/${project.projectid}`}
                    >
                        /{project.title}
                    </Link>
                </div>

                <div style={{
                    ...styles.generalContainer,
                    ...styles.alignCenter,
                    ...styles.bottomMargin15
                }}>
                    <Link
                        style={{
                            ...styles.generalFont,
                            ...headerFont,
                            ...styles.generalLink,
                            ...styles.boldFont
                        }}
                        to={`/${user.engineerid}/projects/${project.projectid}/figures`}
                    >
                        /Figures
                    </Link>
                </div>

                {this.showFigureEditor()}

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        myuser: state.myuser,
        projects: state.projects,
        company: state.company
    };
}

export default connect(
    mapStateToProps,
    actions
)(Figures);
