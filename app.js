var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(process.env.PORT || 8080, function(){
  console.log('Server running on 8080...');
});

require('dotenv').config();
var ua = require('universal-analytics');
var visitor = ua(process.env.CONTROL_ID);
