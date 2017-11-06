const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// app.use('/static', express.static('views'))
app.use(express.static(path.join(__dirname, 'views')));
app.use('/', require('./routes/root')(express));


exports.server = app.listen(port, () => {
  console.log('Server Active On Port', port);
});
