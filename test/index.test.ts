import { sleep } from "@newdash/newdash";
import express from "express";
import supertest from "supertest";
import createHostLimit from "../src";

const X_FORWARDED_HOST = 'x-forwarded-host';

describe('Middleware Test Suite', () => {

  function createApp(...args: Parameters<typeof createHostLimit>) {
    const app = express();
    app.set('trust proxy', true);
    app.use(createHostLimit(...args));
    app.get("/index", req => req.res.json({ success: true }));
    return app;
  }

  it('should reject un-trusted hostname', async () => {

    const req = supertest(createApp());
    await req.get("/index").set(X_FORWARDED_HOST, 'un-trusted.org').expect(403);

  });

  it('should accept localhost by default', async () => {

    const req = supertest(createApp());
    await req.get("/index").set(X_FORWARDED_HOST, 'localhost').expect(200);
    await req.get("/index").set(X_FORWARDED_HOST, '127.0.0.1').expect(200);
    await req.get("/index").set(X_FORWARDED_HOST, 'custom.org').expect(403);


  });

  it('should accept user defined whitelist', async () => {

    const req = supertest(createApp({ allowList: ['custom.org'] }));
    await req.get("/index").set(X_FORWARDED_HOST, 'localhost').expect(200);
    await req.get("/index").set(X_FORWARDED_HOST, '127.0.0.1').expect(200);
    await req.get("/index").set(X_FORWARDED_HOST, 'custom.org').expect(200);

  });


  it('should un-trust when disable loopback', async () => {

    const req = supertest(createApp({ loopback: false }));
    await req.get("/index").set(X_FORWARDED_HOST, 'localhost').expect(403);
    await req.get("/index").set(X_FORWARDED_HOST, '127.0.0.1').expect(403);

  });

  it('should support customize reject response status', async () => {

    const req = supertest(createApp({
      loopback: false,
      rejectStatusCode: 500
    }));

    await req.get("/index").set(X_FORWARDED_HOST, 'localhost').expect(500);
    await req.get("/index").set(X_FORWARDED_HOST, '127.0.0.1').expect(500);

  });

  afterAll(async () => {
    await sleep(500);
  });

});