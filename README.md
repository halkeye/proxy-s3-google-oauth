Google Oauth Proxy to S3
=========================

[![Github Releases](https://img.shields.io/github/downloads/halkeye/proxy-s3-google-oauth/latest/total.svg)]()
[![Docker Stars](https://img.shields.io/docker/stars/halkeye/proxy-s3-google-oauth.svg)]()
[![Docker Pulls](https://img.shields.io/docker/pulls/halkeye/proxy-s3-google-oauth.svg)]()
[![Docker Automated buil](https://img.shields.io/docker/automated/halkeye/proxy-s3-google-oauth.svg)]()

## What does it do?

A simple little server to proxy content from an s3 bucket through an expressjs server checking google auth credentials.

## Configuration

All configuration is done with env variables

`BASE_URL` - Return url for google oauth

get your credentials here: https://cloud.google.com/console/project

`GOOGLE_CLIENT_ID` - OAuth client id

`GOOGLE_CLIENT_SECRET` - OAuth Client Secret

(Optional) `GOOGLE_HOSTED_DOMAIN` - Domain for limiting to single domain for google apps

`AWS_ACCESS_KEY_ID` - Aws Key

`AWS_SECRET_ACCESS_KEY` - aws secret key

`AWS_REGION` - region bucket is in

`AWS_S3_BUCKET` - bucket name
