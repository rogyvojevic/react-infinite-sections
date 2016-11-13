import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Root, Root_ChildLeft, Root_ChildRight, Root_ChildLeft_Child, Root_ChildRight_Child } from './components';
import InfiniteSections from '../src/main.js';

import './css/main.scss';

let is = (
    <InfiniteSections
        config={dispatch => {
            return {
                root: {
                    id: 1,
                    component: (<Root dispatch={dispatch} />)
                },
                sections: {
                    first: [
                        {
                            id: 11,
                            component: Root_ChildLeft(null, dispatch)
                        },
                        {
                            id: 12,
                            component: Root_ChildRight(null, dispatch)
                        }
                    ],
                    second: [
                        {
                            id: 111,
                            component: Root_ChildLeft_Child(null, dispatch)
                        }
                    ],
                    third: [
                        {
                            id: 121,
                            component: Root_ChildRight_Child(null, dispatch)
                        }
                    ]
                }
            };
        }}
    />
);

// Basic example no animations

const header = {
    width: '100%',
    height: '5%',
    backgroundColor: '#263238',
    color: '#ECEFF1',
    fontSize: '20px',
    lineHeight: '20px',
    padding: '0 10px',
    boxSizing: 'border-box'
}

const list = {
    margin: '10px',
    padding: '5px 10px',
    fontSize: '17px',
    backgroundColor: '#ECEFF1',
    listStyleType: 'none',
    boxSizing: 'border-box'
};

const link = {
    cursor: 'pointer'
};

const fontSettingsContent = {
    padding: '20px',
    boxSizing: 'border-box'
};

let settings = (
    <InfiniteSections
		className="settings-wrapper"
		animate={true}
		onStart={(previous, current) => console.log(`start: ${previous.section} - ${current.section}`)}
		onDone={(previous, current) => console.log(`done: ${previous.section} - ${current.section}`)}
        config={dispatch => {
            return {
                root: {
                    id: 'root',
                    component: (
                        <div className="wrapper">
                            <div style={header}>Settings</div>
                            <ul style={list}>
                                <li style={link} onClick={dispatch('settings', 'font')}>Font</li>
                            </ul>
                        </div>
                    )
                },
                sections: {
                    settings: [
                        {
                            id: 'font',
                            component: (
                                <div className="wrapper">
                                    <div style={{...link, ...header}} onClick={dispatch('root', null, true)}>Back</div>
                                    <div style={fontSettingsContent}>All options for font...</div>
                                </div>
                            )
                        }
                    ]
                }
            };
        }}
    />
);

class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				{settings}
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));