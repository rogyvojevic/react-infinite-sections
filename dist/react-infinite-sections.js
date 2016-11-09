'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
			var config = this.props.config;


			return _react2.default.createElement(IS, {
				dispatcher: this.dispatcher,
				config: config(this.dispatcher.dispatch.bind(this.dispatcher))
			});
		}
	}]);

	return InfiniteSections;
}(_react.Component);

exports.default = InfiniteSections;

var IS = function (_Component2) {
	_inherits(IS, _Component2);

	function IS(props) {
		_classCallCheck(this, IS);

		var _this2 = _possibleConstructorReturn(this, (IS.__proto__ || Object.getPrototypeOf(IS)).call(this, props));

		_this2.state = _extends({}, props, {
			previous: null,
			current: null
		});
		_this2.timeoutId = null;

		_this2.props.dispatcher.register(function (section, id, animation) {
			_this2.getSectionElement(section, id, animation);
		});

		_this2.state.current = _this2.state.config.root;
		return _this2;
	}

	_createClass(IS, [{
		key: 'getSectionElement',
		value: function getSectionElement(section, id, animation) {
			var sectionElement = null;

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
						throw new Error('Trying to access sections[\'' + section + '\']\' with id ' + id);
					}
				} else {
					throw new Error('Missing sections object');
				}
			}

			clearTimeout(this.timeoutId);
			this.setState(_extends({}, this.state, {
				previous: this.state.current,
				current: sectionElement,
				animation: animation
			}));

			function doGetSection(children, id, fallback) {
				var result = fallback;

				children.forEach(function (child) {
					if (child.id === id) {
						result = child;
					}
				});

				return result;
			}
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

			if (this.state.animation) {
				// Reset current component to original position
				if (!this.state.previous) {
					this.IS.children[0].style['transition'] = 'none';
					this.IS.children[0].style['transform'] = 'translate3d(0, 0, 0)';
				}

				// Animation logic
				if (this.state.previous && this.state.current) {
					var _loop = function _loop(i) {
						if (_this3.state.animation && _this3.state.animation.flip) {
							_this3.IS.children[i].style['transform'] = 'translate3d(-100%, 0, 0)';
						}

						onNextFrame(function () {
							_this3.IS.children[i].style['transition'] = 'all ' + _this3.state.animation.duration + 'ms ease';
							_this3.IS.children[i].style['transform'] = _this3.state.animation.transform;
						});
					};

					for (var i = 0; i < this.IS.children.length; i++) {
						_loop(i);
					}
				}
			}

			// If animation is enabled this function will
			// execute after the animation is done
			this.timeoutId = setTimeout(function () {
				_this3.setState(_extends({}, _this3.state, {
					previous: null
				}));
			}, this.state.animation ? this.state.animation.duration : 0);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this4 = this;

			var previous = this.state.previous && this.state.previous.component;
			var current = this.state.current.component;
			var content = null;

			// Checking if animation is enabled
			if (this.state.animation) {
				// Checking if navigatining to parent (flip)
				if (this.state.animation.flip) {
					content = _react2.default.createElement(
						'div',
						{ style: _defineProperty({ overflow: 'visible', whiteSpace: 'nowrap' }, 'overflow', 'hidden'), ref: function ref(_ref2) {
								return _this4.IS = _ref2;
							} },
						current,
						previous
					);
				} else {
					content = _react2.default.createElement(
						'div',
						{ style: _defineProperty({ overflow: 'visible', whiteSpace: 'nowrap' }, 'overflow', 'hidden'), ref: function ref(_ref4) {
								return _this4.IS = _ref4;
							} },
						previous,
						current
					);
				}
			} else {
				content = _react2.default.createElement(
					'div',
					{ style: _defineProperty({ overflow: 'visible', whiteSpace: 'nowrap' }, 'overflow', 'hidden'), ref: function ref(_ref6) {
							return _this4.IS = _ref6;
						} },
					current
				);
			}

			return content;
		}
	}]);

	return IS;
}(_react.Component);

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
		value: function dispatch(section, id, animation) {
			var _this5 = this;

			return function () {
				_this5.callback(section, id, animation);
			};
		}
	}]);

	return Dispatcher;
}();

function onNextFrame(callback) {
	setTimeout(function () {
		window.requestAnimationFrame(callback);
	}, 20);
}

//# sourceMappingURL=react-infinite-sections.js.map