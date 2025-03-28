import { Codex } from "@codex-storage/sdk-js";
import { WebStorage } from "../utils/web-storage";

let client: Codex = new Codex(import.meta.env.VITE_CODEX_API_URL);
let url: string = import.meta.env.VITE_CODEX_API_URL;

type CodexSdkUpdateOptions = {
  auth?: {
    basic?: string;
  };
};

export const CodexSdk = {
  url() {
    return url;
  },

  async load() {
    const [url = import.meta.env.VITE_CODEX_API_URL, basicAuthSecret] =
      await Promise.all([
        WebStorage.get<string>("codex-node-url"),
        WebStorage.get<string>("codex-auth-basic"),
      ]);

    client = new Codex(url, { auth: { basic: basicAuthSecret } });
  },

  updateURL(u: string, options: CodexSdkUpdateOptions) {
    let basicAuthSecret: string = "";

    if (options.auth?.basic) {
      basicAuthSecret = btoa(options.auth?.basic);
    }

    url = u;
    client = new Codex(url, { auth: { basic: basicAuthSecret } });

    return WebStorage.set("codex-auth-basic", basicAuthSecret).then(() =>
      WebStorage.set("codex-node-url", url)
    );
  },

  debug() {
    return client.debug;
  },

  data() {
    return client.data;
  },

  node() {
    return client.node;
  },

  marketplace() {
    return client.marketplace;
  },
};
