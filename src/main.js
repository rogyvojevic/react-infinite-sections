import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class InfiniteSections extends Component {
	constructor(props) {
		super(props);

		this.dispatcher = new Dispatcher();
	}

	render() {
		let {config} = this.props;

		return (
			<IS
				dispatcher={this.dispatcher}
				config={config(this.dispatcher.dispatch.bind(this.dispatcher))}
			/>
		);
	}
}

class IS extends Component {
	constructor(props) {
		super(props);

		this.state = {
			...props,
			previous: null,
			current: null
		};
		this.timeoutId = null;

		this.props.dispatcher.register((section, id, animation) => {
			this.getSectionElement(section, id, animation);
		});

		this.state.current = this.state.config.root;
	}

	getSectionElement(section, id, animation) {		
		let sectionElement = null;

		if (!animation || !animation.duration || !animation.transform) {
			animation = false;
		}

		if (section === 'root') {
			sectionElement = this.state.config.root;
		} else {
			sectionElement = doGetSection(this.state.config.sections[section], id, this.state.current);
		}

		clearTimeout(this.timeoutId);
		this.setState(Object.assign({}, this.state, {
			previous: this.state.current,
			current: sectionElement,
			animation
		}));
		

		function doGetSection(children, id, fallback) {
			let result = fallback;

			children.forEach(child => {
				if (child.id === id) {
					result = child;
				}
			});

			return result;
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.previous || nextState.previous;
	}

	componentDidUpdate() {
		if (this.state.animation) {
			if (!this.state.previous) {
				this.IS.children[0].style['transition'] = `none`;
				this.IS.children[0].style['transform'] = `translate3d(0, 0, 0)`;
			}

			if (this.state.previous && this.state.current) {
				for (let i = 0; i < this.IS.children.length; i++) {
					if (this.state.animation && this.state.animation.flip) {
						this.IS.children[i].style['transform'] = 'translate3d(-100%, 0, 0)';
					}

					onNextFrame(() => {
						this.IS.children[i].style['transition'] = `all ${this.state.animation.duration}ms ease`;
						this.IS.children[i].style['transform'] = this.state.animation.transform;
					});
				}
			}
		}
		
		this.timeoutId = setTimeout(() => {
			this.setState(Object.assign({}, this.state, {
				previous: null
			}));
		}, this.state.animation ? this.state.animation.duration : 0);
	}

	render() { 
		let previous = this.state.previous && this.state.previous.component;
		let current = this.state.current.component;
		let content = null;

		if (this.state.animation && this.state.animation.flip) {
			content = (
				<div style={{overflow: 'visible', whiteSpace: 'nowrap', overflow: 'hidden'}} ref={ref => this.IS = ref}>
					{current}
					{previous}
				</div>
			);
		} else {
			content = (
				<div style={{overflow: 'visible', whiteSpace: 'nowrap', overflow: 'hidden'}} ref={ref => this.IS = ref}>
					{previous}
					{current}
				</div>
			);
		}

		return (content);
	}
}

class Dispatcher {
	constructor() {
		this.callback = null;
	}

	register(callback) {
		this.callback = callback;
	}

	dispatch(section, id, animation) {
		return () => {
			this.callback(section, id, animation);
		}
	}
}

function onNextFrame(callback) {
    setTimeout(() => {
        window.requestAnimationFrame(callback);
    }, 20);
}