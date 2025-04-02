import { Codex } from "@codex-storage/sdk-js";
import { WebStorage } from "../utils/web-storage";

let defaultUrl = import.meta.env.VITE_CODEX_API_URL;

if (import.meta.env.VITE_CODEX_SELF_HOSTED === "1") {
  defaultUrl = window.location.href;

  if (defaultUrl.endsWith("/")) {
    defaultUrl = defaultUrl.slice(0, -1);
  }
}

let client: Codex = new Codex(defaultUrl);
let url: string = defaultUrl;

export const CodexSdk = {
  url() {
    return url;
  },

  load() {
    return WebStorage.get<string>("codex-node-url").then((u) => {
      url = u || defaultUrl;
      client = new Codex(url);
    });
  },

  updateURL(u: string) {
    url = u;
    client = new Codex(url);

    return WebStorage.set("codex-node-url", url);
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
