const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(express.static(__dirname + '/views'));
app.use('/', require('./routes/root')(express));


exports.server = app.listen(port, () => {
  console.log('Server Active On Port', port);
});