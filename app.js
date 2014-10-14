var express = require('express')
  , http = require('http')
  , SNSClient = require('aws-snsclient')
  , AWS = require('aws-sdk')
  , s3 = new AWS.S3()
  , zlib = require('zlib')
  , history = require('history')
  , logger = require('logger');


var auth = {
    TopicArn: 'topic-name'
}
var client = SNSClient(auth, function(err, message) {
    if (err) {
        throw err;
    }
    var deets = JSON.parse(message.Message);
    var params = {
      Bucket: deets.s3Bucket, // required
      Key: deets.s3ObjectKey.pop(), // required
    };
    s3.getObject(params, function(err, data) {
      zlib.unzip(data.Body, function(err, buffer) {
        var doc = JSON.parse(buffer.toString());
        doc.Records.forEach(function(event) {
          if (event.eventType == 'DescribeInstances') {
            return;
          }
          if(!history.check(event)) {
            logger.info(event.awsRegion + ' - ' + event.eventSource + ' - ' + event.eventName, {
              userName: event.userIdentity.userName,
              eventName: event.eventName,
              eventSource: event.eventSource,
              eventTime: event.eventTime,
              userAgent: event.userAgent,
              awsRegion: event.awsRegion,
              sourceIPAddress: event.sourceIPAddress,
              requestParameters: JSON.stringify(event.requestParameters, true),
              accessKeyId: event.userIdentity.accessKeyId,
              userArn: event.userIdentity.arn,
              eventType: event.eventType,
              eventID: event.eventID
            });
            history.add(event);
          }
        });
      });
    });
});

http.createServer(function(req, res) {
    if(req.method === 'POST' && req.url === '/receive') {
        return client(req, res);
    }
    res.writeHead(404);
    res.end('Not found.');
}).listen(~~process.argv[2] || 3000);
