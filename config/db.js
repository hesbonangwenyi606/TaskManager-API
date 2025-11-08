const mongoose = require('mongoose');

const connect = (uri) => mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = { connect };
