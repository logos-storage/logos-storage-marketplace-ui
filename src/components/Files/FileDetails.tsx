import {
  ButtonIcon,
  Button,
  Sheets,
  WebFileIcon,
} from "@codex-storage/marketplace-ui-components";
import { CodexDataItem, CodexPurchase } from "@codex-storage/sdk-js";
import { Bytes } from "../../utils/bytes";
import { CidCopyButton } from "./CidCopyButton";
import "./FileDetails.css";
import { CodexSdk } from "../../sdk/codex";
import { FilesUtils } from "./files.utils";
import DownloadIcon from "../../assets/icons/download-file.svg?react";
import FileDetailsIcon from "../../assets/icons/file-details.svg?react";
import CloseIcon from "../../assets/icons/close.svg?react";
import { useQuery } from "@tanstack/react-query";
import { Promises } from "../../utils/promises";
import { PurchaseHistory } from "./PurchaseHistory";
import { WebStorage } from "../../utils/web-storage";

type Props = {
  details: CodexDataItem | null;
  onClose: () => void;
};

export function FileDetails({ onClose, details }: Props) {
  const { data: purchases = [] } = useQuery({
    queryFn: () =>
      CodexSdk.marketplace()
        .purchases()
        .then(async (res) => {
          if (res.error) {
            return res;
          }

          const all: CodexPurchase[] = [];
          for (const p of res.data) {
            const cid = await WebStorage.purchases.get(p.requestId);
            if (cid == details?.cid) {
              all.push(p);
            }
          }

          return {
            /* eslint-disable @typescript-eslint/prefer-as-const */
            error: false as false,
            data: all,
          };
        })
        .then((s) => Promises.rejectOnError(s)),
    queryKey: ["purchases"],

    enabled: !!details,

    // No need to retry because if the connection to the node
    // is back again, all the queries will be invalidated.
    retry: false,

    // The client node should be local, so display the cache value while
    // making a background request looks good.
    staleTime: 0,

    // Refreshing when focus returns can be useful if a user comes back
    // to the UI after performing an operation in the terminal.
    refetchOnWindowFocus: true,

    initialData: [],

    // Throw the error to the error boundary
    throwOnError: true,
  });

  const url = CodexSdk.url() + "/api/codex/v1/data/";

  const onDownload = () => window.open(url + details?.cid, "_target");

  return (
    <Sheets open={!!details} onClose={onClose}>
      <>
        {details && (
          <div className="file-details">
            <header>
              <FileDetailsIcon></FileDetailsIcon>
              <span>File details</span>
              <ButtonIcon
                onClick={onClose}
                variant="small"
                Icon={CloseIcon}></ButtonIcon>
            </header>

            <div className="preview">
              {FilesUtils.isImage(details.manifest.mimetype || "") ? (
                <img src={url + details.cid} />
              ) : (
                <figure>
                  <WebFileIcon
                    type={details.manifest.mimetype || ""}
                    size={32}
                  />
                  <p>File Preview not available.</p>
                </figure>
              )}
            </div>

            <ul>
              <li>
                <p>CID:</p>
                <p>{details.cid}</p>
              </li>

              <li>
                <p>File name:</p>
                <p>{details.manifest.filename}</p>
              </li>

              <li>
                <p>Date:</p>
                <p>
                  {FilesUtils.formatDate(
                    FilesUtils.getUploadedAt(details.cid)
                  ).toString()}
                </p>
              </li>

              <li>
                <p>Mimetype:</p>
                <p>{details.manifest.mimetype}</p>
              </li>

              <li>
                <p>Size:</p>
                <p>{Bytes.pretty(details.manifest.datasetSize)}</p>
              </li>

              <li>
                <p>Protected:</p>
                <p>{details.manifest.protected ? "Yes" : "No"}</p>
              </li>

              <li>
                <p>Used:</p>
                <p>
                  <b>{purchases.length} </b> purchase(s)
                </p>
              </li>
            </ul>

            <div className="buttons">
              <CidCopyButton cid={details.cid} />

              <Button
                Icon={() => <DownloadIcon width={20} />}
                label="Download"
                variant="outline"
                onClick={onDownload}></Button>
            </div>

            <PurchaseHistory purchases={purchases}></PurchaseHistory>
          </div>
        )}
      </>
    </Sheets>
  );
}
