import React, {Component} from 'react';

const MAX_INPUT_LENGTH = 32

class TextField extends Component {
	constructor(oProps) {
		super(oProps)
		this.state = {value: ''}
		this.onChange = this.onChange.bind(this)
	}
	onChange(oEvent) {
		var s = oEvent.target.value.replace(/[^0-9a-z]/gi, '').substr(0, MAX_INPUT_LENGTH)
		this.setState({value: s})
	}
	componentDidMount() {
		this._oInput.focus()
	}
	getValue() {
		return this.state.value
	}
	render() {
		return <input
			ref       = {(o) => this._oInput = o}
			value     = {this.state.value}
			type      = "text"
			className = "TextField"
			maxLength = {MAX_INPUT_LENGTH}
			onChange  = {this.onChange} />
	}
}

export default TextField