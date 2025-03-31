import { CodexDataContent } from "@codex-storage/sdk-js";
import { FilesUtils } from "./files.utils";
import { classnames } from "../../utils/classnames";
import "./FileFilters.css";
import ImageIcon from "../../assets/icons/image.svg?react";
import VideoIcon from "../../assets/icons/video.svg?react";
import ArchiveIcon from "../../assets/icons/archive.svg?react";
import DocumentIcon from "../../assets/icons/document.svg?react";

type Props = {
  files: CodexDataContent[];
  onFilterToggle: (filter: string) => void;
  selected: string[];
};

function getIcon(type: string) {
  switch (type) {
    case "image": {
      return <ImageIcon></ImageIcon>;
    }

    case "archive": {
      return <ArchiveIcon></ArchiveIcon>;
    }

    case "video": {
      return <VideoIcon></VideoIcon>;
    }

    default: {
      return <DocumentIcon></DocumentIcon>;
    }
  }
}

function getType(mimetype: string) {
  if (FilesUtils.isArchive(mimetype)) {
    return "archive";
  }

  if (FilesUtils.isImage(mimetype)) {
    return "image";
  }

  if (FilesUtils.isVideo(mimetype)) {
    return "video";
  }

  return "document";
}

export function FilterFilters({ selected, files, onFilterToggle }: Props) {
  const filters = Array.from(
    new Set(
      files
        .filter((f) => f.manifest.mimetype !== "")
        .map((file) => getType(file.manifest.mimetype || ""))
    )
  );

  const html = filters.map((type) => {
    const count = files.reduce(
      (acc, file) =>
        getType(file.manifest.mimetype || "") === type ? acc + 1 : acc,
      0
    );

    return (
      <span
        key={type}
        className={classnames(
          ["filter"],
          ["filter--active", selected.includes(type)]
        )}
        onClick={() => onFilterToggle(type)}>
        {getIcon(type)}
        <span>
          {type + "s"} ({count})
        </span>
      </span>
    );
  });

  return <div className="filters">{html}</div>;
}
