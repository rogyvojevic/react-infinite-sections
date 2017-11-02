'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classes = {
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

var InfiniteSections = function (_Component) {
	_inherits(InfiniteSections, _Component);

	function InfiniteSections(props) {
		_classCallCheck(this, InfiniteSections);

		var _this = _possibleConstructorReturn(this, (InfiniteSections.__proto__ || Object.getPrototypeOf(InfiniteSections)).call(this, props));

		_this.dispatcher = new Dispatcher();
		return _this;
	}

	_createClass(InfiniteSections, [{
		key: 'render',
		value: function render() {
			var _props = this.props,
			    style = _props.style,
			    className = _props.className,
			    sections = _props.sections,
			    root = _props.root,
			    animate = _props.animate,
			    duration = _props.duration,
			    onStart = _props.onStart,
			    onDone = _props.onDone;

			var disableNavigationWhileAnimating = true;

			if (this.props.disableNavigationWhileAnimating === false) {
				disableNavigationWhileAnimating = false;
			}

			return _react2.default.createElement(IS, {
				className: className,
				style: style,
				dispatcher: this.dispatcher,
				animate: animate,
				duration: duration,
				disableNavigationWhileAnimating: disableNavigationWhileAnimating,
				onStart: isFunction(onStart) ? onStart : null,
				onDone: isFunction(onDone) ? onDone : null,
				root: root,
				sections: sections(this.dispatcher.dispatch.bind(this.dispatcher))
			});
		}
	}]);

	return InfiniteSections;
}(_react.Component);

exports.default = InfiniteSections;


InfiniteSections.propTypes = {
	root: _propTypes2.default.shape({
		section: _propTypes2.default.string.isRequired,
		id: _propTypes2.default.string.isRequired
	}),
	sections: _propTypes2.default.func.isRequired
};

var IS = function (_Component2) {
	_inherits(IS, _Component2);

	function IS(props) {
		_classCallCheck(this, IS);

		var _this2 = _possibleConstructorReturn(this, (IS.__proto__ || Object.getPrototypeOf(IS)).call(this, props));

		_this2.state = _extends({}, props, {
			previous: null,
			current: null
		});

		_this2.isAnimating = false;
		_this2.timeoutId = null;
		_this2.inverse = null;
		_this2.state.current = getSection(_this2.props.sections[_this2.props.root.section], _this2.props.root.id);

		_this2.previousData = null;
		_this2.currentData = _this2.props.root;

		_this2.props.dispatcher.register(function (section, id, inverse) {
			if (_this2.isAnimating && _this2.props.disableNavigationWhileAnimating) {
				return;
			}

			_this2.inverse = inverse;
			_this2.updateState(section, id);
		});
		return _this2;
	}

	_createClass(IS, [{
		key: 'updateState',
		value: function updateState(section, id) {
			var current = null;

			if (this.state.sections) {
				if (this.state.sections[section] && id) {
					current = getSection(this.props.sections[section], id, this.state.current);
				} else {
					throw new Error('Trying to access sections[\'' + section + '\']\' with id ' + id);
				}
			} else {
				throw new Error('Missing sections object');
			}

			clearTimeout(this.timeoutId);

			if (this.props.onStart) {
				this.props.onStart(this.previousData, this.currentData);
			}

			this.previousData = { section: this.currentData.section, id: this.currentData.id };
			this.currentData = { section: section, id: id };
			this.didUpdate = true;
			this.setState(Object.assign({}, this.state, {
				previous: this.state.current,
				current: current
			}));
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var _this3 = this;

			removeChildrenClasses(this.IS.children, Object.keys(classes).map(function (key) {
				return classes[key];
			}));

			if (this.props.animate && this.IS.children[0] && this.IS.children[1]) {
				if (this.inverse) {
					var startPreviousInverse = classes.startPreviousInverse,
					    startCurrentInverse = classes.startCurrentInverse,
					    animatePreviousInverse = classes.animatePreviousInverse,
					    animateCurrentInverse = classes.animateCurrentInverse;


					addClasses(this.IS.children[0], [startPreviousInverse, animatePreviousInverse]);
					addClasses(this.IS.children[1], [startCurrentInverse, animateCurrentInverse]);
				} else {
					var startPrevious = classes.startPrevious,
					    startCurrent = classes.startCurrent,
					    animatePrevious = classes.animatePrevious,
					    animateCurrent = classes.animateCurrent;


					addClasses(this.IS.children[0], [startPrevious, animatePrevious]);
					addClasses(this.IS.children[1], [startCurrent, animateCurrent]);
				}
			}

			if (!this.state.previous && this.state.current) {
				this.props.onDone && this.props.onDone(this.previousData, this.currentData);
				addChildrenClasses(this.IS.children, [classes.end]);
			}

			if (this.didUpdate) {
				this.isAnimating = true;
				this.timeoutId = setTimeout(function () {
					_this3.didUpdate = false;
					_this3.setState(Object.assign({}, _this3.state, {
						previous: null
					}));
					_this3.isAnimating = false;
				}, this.props.duration ? this.props.duration : getLongerDuration(this.IS.children[0], this.IS.children[1]));
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this4 = this;

			var _props2 = this.props,
			    style = _props2.style,
			    className = _props2.className,
			    animate = _props2.animate;

			var previous = null;
			var current = null;

			var currentSection = this.currentData.section;
			var currentId = this.currentData.id;

			var content = null;

			if (this.state.previous && this.state.previous.component) {
				var previousSection = this.previousData.section;
				var previousId = this.previousData.id;

				previous = getSection(this.props.sections[previousSection], previousId, null);
			}

			current = getSection(this.props.sections[currentSection], currentId, null);

			content = _react2.default.createElement(
				'div',
				{ className: className, style: style, ref: function ref(_ref) {
						return _this4.IS = _ref;
					} },
				animate && previous ? previous.component : null,
				current.component
			);

			return content;
		}
	}]);

	return IS;
}(_react.Component);

IS.propTypes = {
	sections: _propTypes2.default.objectOf(function (propValue, key, componentName, location, propFullName) {
		var fail = false;
		var failDescription = null;

		if (propValue[key].constructor === Array && propValue[key].length) {
			propValue[key].forEach(function (section) {
				if (!section.id) {
					fail = true;
					failDescription = 'Missing id.';
				} else if (!section.component && !_react2.default.isValidElement(section.component)) {
					failDescription = 'Missing component.';
				}
			});
		} else {
			fail = true;
		}

		if (fail) {
			return new Error('Invalid prop ' + propFullName + ' supplied to ' + componentName + '. ' + failDescription + ' Validation failed.');
		}
	})
};

var Dispatcher = function () {
	function Dispatcher() {
		_classCallCheck(this, Dispatcher);

		this.callback = null;
	}

	_createClass(Dispatcher, [{
		key: 'register',
		value: function register(callback) {
			this.callback = callback;
		}
	}, {
		key: 'dispatch',
		value: function dispatch(section, id, inverse) {
			var _this5 = this;

			return function () {
				_this5.callback(section, id, !!inverse);
			};
		}
	}]);

	return Dispatcher;
}();

function addClasses(element, classNames) {
	classNames.forEach(function (className) {
		element.clientHeight;
		element.classList.add(className);
	});
}

function addChildrenClasses(children, classNames) {
	for (var i = 0; i < children.length; i++) {
		addClasses(children[i], classNames);
	}
}

function removeClasses(element, classNames) {
	classNames.forEach(function (className) {
		element.classList.remove(className);
	});
}

function removeChildrenClasses(children, classNames) {
	for (var i = 0; i < children.length; i++) {
		removeClasses(children[i], classNames);
	}
}

function getLongerDuration(element_1, element_2) {
	var elem_1_duration = getElementDuration(element_1);
	var elem_2_duration = getElementDuration(element_2);

	return elem_1_duration > elem_2_duration ? elem_1_duration : elem_2_duration;
}

function getElementDuration(element) {
	var duration = 0;
	var possibleMatch = void 0;

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

function getSection(children, id) {
	var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	var result = fallback;

	children.forEach(function (child) {
		if (child.id === id) {
			result = child;
		}
	});

	return result;
}

//# sourceMappingURL=react-infinite-sections.js.map