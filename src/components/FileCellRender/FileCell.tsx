import { useEffect, useState } from "react";
import {
  Cell,
  Tooltip,
  WebFileIcon,
} from "@codex-storage/marketplace-ui-components";
import "./FileCell.css";
import { WebStorage } from "../../utils/web-storage";
import { CodexDataContent } from "@codex-storage/sdk-js";
import { FilesUtils } from "../Files/files.utils";

type FileMetadata = {
  mimetype: string | null;
  uploadedAt: number;
  filename: string | null;
};

type Props = {
  requestId: string;
  purchaseCid: string;
  index: number;
  data: CodexDataContent[];
  onMetadata?: (requestId: string, metadata: FileMetadata) => void;
};

export function FileCell({ requestId, purchaseCid, data, onMetadata }: Props) {
  const [cid, setCid] = useState(purchaseCid);
  const [metadata, setMetadata] = useState<FileMetadata>({
    filename: "-",
    mimetype: "-",
    uploadedAt: 0,
  });

  useEffect(() => {
    WebStorage.purchases.get(requestId).then((cid) => {
      if (cid) {
        setCid(cid);

        const content = data.find((m) => m.cid === cid);
        if (content) {
          const { filename = "-", mimetype = "application/octet-stream" } =
            content.manifest;
          const uploadedAt = FilesUtils.getUploadedAt(content.cid);

          setMetadata({
            filename,
            mimetype,
            uploadedAt,
          });
          onMetadata?.(requestId, {
            filename,
            mimetype,
            uploadedAt,
          });
        }
      }
    });
  }, [requestId, data, onMetadata]);

  let filename = metadata.filename || "-";

  if (filename.length > 10) {
    const [name, ext] = filename.split(".");
    filename = name.slice(0, 10) + "..." + ext;
  }

  // const cidTruncated = cid.slice(0, 5) + ".".repeat(5) + cid.slice(-5);
  const cidTruncated = cid.slice(0, 10) + "...";

  return (
    <Cell>
      <div className="file-render">
        <WebFileIcon type={metadata.mimetype || "-"} />
        <div>
          <div>
            <Tooltip message={filename}>{filename}</Tooltip>
          </div>
          <div>
            <Tooltip message={cid}>
              <small>{cidTruncated}</small>
            </Tooltip>
          </div>
        </div>
      </div>
    </Cell>
  );
}
