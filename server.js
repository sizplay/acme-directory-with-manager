const db = require('./db');
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const path = require('path');
nunjucks.configure({ noCache: true });

app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(require('body-parser').urlencoded());
app.use(require('method-override')('_method'));

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use('/', require('./routes'));

const port = process.env.Port || 3000;
app.listen(port, () => console.log(`listening on ${port}`));

db.sync()
  .then(() => db.seed());

module.exports = app;
