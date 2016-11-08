import React, {Component} from 'react';

export default function InfiniteSections(config) {
	let dispatcher = new Dispatcher();

	function getReactComponent() {
		return React.createElement(IS, {dispatcher, config: config(dispatcher.dispatch.bind(dispatcher))});
	}

	return {
		getReactComponent
	};
}

class IS extends Component {
	constructor(props) {
		super(props);

		this.state = {
			...props,
			current: null
		};

		this.props.dispatcher.register((section, id) => {
			this.getSection(section, id);
		});

		this.state.current = this.state.config.root;
	}

	getSection(section, id) {		
		let newSection = null;

		if (section === 'root') {
			newSection = this.state.config.root;
		} else {
			newSection = doGetSection(this.state.config.components[section], id, this.state.current);
		}

		this.setState(Object.assign({}, this.state, {
			current: newSection
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

	render() {
		let component = this.state.current.component;
		return (component);
	}
}

class Dispatcher {
	constructor() {
		this.callback = null;
	}

	register(callback) {
		this.callback = callback;
	}

	dispatch(section, id) {
		return () => {
			this.callback(section, id);
		}
	}
}
