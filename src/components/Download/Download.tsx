import { Button, Input } from "@codex-storage/marketplace-ui-components";
import "./Download.css";
import { ChangeEvent, useState } from "react";
import { CodexSdk } from "../../sdk/codex";
import { attributes } from "../../utils/attributes";

let xhr: XMLHttpRequest;

export function Download() {
  const [cid, setCid] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [inProgress, setInProgress] = useState(false);

  const onDownload = () => {
    setProgress(0);
    setError("");
    setMessage("");

    if (inProgress) {
      if (xhr) {
        xhr.abort();
      }
      setInProgress(false);
      setCid("");
      return;
    }

    const url =
      CodexSdk.url() + "/api/codex/v1/data/" + cid + "/network/stream";

    setMessage("Download in progress....");
    setInProgress(true);

    xhr = new XMLHttpRequest();
    const isAsync = true;
    const options = false;

    xhr.open("GET", url, isAsync);

    xhr.addEventListener(
      "progress",
      function (evt) {
        if (evt.lengthComputable) {
          setProgress(evt.loaded / evt.total);
        }
      },
      options
    );

    xhr.responseType = "blob";

    xhr.onload = function () {
      const DONE_STATE = 4;
      if (xhr.readyState !== DONE_STATE) {
        return;
      }

      if (xhr.status === 200) {
        let filename = "unknown";
        let extension = "";

        const contentAttachment = xhr.getResponseHeader("Content-Disposition");

        if (contentAttachment) {
          const [, name] = contentAttachment.split('filename="');
          const [nameWithoutExtension, ext] = name.slice(0, -1).split(".");
          extension = ext;
          filename = nameWithoutExtension;
        }

        if (typeof (window as any).chrome !== "undefined") {
          // Chrome version
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(xhr.response);
          link.download = filename;
          link.click();
        } else {
          // Firefox version
          var file = new File([xhr.response], filename + "." + extension, {
            type: "application/force-download",
          });
          window.open(URL.createObjectURL(file));
        }

        setMessage("Download successful.");
      } else {
        setMessage("");
        setError(`${this.status} ${this.statusText}`);
      }

      setInProgress(false);
    };

    xhr.send();
  };

  const onCidChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCid(e.currentTarget.value);

  return (
    <main className="download" {...attributes({ "aria-invalid": !!error })}>
      <div className="row gap">
        <Input
          id="cid"
          placeholder="CID"
          inputClassName="download-input"
          variant={"medium"}
          autoComplete="off"
          value={cid}
          onChange={onCidChange}></Input>
        <Button
          label={inProgress ? "Cancel" : "Download"}
          onClick={onDownload}
          variant="outline"></Button>
      </div>
      <progress
        {...attributes({
          max: "1",
          value: progress.toString(),
        })}
      />
      {error && <p>Error when trying to download: {error}</p>}
      {message && <p>{message}</p>}
    </main>
  );
}
