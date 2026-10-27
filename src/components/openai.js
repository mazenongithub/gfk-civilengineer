import React from 'react';
import GFK from './gfk';
import { MyStylesheet } from './styles';
import { sendIcon, plusIcon, minusIcon } from './svg';
import { AskOpenAI } from './actions/api';

class OpenAI {

    async sendRequest() {
        const question = this.state.question?.trim();

        if (!question || this.state.loading) {
            return;
        }

        try {
            this.setState({
                loading: true,
                error: ''
            });

            const getanswer = await AskOpenAI(question);

            if (!getanswer || !getanswer.answer) {
                throw new Error('No answer was returned by OpenAI.');
            }

            this.setState({
                answer: getanswer.answer,
                loading: false
            });

        } catch (err) {
            console.error('OpenAI request failed:', err);

            this.setState({
                loading: false,
                error: err.message || 'Unable to get a response from OpenAI.'
            });
        }
    };


    toggleMenu() {
        this.setState(prevState => ({
            showOpenAI: !prevState.showOpenAI
        }));
    };



    showOpenAI() {
        const styles = MyStylesheet();
        const gfk = new GFK();
        const sendIconWidth = { width: '70px' }
        const smallIconWidth = { width: '32px' }
        const regularFont = gfk.getRegularFont.call(this)
        const smallFont = gfk.getSmallFont.call(this)
        const openAI = new OpenAI();
        const getIcon = this.state.showOpenAI ? minusIcon() : plusIcon()

        const showSendButton = () => {
            if(!this.state.loading) {
                return(<button class={`generalButton`} style={{ ...sendIconWidth }} onClick={() => { openAI.sendRequest.call(this) }}>{sendIcon()}</button>)
            } else {
                return(<span style={{...smallFont}}>Loading ...</span>)
            }
        }

        const showInput = () => {
            if(this.state.showOpenAI) {
                return( <div style={{ ...styles.generalContainer, ...styles.bottomMargin15}}>

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

                    <div style={{ ...styles.generalContainer }}>

                        <span style={{ ...smallFont }}>Answer:{this.state.answer}</span>
                    </div>

                </div>)
            } else {

                return(<div>&nbsp;</div>)
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