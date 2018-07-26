Google Oauth Proxy to S3
=========================

[![Github Releases](https://img.shields.io/github/downloads/halkeye/proxy-s3-google-oauth/latest/total.svg)](https://github.com/halkeye/proxy-s3-google-oauth/releases)
[![Docker Stars](https://img.shields.io/docker/stars/halkeye/proxy-s3-google-oauth.svg)](https://hub.docker.com/r/halkeye/proxy-s3-google-oauth/)
[![Docker Pulls](https://img.shields.io/docker/pulls/halkeye/proxy-s3-google-oauth.svg)](https://hub.docker.com/r/halkeye/proxy-s3-google-oauth/)
[![Docker Automated buil](https://img.shields.io/docker/automated/halkeye/proxy-s3-google-oauth.svg)](https://hub.docker.com/r/halkeye/proxy-s3-google-oauth/) [![Greenkeeper badge](https://badges.greenkeeper.io/halkeye/proxy-s3-google-oauth.svg)](https://greenkeeper.io/)

## What does it do?

A simple little server to proxy content from an s3 bucket through an expressjs server checking google auth credentials.

## Configuration

All configuration is done with env variables

* `BASE_URL` - Return url for google oauth
* `COOKIE_SECRET` - Secret used for signing cookies
* `GOOGLE_CLIENT_ID` - OAuth client id
* `GOOGLE_CLIENT_SECRET` - OAuth Client Secret
* (Optional) `GOOGLE_HOSTED_DOMAIN` - Domain for limiting to single domain for google apps
* `AWS_ACCESS_KEY_ID` - Aws Key
* `AWS_SECRET_ACCESS_KEY` - aws secret key
* `AWS_REGION` - region bucket is in
* `AWS_S3_BUCKET` - bucket name
