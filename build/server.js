'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _connectFlash = require('connect-flash');

var _connectFlash2 = _interopRequireDefault(_connectFlash);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _expressEjsLayouts = require('express-ejs-layouts');

var _expressEjsLayouts2 = _interopRequireDefault(_expressEjsLayouts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// setup our application
var app = (0, _express2.default)();
var port = process.env.PORT || 8080;
var mLab = 'mongodb://' + _config2.default.host + '/' + _config2.default.name;

_mongoose2.default.connect(mLab);
// set up express application
app.use((0, _morgan2.default)('dev'));
app.use((0, _cookieParser2.default)());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.set('view engine', 'ejs');
//app.use(expressLayouts);

// for passport
app.use((0, _expressSession2.default)({ secret: 'topsecret' }));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.use((0, _connectFlash2.default)());
// routes
require('../app/routes.js')(app, _passport2.default);

app.use(_express2.default.static('./public'));
//launch
app.listen(port);
console.log('Server running on port ' + port);