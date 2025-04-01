import { Codex } from "@codex-storage/sdk-js";
import { WebStorage } from "../utils/web-storage";

let client: Codex = new Codex(import.meta.env.VITE_CODEX_API_URL);
let url: string = import.meta.env.VITE_CODEX_API_URL;

export type CodexAuthUpdateOptions = {
  auth?: {
    username: string;
    password: string;
  };
};

export const CodexSdk = {
  url() {
    return url;
  },

  client() {
    return client;
  },

  async load() {
    const [
      u = import.meta.env.VITE_CODEX_API_URL,
      username,
      password,
      enabled,
    ] = await Promise.all([
      WebStorage.get<string>("codex-node-url"),
      WebStorage.get<string>("codex-auth-username"),
      WebStorage.get<string>("codex-auth-password"),
      WebStorage.get<boolean>("codex-auth-enabled"),
    ]);

    url = u;

    client = new Codex(u, {
      auth: { basic: enabled ? btoa(`${username}:${password}`) : "" },
    });
  },

  updateURL(u: string, options: CodexAuthUpdateOptions) {
    let basicAuthSecret: string = "";

    url = u;

    const promises = [WebStorage.set("codex-node-url", url)];

    if (options.auth) {
      const { username, password } = options.auth;
      basicAuthSecret = btoa(`${username}:${password}`);
      promises.push(WebStorage.set("codex-auth-enabled", true));
    } else {
      promises.push(WebStorage.set("codex-auth-enabled", false));
    }

    client = new Codex(url, { auth: { basic: basicAuthSecret } });

    if (options.auth) {
      promises.push(
        WebStorage.set("codex-auth-username", options.auth.username),
        WebStorage.set("codex-auth-password", options.auth.password)
      );
    }

    return Promise.all(promises);
  },
};
