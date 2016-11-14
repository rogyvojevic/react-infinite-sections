React Infinite Sections
=======================

Navigate through sections with animations. Define your own animations through CSS.

```sh
npm install react-infinite-sections --save
```

## Usage

#### Component options

**`sections`** (function, required)
Function to configure sections. Function can access **dispatch** method to render desired sections.
Always return object with sections. Oherwise error will occur.

**`dispatch`**
Function that will be passed to a **sections**. Main purpose of this function is to render a section.
Parameters:
- section (string, is required)
- id (string, is required)
- inverse (boolean, optional)

**`root`** (object, required)
Object to define start section.

**`animate`** (boolean, optional, default value is **false**)
Enable or disable animation.

**`duration`** (number, optional)
Before animation begins app logic will detect duration of the animation through CSS if it's given and valid.
If it's not given or valid it will be zero, this duration will determine how much app logic will **wait before another render cycle begin**.
That means that duration is **not gonna change CSS duration**.
Useful when you want to define previous section to go slow, and current section to go fast.
Must be in **miliseconds**


**`className`** (string, optional)
Define classes for a wrapper rendered by infinite sections.

**`style`** (object, optional)
Define object with CSS styles to apply styles on wrapper component rendered by infinite sections.

**`disableNavigationWhileAnimating`** (boolean, optional, default value is **true**)
Enable or disable navigation when animation is in porgress.
Useful but can reproduce unexpected behaviour if set to false (much depends on defined CSS).

**`onStart`** (function, optional)
Execute provided function when animation starts.

**`onEnd`** (function, optional)
Execute provided function when animation ends.

#### CSS classes


**`is-start__previous`**
Define start position for previous element

**`is-start__current`**
Define start position for current element

**`is-animate__previous`**
Define animation for previous element

**`is-animate__current`**
Define animation for current element


Flag **--inverse** is useful when navigating back.
If third parameter in **dispatch** method is **true**
every class will have **--inverse** flag.


**`is-start__previous--inverse`**
Define start position for previous inverse element

**`is-start__current--inverse`**
Define start position for current inverse element

**`is-animate__previous--inverse`**
Define animation for previous inverse element

**`is-animate__current--inverse`**
Define animation for current inverse element


`is-end` Define end position for current element

## Examples

#### Basic + Animation

`app.js`
```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import InfiniteSections from 'react-infinite-sections';

import './app.scss';

let basicWithAnimation = (
	<InfiniteSections
		className="settings-wrapper"
		animate={true}
		root={{section: 'root', id: 'rootSettings'}}
		sections={dispatch => {
			return {
				root: [
					{
						id: 'rootSettings',
						component: (
							<div className="section-wrapper">
								<div className="header">Settings</div>
								<ul className="list">
									<li className="link" onClick={dispatch('settings', 'font')}>Font</li>
								</ul>
							</div>	
						)
					}
				],
				settings: [
					{
						id: 'font',
						component: (
							<div className="section-wrapper">
								<div className="header link" onClick={dispatch('root', 'rootSettings', true)}>Back</div>
								<div className="font-settings-content">All options for font...</div>
							</div>
						)
					}
				]
			};
		}}
	/>	
);

ReactDOM.render(basicWithAnimation, document.getElementById('app'));
```

`app.scss`
```scss
/*These classes are only for a nicer look*/
.settings-wrapper {
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.header {
	width: 100%;
    height: 5%;
    background-color: #263238;
    color: #ECEFF1;
    font-size: 5vh;
    line-height: 5vh;
    padding: 0 10px;
    box-sizing: border-box;
}

.list {
	margin: 10px;
    padding: 5px 10px;
    font-size: 3.5vh;
    background-color: #ECEFF1;
    list-style-type: none;
    box-sizing: border-box;
}

.link {
	cursor: pointer;
}

.font-settings-content {
	padding: 20px;
    box-sizing: border-box;
}

.section-wrapper {
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: #607D8B;
}

/*These classes are responsible for animation*/
.is-start__current {
	left: 100%;
}

.is-animate__previous, .is-animate__current, .is-animate__previous--inverse, .is-animate__current--inverse {
	transition: all .5s ease;
}

.is-animate__previous, .is-animate__current {
	transform: translate3d(-100%, 0, 0);
}

.is-start__current--inverse {
	left: -100%;
}

.is-animate__previous--inverse, .is-animate__current--inverse {
	transform: translate3d(100%, 0, 0);
}
```

### Demo

[![react-infinite-sections.gif](http://gifyu.com/images/react-infinite-sections.gif)](http://gifyu.com/image/SMuj)
