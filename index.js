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
app.use(require('./stores/edit'));
app.use(require('./stores/export'));
app.use(require('./stores/browse'));


app.route('/', require('./views/main'))
app.route('/app', require('./views/app'))
app.route('/login', require('./views/login'))
app.route('/signup', require('./views/signup'))
app.route('/browse', require('./views/browse'))
app.route('/browse/:db/:id', require('./views/browse'))

app.route('/edit', require('./views/edit'))
app.route('/export', require('./views/export'))
app.route('/*', require('./views/404'))


module.exports = app.mount('body')