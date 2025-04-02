import { TabSortState } from "@codex-storage/marketplace-ui-components";
import { CodexDataItem } from "@codex-storage/sdk-js";

const archiveMimetypes = [
  "application/zip",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/gzip",
  "application/x-7z-compressed",
  "application/gzip", // for .tar.gz
  "application/x-bzip2",
  "application/x-xz",
];

export const FilesUtils = {
  isImage(type: string | null) {
    return !!type && type.startsWith("image");
  },
  isVideo(type: string | null) {
    return !!type && type.startsWith("video");
  },
  isArchive(mimetype: string | null) {
    return !!mimetype && archiveMimetypes.includes(mimetype);
  },
  type(mimetype: string | null) {
    if (FilesUtils.isArchive(mimetype)) {
      return "archive";
    }

    if (FilesUtils.isVideo(mimetype)) {
      return "video";
    }

    if (FilesUtils.isImage(mimetype)) {
      return "image";
    }

    return "document";
  },
  sortByName: (state: TabSortState) => (a: CodexDataItem, b: CodexDataItem) => {
    const {
      manifest: { filename: afilename },
    } = a;
    const {
      manifest: { filename: bfilename },
    } = b;

    return state === "desc"
      ? (bfilename || "")
          .toLocaleLowerCase()
          .localeCompare((afilename || "").toLocaleLowerCase())
      : (afilename || "")
          .toLocaleLowerCase()
          .localeCompare((bfilename || "").toLocaleLowerCase());
  },
  sortBySize: (state: TabSortState) => (a: CodexDataItem, b: CodexDataItem) =>
    state === "desc"
      ? b.manifest.datasetSize - a.manifest.datasetSize
      : a.manifest.datasetSize - b.manifest.datasetSize,
  sortByDate: (state: TabSortState) => (a: CodexDataItem, b: CodexDataItem) => {
    const aUploadedAt = FilesUtils.getUploadedAt(a.cid);
    const bUploadedAt = FilesUtils.getUploadedAt(b.cid);

    return state === "desc"
      ? new Date(bUploadedAt).getTime() - new Date(aUploadedAt).getTime()
      : new Date(aUploadedAt).getTime() - new Date(bUploadedAt).getTime();
  },

  removeCidFromFolder(
    folders: [string, string[]][],
    folder: string,
    cid: string
  ): [string, string[]][] {
    return folders.map(([name, files]) =>
      name === folder ? [name, files.filter((id) => id !== cid)] : [name, files]
    );
  },
  addCidToFolder(
    folders: [string, string[]][],
    folder: string,
    cid: string
  ): [string, string[]][] {
    return folders.map(([name, files]) =>
      name === folder ? [name, [...files, cid]] : [name, files]
    );
  },
  exists(folders: [string, string[]][], name: string) {
    return !!folders.find(([folder]) => folder === name);
  },
  toggleFilters: (filters: string[], filter: string) =>
    filters.includes(filter)
      ? filters.filter((f) => f !== filter)
      : [...filters, filter],
  listInFolder(
    files: CodexDataItem[],
    folders: [string, string[]][],
    index: number
  ) {
    return index === 0
      ? files
      : files.filter((file) => folders[index - 1][1].includes(file.cid));
  },
  applyFilters(files: CodexDataItem[], filters: string[]) {
    return files.filter(
      (file) =>
        filters.length === 0 ||
        filters.includes(this.type(file.manifest.mimetype || ""))
    );
  },
  formatDate(date: number) {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date * 1000));
  },
  getUploadedAt(key: string) {
    return parseInt(localStorage.getItem(key + "-uploadedAt") || "0", 10);
  },

  setUploadedAt(key: string, value: number) {
    localStorage.setItem(key + "-uploadedAt", value.toString());
  },
};

export type CodexFileMetadata = {
  type: string;
  name: string;
};
