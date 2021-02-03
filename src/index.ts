import { Handler } from "express";
import createError from "http-errors";

export interface Options {
  loopback?: boolean;
  whitelists?: Array<string>;
}

const defaultOption: Options = {
  loopback: true,
  whitelists: []
};

const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '::1'];

export const limitForwardedHost = (option: Options = defaultOption): Handler => {
  option = Object.assign(defaultOption, option);

  return (req, res, next) => {
    const { hostname } = req;
    if (option.loopback) {
      if (LOOPBACK_HOSTS.includes(hostname)) {
        return next();
      }
    }
    if (option.whitelists.includes(hostname)) {
      return next();
    } else {
      return next(createError(403, `${hostname} is not trusted for proxy`));
    }
  };
};

