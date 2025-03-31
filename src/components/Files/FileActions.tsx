import {
  Backdrop,
  ButtonIcon,
  Cell,
} from "@codex-storage/marketplace-ui-components";
import { FolderButton } from "./FolderButton";
import { CodexDataContent } from "@codex-storage/sdk-js";
import { CodexSdk } from "../../sdk/codex";
import "./FileActions.css";
import DownloadIcon from "../../assets/icons/download-file.svg?react";
import InfoFileIcon from "../../assets/icons/info-file.svg?react";
import DotsIcon from "../../assets/icons/dots.svg?react";
import { useIsMobile } from "../../hooks/useMobile";
import { useState } from "react";
import { attributes } from "../../utils/attributes";
import CopyIcon from "../../assets/icons/copy.svg?react";

type Props = {
  content: CodexDataContent;
  folders: [string, string[]][];
  onFolderToggle: (cid: string, folder: string) => void;
  onDetails: (cid: string) => void;
};

export function FileActions({
  content,
  folders,
  onFolderToggle,
  onDetails,
}: Props) {
  const isMobile = useIsMobile();
  const url = CodexSdk.url() + "/api/codex/v1/data/";
  const [isExpanded, setIsExpanded] = useState(false);

  const onClose = () => setIsExpanded(false);

  const onOpen = () => setIsExpanded(true);

  const onCopy = (cid: string) => {
    setIsExpanded(false);
    navigator.clipboard.writeText(cid);
  };

  if (isMobile) {
    return (
      <Cell className="file-actions">
        <>
          <ButtonIcon
            variant="small"
            onClick={onOpen}
            Icon={() => (
              <DotsIcon width={24} height={24}></DotsIcon>
            )}></ButtonIcon>
          <ul {...attributes({ "aria-expanded": isExpanded })}>
            <li
              onClick={() => {
                window.open(url + content.cid, "_blank");
                setIsExpanded(false);
              }}>
              <DownloadIcon width={20}></DownloadIcon> Download
            </li>
            <li
              onClick={() => {
                onDetails(content.cid);
                setIsExpanded(false);
              }}>
              <InfoFileIcon width={20}></InfoFileIcon> Details
            </li>
            <li onClick={() => onCopy(content.cid)}>
              <CopyIcon width={20}></CopyIcon> Copy
            </li>
          </ul>
          <Backdrop open={isExpanded} onClose={onClose}></Backdrop>
        </>
      </Cell>
    );
  }

  return (
    <Cell className="file-actions">
      <div>
        <ButtonIcon
          variant="small"
          animation="bounce"
          onClick={() => window.open(url + content.cid, "_blank")}
          Icon={() => <DownloadIcon width={20}></DownloadIcon>}></ButtonIcon>

        <FolderButton
          folders={folders.map(([folder, files]) => [
            folder,
            files.includes(content.cid),
          ])}
          onFolderToggle={(folder) => onFolderToggle(content.cid, folder)}
        />

        <ButtonIcon
          variant="small"
          onClick={() => onDetails(content.cid)}
          Icon={InfoFileIcon}></ButtonIcon>
      </div>
    </Cell>
  );
}
