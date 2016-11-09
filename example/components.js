import React, { Component } from 'react';

const style = {
    wrapper: {
        backgroundColor: 'black',
        color: 'white',
        display: 'inline-block',
        width: '100%',
        heigth: '100%',
        position: 'relative',
        transform: 'translate3d(0, 0, 0)'
    },
    title: {
        textAlign: 'center'
    }
}

const animationNext = {
    transition: 'all 500ms ease',
    transform: 'translate3d(-100%, 0, 0)'
};

const animationBack = {
    flip: true,
    transition: 'all 500ms ease',
    transform: 'translate3d(0, 0, 0)'
};

export class Root extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {dispatch} = this.props;

        return (
            <div style={style.wrapper}>
                <h1 style={style.title}>HELLO WORLD</h1>
                <ul>
                    <li style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('first', 11, animationNext)}>left node</li>
                    <li style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('first', 12, animationNext)}>right node</li>
                </ul>
            </div>
        );
    } 
};

export const Root_ChildLeft = (props, dispatch) => {
    return (
        <div style={style.wrapper}>
            <div style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('root', null, animationBack)}>GO BACK</div>
            <h1>LEFT FIRST LEVEL NODE</h1>
            <ul>
                <li style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('second', 111, animationNext)}>left second level node</li>
            </ul>
        </div>
    );
};

export const Root_ChildRight = (props, dispatch) => {
    return (
        <div style={style.wrapper}>
            <div style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('root', null, animationBack)}>GO BACK</div>
            <h1>RIGHT FIRST LEVEL NODE</h1>
            <ul>
                <li style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('third', 121, animationNext)}>right second level node</li>
            </ul>
        </div>
    );
};

export const Root_ChildLeft_Child = (props, dispatch) => {
    return (
        <div style={style.wrapper}>
            <div style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('first', 11, animationBack)}>BACK TO LEVEL 2</div>
            <h1>FAST LEFT LEVEL 3</h1>
        </div>
    );
}

export const Root_ChildRight_Child = (props, dispatch) => {
    return (
        <div style={style.wrapper}>
            <div style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('first', 12, animationBack)}>BACK TO LEVEL 2</div>
            <h1>FAST RIGHT LEVEL 3</h1>
        </div>
    );
};