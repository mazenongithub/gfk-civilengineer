
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from './actions';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import {
    LoadGraphics,
    SaveGraphics,
    UploadGraphics
} from './actions/api';

class GraphicLogs extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activegraphicid: '',
            file: null,
            loading: false,
            saving: false,
            uploading: false,
            error: '',
            message: '',
            imageVersion: 0,
            dirty: false
        };

        this.fileInput = React.createRef();
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
        this.loadGraphicLogs();
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    // ============================================
    // COMPANY AND GRAPHICS
    // ============================================

    getCompany = () => {
        const gfk = new GFK();

        return gfk.getCompany.call(this) ||
            this.props.company ||
            null;
    };

    getGraphics = () => {
        const company = this.props.company;

        return company && Array.isArray(company.graphiclogs)
            ? company.graphiclogs
            : [];
    };

    getActiveGraphic = () => {
        return this.getGraphics().find(graphic =>
            graphic.graphicid === this.state.activegraphicid
        ) || null;
    };

    // ============================================
    // CURRENT SAMPLE
    // ============================================

    getIds = () => {
        const params = this.props.match &&
            this.props.match.params
            ? this.props.match.params
            : {};

        return {
            projectid: params.projectid,
            boringid: params.boringid,
            sampleid: this.props.activesampleid
        };
    };

    getActiveSample = () => {

        const { projectid, boringid, sampleid } = this.getIds();
        const projects = this.props.projects;

        if (
            !Array.isArray(projects) ||
            !projectid ||
            !boringid ||
            !sampleid
        ) {
            return null;
        }

        const project = projects.find(
            p => String(p.projectid) === String(projectid)
        );

        if (!project) return null;

        const boring = (project.borings || []).find(
            b => String(b.boringid) === String(boringid)
        );

        if (!boring) return null;

        return (boring.samples || []).find(
            s => String(s.sampleid) === String(sampleid)
        ) || null;
    };

    // ============================================
    // LOAD GRAPHICS FROM MONGODB
    // ============================================

    loadGraphicLogs = async () => {

        if (this._mounted) {
            this.setState({
                loading: true,
                error: ''
            });
        }

        try {
            const company = this.getCompany();

            if (!company) {
                throw new Error('Company not found.');
            }

            const response = await LoadGraphics(
                'gfk'
            );

            const graphics = response &&
                response.graphiclogs &&
                response.graphiclogs.graphics;

            if (!Array.isArray(graphics)) {
                throw new Error('Invalid graphic logs response.');
            }

            if (this._mounted) {
                this.props.reduxCompany({
                    ...company,
                    graphiclogs: graphics
                });

                this.setState({ dirty: false });
            }

        } catch (error) {

            if (this._mounted) {
                this.setState({ error: error.message });
            }

        } finally {

            if (this._mounted) {
                this.setState({ loading: false });
            }
        }
    };

    // ============================================
    // GENERATE GRAPHIC ID
    // ============================================

    newGraphicId = () => {

        if (
            typeof window !== 'undefined' &&
            window.crypto &&
            window.crypto.randomUUID
        ) {
            return window.crypto.randomUUID();
        }

        return 'graphic_' +
            Date.now().toString(36) +
            '_' +
            Math.random().toString(36).slice(2, 11);
    };

    // ============================================
    // CREATE OR UPDATE GRAPHIC ON CHANGE
    // ============================================

    handleGraphicChange = (field, value) => {

        if (
            ['code', 'graphiclog', 'description']
                .indexOf(field) === -1
        ) {
            return;
        }

        const company = this.getCompany();

        if (!company) {
            this.setState({ error: 'Company not found.' });
            return;
        }

        const graphics = this.getGraphics();

        let graphicid = this.state.activegraphicid;

        const exists = graphics.some(
            graphic => graphic.graphicid === graphicid
        );

        let updatedGraphics;

        if (!graphicid || !exists) {

            // No active graphic: create and activate one.
            graphicid = this.newGraphicId();

            const newGraphic = {
                graphicid: graphicid,
                code: '',
                graphiclog: '',
                description: '',
                [field]: value
            };

            updatedGraphics = [
                ...graphics,
                newGraphic
            ];

            this.setState({
                activegraphicid: graphicid,
                error: '',
                message: '',
                dirty: true
            });

        } else {

            // Existing graphic: update only its property.
            updatedGraphics = graphics.map(graphic => {

                if (graphic.graphicid !== graphicid) {
                    return graphic;
                }

                return {
                    ...graphic,
                    [field]: value
                };

            });

            this.setState({
                error: '',
                message: '',
                dirty: true
            });
        }

        this.props.reduxCompany({
            ...company,
            graphiclogs: updatedGraphics
        });
    };

    // ============================================
    // TOGGLE ACTIVE GRAPHIC
    // ============================================

    toggleActiveGraphic = graphicid => {

        this.setState(state => ({
            activegraphicid:
                state.activegraphicid === graphicid
                    ? ''
                    : graphicid,

            error: '',
            message: ''
        }));
    };

    // ============================================
    // SAVE GRAPHICS TO MONGODB
    // ============================================

    saveGraphicLogs = async () => {

        if (
            this.state.saving ||
            this.state.uploading ||
            this.state.loading
        ) {
            return;
        }

        this.setState({
            saving: true,
            error: '',
            message: ''
        });

        try {

            const company = this.getCompany();

            if (!company) {
                throw new Error('Company not found.');
            }

            const response = await SaveGraphics(
                'gfk',
                this.getGraphics()
            );

            const saved = response &&
                response.graphiclogs &&
                response.graphiclogs.graphics;

            if (this._mounted) {

                if (Array.isArray(saved)) {

                    const latestCompany = this.getCompany();

                    this.props.reduxCompany({
                        ...latestCompany,
                        graphiclogs: saved
                    });
                }

                this.setState(state => ({
                    message: 'Graphic library saved.',
                    dirty: false,
                    imageVersion: state.imageVersion + 1
                }));
            }

        } catch (error) {

            if (this._mounted) {
                this.setState({ error: error.message });
            }

        } finally {

            if (this._mounted) {
                this.setState({ saving: false });
            }
        }
    };

    // ============================================
    // UPLOAD IMAGE TO BACKBLAZE B2
    // ============================================

    uploadGraphic = async () => {

        if (
            this.state.uploading ||
            this.state.saving ||
            this.state.loading
        ) {
            return;
        }

        const file = this.state.file;

        if (!file) {
            this.setState({
                error: 'Choose an image to upload.'
            });
            return;
        }

        if (
            ['image/jpeg', 'image/png']
                .indexOf(file.type) === -1
        ) {
            this.setState({
                error: 'Only JPEG and PNG files are supported.'
            });
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            this.setState({
                error: 'Maximum image size is 8 MB.'
            });
            return;
        }

        this.setState({
            uploading: true,
            error: '',
            message: ''
        });

        try {

            const company = this.getCompany();

            if (!company) {
                throw new Error('Company not found.');
            }

            const response = await UploadGraphics(
                'gfk',
                this.state.activegraphicid,
                this.getGraphics(),
                this.state.file
            );

            this.props.reduxCompany({
                ...company,
                graphiclogs: response.graphiclogs.graphics
            })

            if (!response || !response.graphiclog) {
                throw new Error(
                    'Upload did not return an image key.'
                );
            }

            if (this._mounted) {

                // Replaces the active graphic's image key.
                // Creates a graphic if none is active.
                this.handleGraphicChange(
                    'graphiclog',
                    response.graphiclog
                );

                this.setState(state => ({
                    file: null,
                    imageVersion: state.imageVersion + 1,
                    message:
                        'Image uploaded. Click Save to store the image key.'
                }));

                if (this.fileInput.current) {
                    this.fileInput.current.value = '';
                }
            }

        } catch (error) {

            if (this._mounted) {
                this.setState({ error: error.message });
            }

        } finally {

            if (this._mounted) {
                this.setState({ uploading: false });
            }
        }
    };

    // ============================================
    // ADD GRAPHIC ID TO ACTIVE SAMPLE
    // ============================================

    addToSample = graphicid => {

        const graphic = this.getGraphics().find(
            g => g.graphicid === graphicid
        );

        const { projectid, boringid, sampleid } = this.getIds();

        if (!graphic) {
            this.setState({ error: 'Graphic not found.' });
            return;
        }

        if (!this.getActiveSample()) {
            this.setState({
                error: 'Select a sample first.'
            });
            return;
        }

        const projects = this.props.projects;

        const updatedProjects = projects.map(project => {

            if (
                String(project.projectid) !== String(projectid)
            ) {
                return project;
            }

            return {
                ...project,

                borings: (project.borings || []).map(boring => {

                    if (
                        String(boring.boringid) !== String(boringid)
                    ) {
                        return boring;
                    }

                    return {
                        ...boring,

                        samples: (boring.samples || []).map(sample => {

                            if (
                                String(sample.sampleid) !== String(sampleid)
                            ) {
                                return sample;
                            }

                            return {
                                ...sample,
                                graphicid: graphicid,

                                // Clear the old sample-based image key.
                                graphiclog: ''
                            };
                        })
                    };
                })
            };
        });

        this.props.reduxProjects(updatedProjects);

        this.setState({
            activegraphicid: graphicid,
            message:
                'Graphic assigned. Save the boring to persist the selection.',
            error: ''
        });
    };

    // ============================================
    // THUMBNAIL URL
    // ============================================

    imageUrl = graphicid => {

        const company = this.getCompany();

        const companyid = 'gfk'

        const base = String(
            process.env.REACT_APP_SERVER_API || ''
        ).replace(/\/+$/, '');

        return (
            base +
            '/gfk/' +
            encodeURIComponent(companyid) +
            '/graphiclogs/' +
            encodeURIComponent(graphicid) +
            '/image?v=' +
            this.state.imageVersion
        );
    };

    // ============================================
    // RENDER
    // ============================================

    render() {

        const styles = MyStylesheet();

        const graphics = this.getGraphics();

        const active = this.getActiveGraphic();

        const sample = this.getActiveSample();

        const assignedId = sample
            ? sample.graphicid || ''
            : '';

        const busy =
            this.state.loading ||
            this.state.saving ||
            this.state.uploading;

        const fieldStyle = {
            ...styles.generalField,
            width: '100%',
            boxSizing: 'border-box'
        };

        const buttonStyle = {
            ...styles.generalButton,
            marginRight: 8,
            cursor: 'pointer'
        };

        return (

            <div style={{
                ...styles.generalContainer,
                padding: 10
            }}>

                <h3>Graphic Log</h3>

                {/* ==================================
                    GRAPHIC PROPERTY FIELDS
                   ================================== */}

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10
                }}>

                    <label style={{ flex: '1 1 140px' }}>
                        Graphic Code

                        <input
                            type="text"
                            style={fieldStyle}
                            disabled={busy}
                            value={active ? active.code || '' : ''}
                            onChange={e =>
                                this.handleGraphicChange(
                                    'code',
                                    e.target.value
                                )
                            }
                        />
                    </label>

                    <label style={{ flex: '2 1 230px' }}>
                        Graphic Log (B2 image key)

                        <input
                            type="text"
                            style={fieldStyle}
                            disabled={busy}
                            value={active ? active.graphiclog || '' : ''}
                            onChange={e =>
                                this.handleGraphicChange(
                                    'graphiclog',
                                    e.target.value
                                )
                            }
                        />
                    </label>

                    <label style={{ flex: '2 1 230px' }}>
                        Description

                        <input
                            type="text"
                            style={fieldStyle}
                            disabled={busy}
                            value={active ? active.description || '' : ''}
                            onChange={e =>
                                this.handleGraphicChange(
                                    'description',
                                    e.target.value
                                )
                            }
                        />
                    </label>

                </div>

                {/* ==================================
                    UPLOAD AND SAVE
                   ================================== */}

                <div style={{
                    marginTop: 12,
                    marginBottom: 12
                }}>

                    <input
                        ref={this.fileInput}
                        type="file"
                        accept="image/jpeg,image/png"
                        disabled={busy}
                        onChange={e =>
                            this.setState({
                                file:
                                    e.target.files &&
                                        e.target.files[0]
                                        ? e.target.files[0]
                                        : null
                            })
                        }
                    />

                    <button
                        type="button"
                        style={buttonStyle}
                        disabled={busy}
                        onClick={this.uploadGraphic}
                    >
                        {this.state.uploading
                            ? 'Uploading...'
                            : 'Upload'}
                    </button>

                    <button
                        type="button"
                        style={buttonStyle}
                        disabled={busy}
                        onClick={this.saveGraphicLogs}
                    >
                        {this.state.saving
                            ? 'Saving...'
                            : 'Save'}
                    </button>

                    <span>
                        {active
                            ? 'Active: ' + active.graphicid
                            : 'No active graphic (typing creates one)'}
                    </span>

                    {this.state.dirty && (
                        <strong style={{ marginLeft: 8 }}>
                            Unsaved changes
                        </strong>
                    )}

                </div>

                {/* ==================================
                    STATUS
                   ================================== */}

                {this.state.error && (
                    <div
                        role="alert"
                        style={{ color: '#b00020' }}
                    >
                        {this.state.error}
                    </div>
                )}

                {this.state.message && (
                    <div role="status">
                        {this.state.message}
                    </div>
                )}

                {/* ==================================
                    GRAPHIC LIBRARY
                   ================================== */}

                <div style={{
                    maxHeight: 360,
                    overflowY: 'auto'
                }}>

                    {graphics.map(graphic => {

                        const isActive =
                            this.state.activegraphicid ===
                            graphic.graphicid;

                        const isAssigned =
                            assignedId === graphic.graphicid;

                        return (

                            <div
                                key={graphic.graphicid}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 12,
                                    border: isActive
                                        ? '2px solid #b00020'
                                        : '1px solid #aaa',
                                    padding: 8,
                                    marginBottom: 8
                                }}
                            >

                                {/* THUMBNAIL */}

                                <div style={{
                                    flex: '0 0 110px'
                                }}>

                                    {graphic.graphiclog ? (

                                        <img
                                            src={this.imageUrl(
                                                graphic.graphicid
                                            )}
                                            alt={
                                                graphic.description ||
                                                graphic.code ||
                                                'Graphic log'
                                            }
                                            style={{
                                                width: 100,
                                                height: 100,
                                                objectFit: 'contain'
                                            }}
                                        />

                                    ) : (

                                        <div style={{
                                            width: 100,
                                            height: 100,
                                            background: '#f4f4f4',
                                            textAlign: 'center',
                                            paddingTop: 32,
                                            boxSizing: 'border-box'
                                        }}>
                                            No image
                                        </div>

                                    )}

                                </div>

                                {/* GRAPHIC ID AND INFORMATION */}

                                <div style={{
                                    flex: '1 1 230px',
                                    minWidth: 0,
                                    overflowWrap: 'anywhere'
                                }}>

                                    <button
                                        type="button"
                                        disabled={busy}
                                        onClick={() =>
                                            this.toggleActiveGraphic(
                                                graphic.graphicid
                                            )
                                        }
                                        style={{
                                            ...buttonStyle,
                                            fontWeight: isActive
                                                ? 'bold'
                                                : 'normal'
                                        }}
                                    >
                                        {graphic.graphicid}
                                    </button>

                                    <div>
                                        Code: {graphic.code || ''}
                                    </div>

                                    <div>
                                        Graphic Log: {graphic.graphiclog || '(no image)'}
                                    </div>

                                    <div>
                                        Description: {graphic.description || ''}
                                    </div>

                                </div>

                                {/* ASSIGN TO SAMPLE */}

                                <button
                                    type="button"
                                    style={buttonStyle}
                                    disabled={!sample || busy}
                                    onClick={() =>
                                        this.addToSample(
                                            graphic.graphicid
                                        )
                                    }
                                >
                                    {isAssigned
                                        ? 'Assigned to Sample'
                                        : 'Add to Sample'}
                                </button>

                            </div>
                        );
                    })}

                </div>

                {graphics.length === 0 &&
                    !this.state.loading && (
                        <p>
                            No graphics yet. Type a code to create one.
                        </p>
                    )}

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        company: state.company,
        projects: state.projects
    };
}

export default withRouter(
    connect(mapStateToProps, actions)(GraphicLogs)
);
