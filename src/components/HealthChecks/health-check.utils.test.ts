import { assert, describe, it } from "vitest";
import { HealthCheckUtils } from "./health-check.utils";

describe("health check", () => {
  it("remove the port from an url", async () => {
    assert.deepEqual(
      HealthCheckUtils.removePort("http://localhost:8080"),
      "http://localhost"
    );
  });

  it("get the port from an url", async () => {
    assert.deepEqual(HealthCheckUtils.getPort("http://localhost:8080"), "8080");
  });

  it("get the default port when the url does not contain the port", async () => {
    assert.deepEqual(HealthCheckUtils.getPort("http://localhost"), "");
  });

  it("returns true when the url contains a port", async () => {
    assert.deepEqual(
      HealthCheckUtils.containsPort("http://localhost:8080"),
      true
    );
  });

  it("returns false when the url does not contain a port", async () => {
    assert.deepEqual(HealthCheckUtils.containsPort("http://localhost"), false);
  });

  it("extracts the basic authentication", async () => {
    assert.deepEqual(
      HealthCheckUtils.extractBasicAuth("http://hello:world@localhost:8080"),
      { auth: "hello:world", url: "http://localhost:8080" }
    );
  });

  it("returns true when the url is invalid", async () => {
    assert.deepEqual(HealthCheckUtils.isUrlInvalid("http://"), true);
  });

  it("returns false when the url is valid", async () => {
    assert.deepEqual(
      HealthCheckUtils.isUrlInvalid("http://localhost:8080"),
      false
    );
  });

  it("returns the tcp port", async () => {
    const debug = {
      id: "a",
      addrs: ["/ip4/127.0.0.1/tcp/8070"],
      repo: "",
      spr: "",
      announceAddresses: ["/ip4/127.0.0.1/tcp/8070"],
      table: {
        localNode: {
          nodeId: "",
          peerId: "",
          record: "",
          address: "0.0.0.0:8090",
          seen: false,
        },
        nodes: [],
      },
      codex: {
        version:
          "v0.1.0\nv0.1.1\nv0.1.2\nv0.1.3\nv0.1.4\nv0.1.5\nv0.1.6\nv0.1.7",
        revision: "2fb7031e",
      },
    };
    assert.deepEqual(HealthCheckUtils.getTcpPort(debug), {
      error: false,
      data: 8070,
    });
  });

  it("returns an error when the addr is empty", async () => {
    const debug = {
      id: "a",
      addrs: [],
      repo: "",
      spr: "",
      announceAddresses: ["/ip4/127.0.0.1/tcp/8070"],
      table: {
        localNode: {
          nodeId: "",
          peerId: "",
          record: "",
          address: "0.0.0.0:8090",
          seen: false,
        },
        nodes: [],
      },
      codex: {
        version:
          "v0.1.0\nv0.1.1\nv0.1.2\nv0.1.3\nv0.1.4\nv0.1.5\nv0.1.6\nv0.1.7",
        revision: "2fb7031e",
      },
    };
    assert.deepEqual(HealthCheckUtils.getTcpPort(debug).error, true);
  });

  it("returns an error when the addr is misformated", async () => {
    const debug = {
      id: "a",
      addrs: ["/ip4/127.0.0.1/tcp/hello"],
      repo: "",
      spr: "",
      announceAddresses: ["/ip4/127.0.0.1/tcp/8070"],
      table: {
        localNode: {
          nodeId: "",
          peerId: "",
          record: "",
          address: "0.0.0.0:8090",
          seen: false,
        },
        nodes: [],
      },
      codex: {
        version:
          "v0.1.0\nv0.1.1\nv0.1.2\nv0.1.3\nv0.1.4\nv0.1.5\nv0.1.6\nv0.1.7",
        revision: "2fb7031e",
      },
    };
    assert.deepEqual(HealthCheckUtils.getTcpPort(debug).error, true);
  });

  it("returns an error when the port is misformated", async () => {
    const debug = {
      id: "a",
      addrs: ["hello"],
      repo: "",
      spr: "",
      announceAddresses: ["/ip4/127.0.0.1/tcp/8070"],
      table: {
        localNode: {
          nodeId: "",
          peerId: "",
          record: "",
          address: "0.0.0.0:8090",
          seen: false,
        },
        nodes: [],
      },
      codex: {
        version:
          "v0.1.0\nv0.1.1\nv0.1.2\nv0.1.3\nv0.1.4\nv0.1.5\nv0.1.6\nv0.1.7",
        revision: "2fb7031e",
      },
    };
    assert.deepEqual(HealthCheckUtils.getTcpPort(debug).error, true);
  });

  it("extracts the announced ip", async () => {
    assert.deepEqual(
      HealthCheckUtils.extractAnnounceAddresses(["/ip4/127.0.0.1/tcp/8070"])
        .data,
      "127.0.0.1"
    );
    assert.deepEqual(HealthCheckUtils.extractAnnounceAddresses([]).error, true);
    assert.deepEqual(
      HealthCheckUtils.extractAnnounceAddresses(["hello"]).error,
      true
    );
  });
});
