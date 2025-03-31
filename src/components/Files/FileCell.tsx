import {
  ButtonIcon,
  Cell,
  Toast,
  WebFileIcon,
} from "@codex-storage/marketplace-ui-components";
import { CodexDataContent } from "@codex-storage/sdk-js";
import { useState } from "react";
import "./FileCell.css";
import CopyIcon from "../../assets/icons/copy.svg?react";

type Props = {
  content: CodexDataContent;
};

export function FileCell({ content }: Props) {
  const [toast, setToast] = useState({
    time: 0,
    message: "",
    variant: "success" as "success" | "error",
  });

  const onCopy = (cid: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cid);
      setToast({
        message: "CID copied to the clipboard.",
        time: Date.now(),
        variant: "success" as "success",
      });
    } else {
      setToast({
        message: "Sorry the CID cannot be copied to the clipboard.",
        time: Date.now(),
        variant: "error" as "error",
      });
    }
  };

  return (
    <>
      <Cell className="file-cell">
        <div>
          <WebFileIcon type={content.manifest.mimetype || ""} />

          <div>
            <p>
              <b>{content.manifest.filename}</b>
            </p>
            <p>
              <small>{content.cid}</small>
            </p>
          </div>
          <ButtonIcon
            variant="small"
            onClick={() => onCopy(content.cid)}
            animation="buzz"
            Icon={(props) => (
              <CopyIcon {...props} width={20} color="#969696" />
            )}></ButtonIcon>
        </div>

        <Toast
          message={toast.message}
          time={toast.time}
          variant={toast.variant}
        />
      </Cell>
    </>
  );
}
