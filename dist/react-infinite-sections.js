'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
	root: _react2.default.PropTypes.shape({
		section: _react2.default.PropTypes.string.isRequired,
		id: _react2.default.PropTypes.string.isRequired
	}),
	sections: _react2.default.PropTypes.func.isRequired
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
		_this2.state.current = getCurrent(_this2.state.sections[_this2.props.root.section], _this2.props.root.id);

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
					current = getCurrent(this.state.sections[section], id, this.state.current);
				} else {
					throw new Error('Trying to access sections[\'' + section + '\']\' with id ' + id);
				}
			} else {
				throw new Error('Missing sections object');
			}

			clearTimeout(this.timeoutId);

			if (this.props.onStart) {
				this.previousData = { section: this.currentData.section, id: this.currentData.id };
				this.currentData = { section: section, id: id };

				this.props.onStart(this.previousData, this.currentData);
			}

			this.setState(_extends({}, this.state, {
				previous: this.state.current,
				current: current
			}));
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			return this.state.previous || nextState.previous;
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			var _this3 = this;

			if (this.props.animate && this.previousElement && this.currentElement) {

				removeClasses(this.previousElement, Object.keys(classes).map(function (key) {
					return classes[key];
				}));
				removeClasses(this.currentElement, Object.keys(classes).map(function (key) {
					return classes[key];
				}));

				if (this.inverse) {
					var startPreviousInverse = classes.startPreviousInverse,
					    startCurrentInverse = classes.startCurrentInverse,
					    animatePreviousInverse = classes.animatePreviousInverse,
					    animateCurrentInverse = classes.animateCurrentInverse;


					addClasses(this.previousElement, [startPreviousInverse, animatePreviousInverse]);
					addClasses(this.currentElement, [startCurrentInverse, animateCurrentInverse]);
				} else {
					var startPrevious = classes.startPrevious,
					    startCurrent = classes.startCurrent,
					    animatePrevious = classes.animatePrevious,
					    animateCurrent = classes.animateCurrent;


					addClasses(this.previousElement, [startPrevious, animatePrevious]);
					addClasses(this.currentElement, [startCurrent, animateCurrent]);
				}
			}

			if (!this.state.previous && this.state.current) {
				this.props.onDone && this.props.onDone(this.previousData, this.currentData);
			}

			this.isAnimating = true;
			this.timeoutId = setTimeout(function () {
				_this3.setState(_extends({}, _this3.state, {
					previous: null
				}));
				_this3.isAnimating = false;
			}, getLongerDuration(this.previousElement, this.currentElement));
		}
	}, {
		key: 'render',
		value: function render() {
			var _this4 = this;

			var _props2 = this.props,
			    style = _props2.style,
			    className = _props2.className,
			    animate = _props2.animate;

			var previous = this.state.previous && this.state.previous.component;
			var current = this.state.current.component;
			var content = null;

			if (animate && previous) {
				previous = _react2.default.cloneElement(previous, { ref: function ref(_ref) {
						_this4.previousElement = _ref;
					}, key: 1 });
				current = _react2.default.cloneElement(current, { ref: function ref(_ref2) {
						_this4.currentElement = _ref2;
					}, key: 2 });

				content = _react2.default.createElement(
					'div',
					{ className: className, style: style, ref: function ref(_ref3) {
							return _this4.IS = _ref3;
						} },
					previous,
					current
				);
			} else {
				current = _react2.default.cloneElement(current, { ref: function ref(_ref4) {
						_this4.currentElement = _ref4;
					}, className: current.props.className + ' ' + classes.end, key: 1 });

				content = _react2.default.createElement(
					'div',
					{ className: className, style: style, ref: function ref(_ref5) {
							return _this4.IS = _ref5;
						} },
					current
				);
			}

			return content;
		}
	}]);

	return IS;
}(_react.Component);

IS.propTypes = {
	sections: _react2.default.PropTypes.objectOf(function (propValue, key, componentName, location, propFullName) {
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

function removeClasses(element, classNames) {
	classNames.forEach(function (className) {
		element.classList.remove(className);
	});
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

function getCurrent(children, id) {
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