
// Took 2hrs to complete

import React, { Component } from 'react'
import TextField from './TextField.js'
import './App.css'

const API_CALLBACK = 'api_callback'
const API_ENDPOINT = 'https://www.tapresearch.com/supply_api/surveys/offer'
const API_TOKEN    = '9a7fb35fb5e0daa7dadfaccd41bb7ad1'
const API_TIMEOUT  = 2000

class App extends Component {
    constructor(oProps) {
        super(oProps)

        this.onSubmit   = this.onSubmit.bind(this)
        this.onTimeout  = this.onTimeout.bind(this)
        this.onResponse = this.onResponse.bind(this)

        this.state = {
            offer     : '',
            offer_url : '',
            error     : ''
        }

        this._bResponseReceived = false // To handle the timeout scenario
    }

    onError(sError) {
        this.setState({
            offer          : 'No survey available',
            offer_url      : '',
            offer_url_text : '',
            error          : sError
        })
    }

    onTimeout() {
        if (!this._bResponseReceived) {
            this.onError('Timeout error')
        }
    }

    onResponse(oData) {
        this._bResponseReceived = true
        if (oData.has_offer) {
            var o = oData.message_hash

            this.setState({
                offer          : 'Reward: ' + o.min + '-' + o.max + ' ' + o.currency,
                offer_url      : oData.offer_url,
                offer_url_text : 'Take survey',
                error          : ''
            })
        } else {
            this.setState({
                offer          : 'No survey available',
                offer_url      : '',
                offer_url_text : '',
                error          : ''
            })
        }
        console.log(oData)
    }

    onSubmit() {
        var sUser = this._oTextField.getValue()
        if (sUser.replace(/\s/gi, '') === '') {
            this.onError('Username must not be empty')
        } else {
            window[API_CALLBACK] = this.onResponse
            var oScript = document.createElement('script')
            oScript.src = API_ENDPOINT + '?' + [
                'callback='        + API_CALLBACK,
                'api_token='       + API_TOKEN,
                'user_identifier=' + sUser
                ].join('&')

            document.body.append(oScript)
            this._bResponseReceived = false
            setTimeout(this.onTimeout, API_TIMEOUT)
        }
        return false // To prevent page refresh
    }

    componentDidMount() {
        this._oForm.onsubmit = this.onSubmit // Work around page refresh on form submit
    }

    render() {
        // Using form allows us to submit on Enter keypress in text field
        return (
            <div className="App">
                <a className="logo" href="https://www.tapresearch.com/" target="_blank"></a>
                <form ref={(o) => this._oForm = o}>
                    <TextField ref={(o) => this._oTextField = o}/>
                    <button className="btnSubmit" onClick={this.onSubmit}>GET SURVEY OFFER</button>
                    <div className="details">
                        <div className="offerText">{this.state.offer}</div>
                        <div className="offerError">{this.state.error}</div>
                        <a href={this.state.offer_url} className="offerUrl" target="_blank">{this.state.offer_url_text}</a>
                    </div>
                </form>
            </div>
        );
    }
}

export default App;
