const mongoose = require('mongoose');
const config = require('../utils/config');
mongoose.connect(config[config.key],{ useNewUrlParser: true });
//mongoose.connect('mongodb://localhost:27017/bugtracking', { useNewUrlParser: true });
module.exports = mongoose;