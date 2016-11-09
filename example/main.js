import React from 'react';
import ReactDOM from 'react-dom';

import { Root, Root_ChildLeft, Root_ChildRight, Root_ChildLeft_Child, Root_ChildRight_Child } from './components';
import InfiniteSections from '../src/main.js';

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

const wrapper = {
    backgroundColor: '#607D8B',
    width: '100%',
    height: '100%',
    display: 'inline-block',
    position: 'relative',
    verticalAlign: 'top',
};

const header = {
    width: '100%',
    height: '5%',
    backgroundColor: '#263238',
    color: '#ECEFF1',
    fontSize: '25px',
    lineHeight: '45px',
    padding: '0 10px',
    boxSizing: 'border-box'
}

const list = {
    margin: '10px',
    padding: '5px 10px',
    fontSize: '20px',
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

const animationNext = {
    transform: 'translate3d(-100%, 0, 0)',
    duration: 500
};

const animationBack = {
    flip: true,
    duration: 500,
    transform: 'translate3d(0, 0, 0)'
};

let settings = (
    <InfiniteSections
        config={dispatch => {
            return {
                root: {
                    id: 'root',
                    component: (
                        <div style={wrapper}>
                            <div style={header}>Settings</div>
                            <ul style={list}>
                                <li style={link} onClick={dispatch('settings', 'font', animationNext)}>Font</li>
                            </ul>
                        </div>
                    )
                },
                sections: {
                    settings: [
                        {
                            id: 'font',
                            component: (
                                <div style={wrapper}>
                                    <div style={{...link, ...header}} onClick={dispatch('root', null, animationBack)}>Back</div>
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

ReactDOM.render(settings, document.getElementById('app'));