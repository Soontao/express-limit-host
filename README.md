# express-limit-host

![node-test](https://github.com/Soontao/express-limit-host/workflows/node-test/badge.svg)
[![codecov](https://codecov.io/gh/Soontao/express-limit-host/branch/main/graph/badge.svg?token=gTDJNGSGcQ)](https://codecov.io/gh/Soontao/express-limit-host)
![GitHub](https://img.shields.io/github/license/Soontao/express-limit-host)
[![npm](https://img.shields.io/npm/v/express-limit-host)](https://www.npmjs.com/package/express-limit-host)

simple middleware to protect server from `host`/`x-forwarded-host` injection.

## Usage


```ts
const createHostLimit = require("express-limit-host")
const express = require("express")

const app = express()

app.use(createHostLimit({
  loopback: true,
  allowList: [
    'proxy-server-host.com', 
    'direct-service-host.com'
  ],
  rejectStatusCode: 403
}))
```