import React, {Component} from 'react';

export default class InfiniteSections extends Component {
	constructor() {
		super();

		this.state = {
			root: {
				id: 1,
				children: 'root',
				component: (
					<div>
						<h1>HELLO WORLD</h1>
						<ul>
							<li style={{color: '#fff', cursor: 'pointer'}} onClick={this.getChild('first', 11)}>left node</li>
							<li style={{color: '#fff', cursor: 'pointer'}} onClick={this.getChild('first', 12)}>right node</li>
						</ul>
					</div>
				)
			},
			components: {
				first: [
					{
						id: 11,
						parent: 'root',
						children: 'second',
						component: (
							<div>
								<div style={{color: '#fff', cursor: 'pointer'}} onClick={this.getParent()}>GO BACK</div>
								<h3>LEFT FIRST LEVEL NODE</h3>
								<ul>
									<li style={{color: '#fff', cursor: 'pointer'}} onClick={this.getChild('second', 111)}>left second level node</li>
								</ul>
							</div>
						)
					},
					{
						id: 12,
						parent: 'root',
						children: 'third',
						component: (
							<div>
								<div style={{color: '#fff', cursor: 'pointer'}} onClick={this.getParent()}>GO BACK</div>
								<h3>RIGHT FIRST LEVEL NODE</h3>
								<ul>
									<li style={{color: '#fff', cursor: 'pointer'}} onClick={this.getChild('third', 121)}>right second level node</li>
								</ul>
							</div>
						)
					}
				],
				second: [
					{
						id: 111,
						parent: 'first',
						parentId: 11,
						children: null,
						component: (
							<div>
								<div style={{color: '#fff', cursor: 'pointer'}} onClick={this.getParent()}>BACK TO LEVEL 2</div>
								<h3>FAST LEFT LEVEL 3</h3>
							</div>
						)
					}
				],
				third: [
					{
						id: 121,
						parent: 'first',
						parentId: 12,
						children: null,
						component: (
							<div>
								<div style={{color: '#fff', cursor: 'pointer'}} onClick={this.getParent()}>BACK TO LEVEL 2</div>
								<h3>FAST RIGHT LEVEL 3</h3>
							</div>
						)
					}
				]
			},
			current: null,
		};

		this.state.current = this.state.root;
	}

	getParent() {
		return () => {
			this.setState(Object.assign({}, this.state, {
				current: doGetParent(this.state, this.state.current)
			}));

			function doGetParent(config, current) {
				if (current.parent === 'root') {
					return config.root;
				} else {
					return doGetChild(config.components[current.parent], current.parentId, current);
				}
			}

			function doGetChild(children, id, fallback) {
				let result = fallback;

				children.forEach(child => {
					if (child.id === id) {
						result = child;
					}
				});

				return result;
			}
		}
	}

	getChild(section, id) {
		return () => {
			let child = doGetChild(this.state.components[section], id, this.state.current);

			this.setState(Object.assign({}, this.state, {
				current: child
			}));
		}

		function doGetChild(children, id, fallback) {
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
