console.log('GitHubIssuesEvent');

var request = require('request');
var util = require('util');
var AWS = require('aws-sdk');
var Promise = require('promise');

exports.handler = function(event, context) {
  var payload = {
    "text": buildMsg(event)
  };

  console.log(payload);

  getSlackWebhookPath().then(
    function(data) {
      var slackWebhookUrl = 'https://hooks.slack.com/services/' + data['Plaintext'].toString();
      request({
        uri: slackWebhookUrl,
        method: 'POST',
        body: JSON.stringify(payload)
      }, context.done);
    },
    function(error) {
      console.log('Error decrypting Slack Webhook Path');
      context.fail(error);
    }
  );
};

var buildMsg = function(event) {
  // TODO: sanitize these inputs
  var action = event.action || "unknown";
  var issue = event.issue || {};
  var repo = event.repository || {};
  var user = event.sender || {};
  return util.format("The %s issue was %s in the %s repo by %s.",
                     issue.title, action, repo.full_name, user.login);
};

// Hat Tips:
// http://stackoverflow.com/questions/29372278/aws-lambda-how-to-store-secret-to-external-api
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html
// but note, this is sloooooooooooooooow...
var getSlackWebhookPath = function() {
  var fs = require('fs');
  //var AWS = require('aws-sdk');
  var kms = new AWS.KMS({region:'us-west-2'});

  var secretPath = './slackWebhookUrl';
  var encryptedSecret = fs.readFileSync(secretPath);

  var params = {
    CiphertextBlob: encryptedSecret
  };

  return kms.decrypt(params).promise();
};

// Hat Tips:
// https://github.com/aws/aws-sdk-js/issues/13#issuecomment-11868232
// https://github.com/lightsofapollo/aws-sdk-promise
// https://www.promisejs.org/
AWS.Request.prototype.promise = function() {
  return new Promise(function(accept, reject) {
    this.on('complete', function(response) {
      if (response.error) {
        reject(response.error);
      } else {
        accept(response.data);
      }
    });
    this.send();
  }.bind(this));
};
