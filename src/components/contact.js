
import React, { Component } from 'react';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import { SaveContactUs } from './actions/api';

class Contact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            fullname: '',
            company: '',
            emailaddress: '',
            description: '',
            captchaToken: null,
            sending: false,
            message: '',
            success: false
        };

        this.turnstileWidgetId = null;
        this.updateWindowDimensions =
            this.updateWindowDimensions.bind(this);
        this.saveContactUs =
            this.saveContactUs.bind(this);
    }

    componentDidMount() {
        window.addEventListener(
            'resize',
            this.updateWindowDimensions
        );

        this.updateWindowDimensions();

        this.renderTurnstile();
    }

    componentWillUnmount() {
        window.removeEventListener(
            'resize',
            this.updateWindowDimensions
        );

        if (
            window.turnstile &&
            this.turnstileWidgetId !== null
        ) {
            window.turnstile.remove(
                this.turnstileWidgetId
            );
        }
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    renderTurnstile() {
        if (
            !window.turnstile ||
            this.turnstileWidgetId !== null
        ) {
            return;
        }

        const container = document.getElementById(
            'turnstile-container'
        );

        if (!container) return;

        this.turnstileWidgetId =
            window.turnstile.render(container, {
                sitekey:
                    process.env.REACT_APP_TURNSTILE_SITE_KEY,

                callback: token => {
                    this.setState({
                        captchaToken: token
                    });
                },

                'expired-callback': () => {
                    this.setState({
                        captchaToken: null
                    });
                },

                'error-callback': () => {
                    this.setState({
                        captchaToken: null
                    });
                },

                theme: 'light'
            });
    }

    setField(field, value) {
        this.setState({
            [field]: value,
            message: '',
            success: false
        });
    }

    async saveContactUs(event) {
        event.preventDefault();

        const {
            fullname,
            company,
            emailaddress,
            description,
            captchaToken
        } = this.state;

        if (
            !fullname.trim() ||
            !emailaddress.trim() ||
            !description.trim()
        ) {
            this.setState({
                message: 'Please complete all required fields.',
                success: false
            });
            return;
        }

        if (!captchaToken) {
            this.setState({
                message: 'Please complete the security verification.',
                success: false
            });
            return;
        }

        this.setState({
            sending: true,
            message: ''
        });

        try {
            const values = {
                fullname: fullname.trim(),
                company: company.trim(),
                emailaddress: emailaddress.trim(),
                description: description.trim(),
                captchaToken,

                // Preserve compatibility with existing API.
                phonenumber: '',
                lab: false,
                liquefaction: false,
                logdraft: false,
                field: false,
                ptslab: false,
                slope: false,
                reports: false,
                invoice: false
            };

            await SaveContactUs(values);

            this.setState({
                fullname: '',
                company: '',
                emailaddress: '',
                description: '',
                sending: false,
                success: true,
                message:
                    'Thank you for contacting GFK. Your message has been received. We will get back to you as soon as possible.',
                captchaToken: null
            });

            if (
                window.turnstile &&
                this.turnstileWidgetId !== null
            ) {
                window.turnstile.reset(
                    this.turnstileWidgetId
                );
            }

        } catch (err) {
            console.error('Contact form error:', err);

            this.setState({
                sending: false,
                success: false,
                message:
                    'Unable to send your message. Please try again.'
            });

            if (
                window.turnstile &&
                this.turnstileWidgetId !== null
            ) {
                window.turnstile.reset(
                    this.turnstileWidgetId
                );
            }

            this.setState({
                captchaToken: null
            });
        }
    }

    render() {
        const gfk = new GFK();
        const styles = MyStylesheet();

        const headerFont =
            gfk.getWebHeaderFont.call(this);

        const regularFont =
            gfk.getWebFont.call(this);

        const isMobile = this.state.width < 700;

        const colors = {
            primary: '#6A7EA6',
            primaryDark: '#4C6088',
            background: '#F0F3F8',
            white: '#FFFFFF',
            dark: '#303845',
            muted: '#657084',
            border: '#DCE3EE'
        };

        const fieldStyle = {
            ...regularFont,
            width: '100%',
            boxSizing: 'border-box',
            padding: '13px 15px',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            fontSize: '16px',
            color: colors.dark,
            background: colors.white,
            outlineColor: colors.primary
        };

        const labelStyle = {
            ...regularFont,
            display: 'block',
            fontSize: '14px',
            fontWeight: 'bold',
            color: colors.dark,
            marginBottom: '9px'
        };

        const fieldGroup = {
            marginBottom: '22px'
        };

        const {
            fullname,
            company,
            emailaddress,
            description,
            captchaToken,
            sending,
            message,
            success
        } = this.state;

        return (
            <main
                style={{
                    ...styles.generalContainer,
                    ...styles.generalFont,
                    width: '100%',
                    boxSizing: 'border-box',
                    color: colors.dark
                }}
            >
                {/* PAGE HEADER */}

                <section
                    style={{
                        maxWidth: '850px',
                        margin: 'auto',
                        padding: isMobile
                            ? '40px 18px 30px'
                            : '65px 30px 40px',
                        textAlign: 'center'
                    }}
                >
                    <div
                        style={{
                            color: colors.primary,
                            letterSpacing: '2px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            marginBottom: '18px'
                        }}
                    >
                        CIVILENGINEER.IO | GFK
                    </div>

                    <h1
                        style={{
                            ...headerFont,
                            fontSize: isMobile
                                ? '30px'
                                : '42px',
                            fontWeight: 'bold',
                            lineHeight: 1.2,
                            color: colors.dark,
                            margin: '0 0 20px'
                        }}
                    >
                        Contact Us
                    </h1>

                    <p
                        style={{
                            ...regularFont,
                            fontSize: isMobile
                                ? '16px'
                                : '18px',
                            color: colors.muted,
                            lineHeight: 1.8,
                            margin: 'auto',
                            maxWidth: '680px'
                        }}
                    >
                        Have questions about GFK or how
                        it can support your geotechnical
                        engineering workflow?

                        Send us a message. We'd be happy
                        to hear from you.
                    </p>
                </section>

                {/* CONTACT FORM */}

                <section
                    style={{
                        background: colors.background,
                        padding: isMobile
                            ? '25px 15px 50px'
                            : '45px 25px 75px',
                        borderTop:
                            `1px solid ${colors.border}`
                    }}
                >
                    <div
                        style={{
                            background: colors.white,
                            maxWidth: '650px',
                            margin: 'auto',
                            padding: isMobile
                                ? '25px 20px'
                                : '40px 45px',
                            borderRadius: '10px',
                            border:
                                `1px solid ${colors.border}`,
                            borderTop:
                                `4px solid ${colors.primary}`,
                            boxShadow:
                                '0 8px 30px rgba(40,55,80,0.05)',
                            boxSizing: 'border-box'
                        }}
                    >
                        <form
                            onSubmit={this.saveContactUs}
                        >
                            {/* NAME */}

                            <div style={fieldGroup}>
                                <label
                                    htmlFor="contact-fullname"
                                    style={labelStyle}
                                >
                                    Full Name *
                                </label>

                                <input
                                    id="contact-fullname"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    maxLength={150}
                                    value={fullname}
                                    onChange={event =>
                                        this.setField(
                                            'fullname',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Your full name"
                                    style={fieldStyle}
                                />
                            </div>

                            {/* EMAIL */}

                            <div style={fieldGroup}>
                                <label
                                    htmlFor="contact-email"
                                    style={labelStyle}
                                >
                                    Email Address *
                                </label>

                                <input
                                    id="contact-email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    maxLength={254}
                                    value={emailaddress}
                                    onChange={event =>
                                        this.setField(
                                            'emailaddress',
                                            event.target.value
                                        )
                                    }
                                    placeholder="you@company.com"
                                    style={fieldStyle}
                                />
                            </div>

                            {/* COMPANY */}

                            <div style={fieldGroup}>
                                <label
                                    htmlFor="contact-company"
                                    style={labelStyle}
                                >
                                    Company
                                    <span
                                        style={{
                                            fontWeight: 'normal',
                                            color: colors.muted
                                        }}
                                    >
                                        {' '}(Optional)
                                    </span>
                                </label>

                                <input
                                    id="contact-company"
                                    type="text"
                                    autoComplete="organization"
                                    maxLength={200}
                                    value={company}
                                    onChange={event =>
                                        this.setField(
                                            'company',
                                            event.target.value
                                        )
                                    }
                                    placeholder="Engineering firm or organization"
                                    style={fieldStyle}
                                />
                            </div>

                            {/* MESSAGE */}

                            <div style={fieldGroup}>
                                <label
                                    htmlFor="contact-description"
                                    style={labelStyle}
                                >
                                    How can we help? *
                                </label>

                                <textarea
                                    id="contact-description"
                                    required
                                    maxLength={5000}
                                    value={description}
                                    onChange={event =>
                                        this.setField(
                                            'description',
                                            event.target.value
                                        )
                                    }
                                    placeholder={
                                        'Tell us about your questions, ' +
                                        'engineering workflow, or how ' +
                                        'you would like to use GFK...'
                                    }
                                    style={{
                                        ...fieldStyle,
                                        fontFamily: 'Arial, Helvetica, sans-serif',
                                        fontSize: '16px',
                                        fontWeight: '400',
                                        minHeight: '165px',
                                        resize: 'vertical',
                                        lineHeight: 1.7
                                    }}
                                />
                            </div>

                            {/* TURNSTILE */}

                            <div
                                id="turnstile-container"
                                style={{
                                    marginBottom: '25px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            />

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={
                                    !captchaToken ||
                                    sending
                                }
                                style={{
                                    width: '100%',
                                    padding: '15px 20px',
                                    background:
                                        colors.primary,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor:
                                        captchaToken && !sending
                                            ? 'pointer'
                                            : 'not-allowed',
                                    opacity:
                                        captchaToken && !sending
                                            ? 1
                                            : 0.55
                                }}
                            >
                                {sending
                                    ? 'Sending Message...'
                                    : 'Send Message'}
                            </button>

                            {/* RESPONSE */}

                            {message && (
                                <div
                                    role="status"
                                    aria-live="polite"
                                    style={{
                                        marginTop: '20px',
                                        padding: '15px',
                                        borderRadius: '6px',
                                        background: success
                                            ? '#EDF7EF'
                                            : '#FFF0F0',
                                        color: success
                                            ? '#276738'
                                            : '#A33B3B',
                                        fontSize: '14px',
                                        lineHeight: 1.6,
                                        textAlign: 'center'
                                    }}
                                >
                                    {message}
                                </div>
                            )}

                            <p
                                style={{
                                    ...regularFont,
                                    fontSize: '12px',
                                    lineHeight: 1.6,
                                    color: colors.muted,
                                    textAlign: 'center',
                                    margin: '20px 0 0'
                                }}
                            >
                                Your information will be
                                used to respond to your inquiry.
                            </p>
                        </form>
                    </div>
                </section>
            </main>
        );
    }
}

export default Contact;
