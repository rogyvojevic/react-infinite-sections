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

ReactDOM.render(is, document.getElementById('app'));