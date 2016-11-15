import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import InfiniteSections from '../src/main.js';

import './css/main.scss';

let basicWithAnimation = (
	<InfiniteSections
		className="settings-wrapper"
		animate={true}
		root={{section: 'root', id: 'rootSettings'}}
		sections={dispatch => {
			return {
				root: [
					{
						id: 'rootSettings',
						component: (
							<div className="section-wrapper">
								<div className="header">Settings</div>
								<ul className="list">
									<li className="link" onClick={dispatch('settings', 'font')}>Font</li>
								</ul>
							</div>	
						)
					}
				],
				settings: [
					{
						id: 'font',
						component: (
							<div className="section-wrapper">
								<div className="header link" onClick={dispatch('root', 'rootSettings', true)}>Back</div>
								<div className="font-settings-content">All options for font...</div>
							</div>
						)
					}
				]
			};
		}}
	/>	
);

class FontSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: 123
		};
	}

	updateValue(event) {
		this.setState(Object.assign({}, this.state, {value: event.target.value}));
	}

	render() {
		return (
			<InfiniteSections
				className="settings-wrapper"
				animate={true}
				root={{section: 'settings', id: 'font'}}
				sections={dispatch => {
					return {
						root: [
							{
								id: 'rootSettings',
								component: (
									<div className="section-wrapper">
										<div className="header">Settings</div>
										<ul className="list">
											<li className="link" onClick={dispatch('settings', 'font')}>Font</li>
										</ul>
									</div>	
								)
							}
						],
						settings: [
							{
								id: 'font',
								component: (
									<div className="section-wrapper">
										<div className="header link" onClick={dispatch('root', 'rootSettings', true)}>Back</div>
										<div className="font-settings-content">
											<span>Font size: </span>
											<input type="number" onChange={this.updateValue.bind(this)} value={this.state.value} />
										</div>
									</div>
								)
							}
						]
					};
				}}
			/>
		);
	}
}

ReactDOM.render(basicWithAnimation, document.getElementById('app'));