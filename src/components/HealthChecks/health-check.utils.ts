import { CodexDebugInfo, SafeValue, CodexError } from "@codex-storage/sdk-js";

export const HealthCheckUtils = {
  removePort(url: string) {
    const parts = url.split(":");
    return parts[0] + ":" + parts[1];
  },

  extractBasicAuth(url: string) {
    if (!url.includes("@")) {
      return { auth: "", url };
    }

    const [prefix, rest] = url.split("@");
    const [protocol, auth] = prefix.split("//");

    return { auth, url: protocol + "//" + rest };
  },

  /*
   * Extract the port from a protocol + ip + port string
   */
  getPort(url: string) {
    return url.split(":")[2] || "";
  },

  containsPort(url: string) {
    if (url.includes("@")) {
      return url.split(":").length > 3;
    }

    return url.split(":").length > 2;
  },

  isUrlInvalid(url: string) {
    try {
      new URL(url);
      return false;
      // We do not need to manage the error because we want to check
      // if the URL is valid or not only.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return true;
    }
  },

  extractAnnounceAddresses(announceAddresses: string[]): SafeValue<string> {
    if (announceAddresses.length === 0) {
      return {
        error: true,
        data: new CodexError("Not existing announce address"),
      };
    }

    const ip = announceAddresses[0].split("/");

    if (ip.length !== 5) {
      return { error: true, data: new CodexError("Misformatted ip") };
    }

    return { error: false, data: ip[2] };
  },

  getTcpPort(info: CodexDebugInfo): SafeValue<number> {
    if (info.addrs.length === 0) {
      return { error: true, data: new CodexError("Not existing address") };
    }

    const parts = info.addrs[0].split("/");

    if (parts.length < 2) {
      return { error: true, data: new CodexError("Address misformated") };
    }

    const port = parseInt(parts[parts.length - 1], 10);

    if (isNaN(port)) {
      return { error: true, data: new CodexError("Port misformated") };
    }

    return { error: false, data: port };
  },
};
