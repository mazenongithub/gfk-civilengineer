import React from 'react';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import { sendIcon, plusIcon, minusIcon, createGradingReport, generateReportSection } from './svg';
import { AskOpenAI } from './actions/api';


class OpenAI {

    async sendRequest() {
        try {
            const question = this.state.question;
            this.setState({ loading: TextTrackCue })
            const result = await AskOpenAI(question);

            if (!result?.answer) {
                throw new Error('No answer was returned.');
            }

            this.setState({
                answer: result.answer,
                loading: false
            });

        } catch (err) {
            console.error('OpenAI request failed:', err);

            this.setState({
                error: err.message
            });
        }
    };




    toggleMenu() {
        this.setState(prevState => ({
            showOpenAI: !prevState.showOpenAI
        }));
    };



       generateReportSection() {

        const report = this.getReport();

        const styles = MyStylesheet();
        const gfk = new GFK();
        const regularFont = gfk.getRegularFont.call(this)

        const buttonWidth = { width: '10em' }


        if (report.type === 'Geotechnical Investigation Report' && !this.state.loading) {




            return (<div style={{ ...styles.generalContainer }}>

                <button className={`generalButton`} style={{ ...buttonWidth }} onClick={() => { this.generateReportSection() }}>{generateReportSection()}</button>
            </div>)



        } else if (this.state.loading) {
            return (<div style={{ ...styles.generalContainer }}><span style={{ ...regularFont }}>loading ...</span></div>)
        }

    }


    createGradingReport() {
        const styles = MyStylesheet();

        const buttonWidth = { width: '10em' }
        return (<div style={{ ...styles.generalContainer }}>

            <button className={`generalButton`} style={{ ...buttonWidth }} onClick={() => { this.generateGradingReport() }}>{createGradingReport()}</button>
        </div>)

    }



    showOpenAI() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const sendIconWidth = { width: '70px' }
        const smallIconWidth = { width: '32px' }
        const smallFont = gfk.getSmallFont.call(this)
        const openAI = new OpenAI();
        const getIcon = this.state.showOpenAI ? minusIcon() : plusIcon()

        const showSendButton = () => {
            if (!this.state.loading) {
                return (<button class={`generalButton`} style={{ ...sendIconWidth }} onClick={() => { openAI.sendRequest.call(this) }}>{sendIcon()}</button>)
            } else {
                return (<span style={{ ...smallFont }}>Loading ...</span>)
            }
        }

        const showInput = () => {
            if (this.state.showOpenAI) {
                return (<div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>

                    <div style={{ ...styles.generalFlex }}>


                        <div style={{ ...styles.flex5 }}>

                            <input type="text" style={{ ...styles.generalField }}
                                value={this.state.question}
                                onChange={event => { this.setState({ question: event.target.value }) }} />


                        </div>
                        <div style={{ ...styles.flex1 }}>
                            {showSendButton()}
                        </div>
                    </div>

                    <div
                        style={{
                            ...styles.generalContainer,
                            maxHeight: '300px',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            width: '100%',
                            maxWidth: '100%',
                            minWidth: 0,
                            boxSizing: 'border-box',
                            overflowWrap: 'anywhere',
                            whiteSpace: 'pre-wrap',
                            padding: '10px'
                        }}
                    >
                        <div style={{ ...smallFont }}>
                            <strong>Answer:</strong>
                            <div>{this.state.answer}</div>
                        </div>
                    </div>

                </div>)
            } else {

                return (<div>&nbsp;</div>)
            }
        }
        return (

            <div style={{ ...styles.generalContainer, ...styles.generalFont }}>

                <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                    <span style={{ ...smallFont, ...styles.generalFont }}>   <button class={`generalButton`} style={{ ...smallIconWidth }} onClick={() => { openAI.toggleMenu.call(this) }}>{getIcon}</button> Ask OpenAI a question: </span>
                </div>

                {showInput()}



            </div>)
    }

}

export default OpenAI;