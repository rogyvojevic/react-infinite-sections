import React, {Component} from 'react';

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
			if (this.state.config.sections) {
				if (this.state.config.sections[section] && id) {
					sectionElement = doGetSection(this.state.config.sections[section], id, this.state.current);
				} else {
					throw new Error(`Trying to access sections['${section}']' with id ${id}`);
				}
			} else {
				throw new Error(`Missing sections object`);
			}
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
			// Reset current component to original position
			if (!this.state.previous) {
				this.IS.children[0].style['transition'] = `none`;
				this.IS.children[0].style['transform'] = `translate3d(0, 0, 0)`;
			}

			// Animation logic
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
		
		// If animation is enabled this function will
		// execute after the animation is done
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
		
		let wrapperStyle = {
			overflow: 'visible',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			width: '100%',
			height: '100%'
		};

		// Checking if animation is enabled
		if (this.state.animation) {
			// Checking if navigatining to parent (flip)
			if (this.state.animation.flip) {
				content = (
					<div style={wrapperStyle} ref={ref => this.IS = ref}>
						{current}
						{previous}
					</div>
				);
			} else {
				content = (
					<div style={wrapperStyle} ref={ref => this.IS = ref}>
						{previous}
						{current}
					</div>
				);
			}
		} else {
			content = (
				<div style={wrapperStyle} ref={ref => this.IS = ref}>
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