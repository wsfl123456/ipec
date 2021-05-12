import _isString from "lodash/isString";
import _get from "lodash/get";
import _isObject from "lodash/isObject";
import axios, { AxiosInstance } from "axios";

function group(what: string, ...args: any) {
  if ($log && console) {
    console.groupCollapsed && console.groupCollapsed(what);
    console.log(...args);
    console.groupEnd && console.groupEnd();
  }
}

class ValidationException {
  response: any;

  constructor(response: any) {
    this.response = _isObject(response) ? response : JSON.parse(response);
  }

  toString() {
    let messages = [];
    for (let k in this.response) {
      if (this.response.hasOwnProperty(k)) {
        messages.push(...this.response[k]);
      }
    }
    return messages.join("\n");
  }
}

axios.defaults.withCredentials = false;
let hooks: Array<Function> = [];

export function addCreateHook(func: Function) {
  hooks.push(func);
}

export default function(host: any, { baseAuth = null, onError, onResponse }:
  { baseAuth: any, onError?: Function, onResponse?: Function }): AxiosInstance {
  let options: any = {
    timeout: 20000, responseType: "json",
  };
  if (_isString(host)) {
    options.baseURL = host;
  } else {
    options = { ...options, ...host };
  }
  hooks.forEach((hook) => {
    options = hook(options);
  });
  const API = axios.create(options);

  if ($log) {
    API.interceptors.request.use((config) => {
      console.log("request", config.method, config.url, config.params, config.data);
      return config;
    });
  }
  API.interceptors.response.use(r => {
    if ($log) {
      group("Done " + _get(r, "config.url"), _get(r, "data"));
    }
    if (onResponse) {
      return onResponse(r.data);
    }
    return r.data;
  }, (error) => {
    if ($log) {
      group("API Error", error.config, error.request, error.response);
    }
    if (onError) {
      return onError(error);
    }
    if (error.response && error.response.status === 422) {
      let data = error.response.data;
      return Promise.reject(new ValidationException(data));
    }
    return Promise.reject(error);
  });

  return API;
}
