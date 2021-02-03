import { Handler } from "express";
import createError from "http-errors";

interface Options {
  /**
   * allow loopback hostname (enabled default)
   */
  loopback?: boolean;
  /**
   * hostname whitelist
   */
  allowList?: Array<string>;
  /**
   * the response status code when reject
   */
  rejectStatusCode?: number;
}

const defaultOption: Options = {
  loopback: true,
  allowList: [],
  rejectStatusCode: 403,
};

const LOOPBACK_HOSTS = ['localhost', '127.0.0.1'];

const createHostLimit = (option: Options = defaultOption): Handler => {
  option = Object.assign(defaultOption, option);

  return (req, res, next) => {
    const { hostname } = req;
    if (option.loopback) {
      if (LOOPBACK_HOSTS.includes(hostname)) {
        return next();
      }
    }
    if (option.allowList.includes(hostname)) {
      return next();
    } else {
      return next(
        createError(
          option.rejectStatusCode,
          `'${hostname}' is not trusted for proxy`
        )
      );
    }
  };
};

export = createHostLimit

