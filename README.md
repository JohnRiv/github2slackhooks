github2slackhooks
=================

An excuse to play around with [AWS Lambda](https://aws.amazon.com/lambda/).

I believe the [GitHub App for Slack](https://slack.com/apps/A0F7YS2SX-github) already provides this functionality (plus much more), but I wanted a straightforward use case to solve with AWS Lambda, and a [GitHub Webhook](https://developer.github.com/webhooks/) talking to AWS Lambda via the [Amazon API Gateway](https://aws.amazon.com/api-gateway/) and then calling a [Slack Incoming Webhook](https://api.slack.com/incoming-webhooks) seemed sufficient.

This also leverages the [AWS Key Management Service](https://aws.amazon.com/kms/) to hide the Slack Webhook URL so others can't read the code here and spam a Slack instance I'm using.