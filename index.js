var css = require('sheetify')
var choo = require('choo')

css('tachyons')
const styles = css('./styles/global.css');

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
}

// app.use(require('./stores/clicks'))
app.use(require('./stores/auth'));
app.use(require('./stores/db'));
app.use(require('./stores/addmodal'));


app.route('/', require('./views/main'))
app.route('/app', require('./views/app'))
app.route('/login', require('./views/login'))
app.route('/signup', require('./views/signup'))
app.route('/*', require('./views/404'))


module.exports = app.mount('body')