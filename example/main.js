import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteSections from '../src/main.js';

let is = InfiniteSections((dispatch) => {
	return {
		root: {
			id: 1,
			component: (
				<div>
					<h1>HELLO WORLD</h1>
					<ul>
						<li style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('first', 11)}>left node</li>
						<li style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('first', 12)}>right node</li>
					</ul>
				</div>
			)
		},
		components: {
			first: [
				{
					id: 11,
					component: (
						<div>
							<div style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('root')}>GO BACK</div>
							<h3>LEFT FIRST LEVEL NODE</h3>
							<ul>
								<li style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('second', 111)}>left second level node</li>
							</ul>
						</div>
					)
				},
				{
					id: 12,
					component: (
						<div>
							<div style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('root')}>GO BACK</div>
							<h3>RIGHT FIRST LEVEL NODE</h3>
							<ul>
								<li style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('third', 121)}>right second level node</li>
							</ul>
						</div>
					)
				}
			],
			second: [
				{
					id: 111,
					component: (
						<div>
							<div style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('first', 11)}>BACK TO LEVEL 2</div>
							<h3>FAST LEFT LEVEL 3</h3>
						</div>
					)
				}
			],
			third: [
				{
					id: 121,
					component: (
						<div>
							<div style={{color: '#fff', cursor: 'pointer'}} onClick={dispatch('first', 12)}>BACK TO LEVEL 2</div>
							<h3>FAST RIGHT LEVEL 3</h3>
						</div>
					)
				}
			]
		},
	};
});

ReactDOM.render(is.getReactComponent(), document.getElementById('app'));