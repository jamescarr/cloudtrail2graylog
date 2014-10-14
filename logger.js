var winston = require('winston')
  , graylog2 = require('winston-graylog2').Graylog2;

winston.add(graylog2, {
  level: 'info', 
  silent: false,
  graylogHost: process.env.GRAYLOG2_HOST,
  graylogPort: parseInt(process.env.GRAYLOG2_PORT || "12201"),
  graylogFacility: 'aws-cloudtrail'
});


module.exports = winston;
