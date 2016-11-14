import React, {Component} from 'react';

const classes = {
	startPrevious: 'is-start__previous',
	startCurrent: 'is-start__current',

	animatePrevious: 'is-animate__previous',
	animateCurrent: 'is-animate__current',

	startPreviousInverse: 'is-start__previous--inverse',
	startCurrentInverse: 'is-start__current--inverse',

	animatePreviousInverse: 'is-animate__previous--inverse',
	animateCurrentInverse: 'is-animate__current--inverse',

	end: 'is-end'
};

export default class InfiniteSections extends Component {
	constructor(props) {
		super(props);

		this.dispatcher = new Dispatcher();
	}

	render() {
		let {style, className, sections, root, animate, duration, onStart, onDone} = this.props;
		let disableNavigationWhileAnimating = true;

		if (this.props.disableNavigationWhileAnimating === false) {
			disableNavigationWhileAnimating = false;
		}

		return (
			<IS
				className={className}
				style={style}
				dispatcher={this.dispatcher}
				animate={animate}
				duration={duration}
				disableNavigationWhileAnimating={disableNavigationWhileAnimating}
				onStart={isFunction(onStart) ? onStart : null}
				onDone={isFunction(onDone) ? onDone : null}
				root={root}
				sections={sections(this.dispatcher.dispatch.bind(this.dispatcher))}
			/>
		);
	}
}

InfiniteSections.propTypes = {
	root: React.PropTypes.shape({
		section: React.PropTypes.string.isRequired,
		id: React.PropTypes.string.isRequired
	}),
	sections: React.PropTypes.func.isRequired
};

class IS extends Component {
	constructor(props) {
		super(props);

		this.state = {
			...props,
			previous: null,
			current: null
		};

		this.isAnimating = false;
		this.timeoutId = null;
		this.inverse = null;
		this.state.current = getCurrent(this.state.sections[this.props.root.section], this.props.root.id);

		this.previousData = null;
		this.currentData = this.props.root;

		this.props.dispatcher.register((section, id, inverse) => {
			if (this.isAnimating && this.props.disableNavigationWhileAnimating) {
				return;	
			}

			this.inverse = inverse;
			this.updateState(section, id);
		});
	}

	updateState(section, id) {		
		let current = null;

		if (this.state.sections) {
			if (this.state.sections[section] && id) {
				current = getCurrent(this.state.sections[section], id, this.state.current);
			} else {
				throw new Error(`Trying to access sections['${section}']' with id ${id}`);
			}
		} else {
			throw new Error(`Missing sections object`);
		}
		
		clearTimeout(this.timeoutId);

		if (this.props.onStart) {
			this.previousData = { section: this.currentData.section, id: this.currentData.id };
			this.currentData = { section, id }

			this.props.onStart(this.previousData, this.currentData);
		}

		
		this.setState(Object.assign({}, this.state, {
			previous: this.state.current,
			current
		}));
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.previous || nextState.previous;
	}

	componentDidUpdate() {
		if (this.props.animate && this.previousElement && this.currentElement) {

			removeClasses(this.previousElement, Object.keys(classes).map(key => classes[key]));
			removeClasses(this.currentElement, Object.keys(classes).map(key => classes[key]));

			if (this.inverse) {
				let {startPreviousInverse, startCurrentInverse, animatePreviousInverse, animateCurrentInverse} = classes; 

				addClasses(this.previousElement, [startPreviousInverse, animatePreviousInverse]);
				addClasses(this.currentElement, [startCurrentInverse, animateCurrentInverse]);
				
			} else {
				let {startPrevious, startCurrent, animatePrevious, animateCurrent} = classes;
				
				addClasses(this.previousElement, [startPrevious, animatePrevious]);
				addClasses(this.currentElement, [startCurrent, animateCurrent]);
			}
		}

		if (!this.state.previous && this.state.current) {
			this.props.onDone && this.props.onDone(this.previousData, this.currentData);
		}
		
		this.isAnimating = true;
		this.timeoutId = setTimeout(() => {
			this.setState(Object.assign({}, this.state, {
				previous: null
			}));
			this.isAnimating = false;
		}, this.props.duration ? this.props.duration : getLongerDuration(this.previousElement, this.currentElement));
	}

	render() { 
		let { style, className, animate } = this.props;
		let previous = this.state.previous && this.state.previous.component;
		let current = this.state.current.component;
		let content = null;

		if (animate && previous) {			
			previous = React.cloneElement(previous, { ref: ref => { this.previousElement = ref }, key: 1 });
			current = React.cloneElement(current, { ref: ref => { this.currentElement = ref }, key: 2 });

			content = (
				<div className={className} style={style} ref={ref => this.IS = ref}>
					{previous}
					{current}
				</div>
			);

		} else {
			current = React.cloneElement(current, { ref: ref => { this.currentElement = ref }, className: `${current.props.className} ${classes.end}`, key: 1 });

			content = (
				<div className={className} style={style} ref={ref => this.IS = ref}>
					{current}
				</div>
			);
		}
				
		return (content);
	}
}

IS.propTypes = {
	sections: React.PropTypes.objectOf((propValue, key, componentName, location, propFullName) => {
		let fail = false;
		let failDescription = null;

		if ((propValue[key].constructor === Array) && propValue[key].length) {
			propValue[key].forEach((section) => {
				if (!section.id) {
					fail = true;
					failDescription = 'Missing id.'
				} else if (!section.component && !React.isValidElement(section.component)) {
					failDescription = 'Missing component.'
				}
			});
		} else {
			fail = true;
		}

		if (fail) {
			return new Error(
				`Invalid prop ${propFullName} supplied to ${componentName}. ${failDescription} Validation failed.`
			);
		}
	})
};

class Dispatcher {
	constructor() {
		this.callback = null;
	}

	register(callback) {
		this.callback = callback;
	}

	dispatch(section, id, inverse) {
		return () => {
			this.callback(section, id, !!inverse);
		}
	}
}

function addClasses(element, classNames) {
	classNames.forEach(className => {
		element.clientHeight;
		element.classList.add(className);
	});
}

function removeClasses(element, classNames) {
	classNames.forEach(className => {
		element.classList.remove(className);
	});
}

function getLongerDuration(element_1, element_2) {
	let elem_1_duration = getElementDuration(element_1);
	let elem_2_duration = getElementDuration(element_2);

	return elem_1_duration > elem_2_duration ? elem_1_duration : elem_2_duration;
}

function getElementDuration(element) {
	let duration = 0;
	let possibleMatch;

	if (element) {
		possibleMatch = getComputedStyle(element)['transition-duration'].match(/([0-9]*\.[0-9]+|[0-9]+)(ms|s)/i);

		if (possibleMatch[1] && possibleMatch[2]) {
			if (possibleMatch[2].toLowerCase() === 's') {
				duration = parseFloat(possibleMatch[1]) * 1000;
			} else {
				duration = possibleMatch[1];
			}
		}
	}

	return duration;
}

function isFunction(object) {
	return !!(object && object.constructor && object.call && object.apply);
}

function getCurrent(children, id, fallback = null) {
	let result = fallback;

	children.forEach(child => {
		if (child.id === id) {
			result = child;
		}
	});

	return result;
}