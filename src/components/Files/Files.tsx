import { ChangeEvent, useEffect, useState } from "react";
import { Bytes } from "../../utils/bytes";
import "./Files.css";
import {
  Tabs,
  Input,
  Button,
  TabProps,
  Table,
  Row,
  Cell,
  TabSortState,
} from "@codex-storage/marketplace-ui-components";
import { FileDetails } from "./FileDetails.tsx";
import { useData } from "../../hooks/useData.tsx";
import { WebStorage } from "../../utils/web-storage.ts";
import { classnames } from "../../utils/classnames.ts";
import { CodexDataContent } from "@codex-storage/sdk-js";
import { FilesUtils } from "./files.utils.ts";
import { FilterFilters } from "./FileFilters.tsx";
import { FileCell } from "./FileCell.tsx";
import { FileActions } from "./FileActions.tsx";
import PlusIcon from "../../assets/icons/plus.svg?react";
import AllFilesIcon from "../../assets/icons/all.svg?react";
import FavoriteIcon from "../../assets/icons/favorite.svg?react";

type SortFn = (a: CodexDataContent, b: CodexDataContent) => number;

type Props = {
  limit?: number;
};

export function Files({ limit }: Props) {
  const files = useData();
  const [index, setIndex] = useState(0);
  const [folder, setFolder] = useState("");
  const [folders, setFolders] = useState<[string, string[]][]>([]);
  const [error, setError] = useState("");
  const [details, setDetails] = useState<CodexDataContent | null>(null);
  const [sortFn, setSortFn] = useState<SortFn>(() =>
    FilesUtils.sortByDate("desc")
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    WebStorage.folders.list().then((items) => setFolders(items));
  }, []);

  const onClose = () => setDetails(null);

  const onTabChange = async (i: number) => setIndex(i);

  const onDetails = (cid: string) => {
    const d = files.find((file) => file.cid === cid);

    if (d) {
      setDetails(d);
    }
  };

  const onFolderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setFolder(val);
    setError("");

    if (!val) {
      return;
    }

    if (e.currentTarget.checkValidity()) {
      if (folders.length >= 5) {
        setError("5 folders limit reached");
        return;
      }

      if (FilesUtils.exists(folders, val)) {
        setError("This folder already exists");
        return;
      }
    } else {
      setError("9 alpha characters maximum");
    }
  };

  const onFolderCreate = () => {
    WebStorage.folders.create(folder);

    setFolder("");
    setFolders([...folders, [folder, []]]);
  };

  // const onFolderDelete = (val: string) => {
  //   WebStorage.folders.delete(val);

  //   const currentIndex = folders.findIndex(([name]) => name === val);

  //   if (currentIndex + 1 == index) {
  //     setIndex(index - 1);
  //   }

  //   setFolders(folders.filter(([name]) => name !== val));
  // };

  const onFolderToggle = (cid: string, folder: string) => {
    const current = folders.find(([name]) => name === folder);

    if (!current) {
      return;
    }

    const [, files] = current;

    if (files.includes(cid)) {
      WebStorage.folders.deleteFile(folder, cid);
      setFolders(FilesUtils.removeCidFromFolder(folders, folder, cid));
    } else {
      WebStorage.folders.addFile(folder, cid);
      setFolders(FilesUtils.addCidToFolder(folders, folder, cid));
    }
  };

  const tabs: TabProps[] = folders.map(([folder], index) => ({
    label: folder,
    Icon: () => (index === 0 ? <FavoriteIcon></FavoriteIcon> : null),
    // IconAfter:
    //   folder === "Favorites"
    //     ? undefined
    //     : () => (
    //         <X
    //           size={"1rem"}
    //           onClick={(e) => {
    //             e.preventDefault();
    //             e.stopPropagation();

    //             onFolderDelete(folder);
    //           }}></X>
    //       ),
  }));

  const onSortByFilename = (state: TabSortState) =>
    setSortFn(() => FilesUtils.sortByName(state));

  const onSortBySize = (state: TabSortState) =>
    setSortFn(() => FilesUtils.sortBySize(state));

  const onSortByDate = (state: TabSortState) =>
    setSortFn(() => FilesUtils.sortByDate(state));

  const onToggleFilter = (filter: string) =>
    setSelectedFilters(FilesUtils.toggleFilters(selectedFilters, filter));

  const headers = [
    ["file", onSortByFilename],
    ["size", onSortBySize],
    ["date", onSortByDate],
    ["actions"],
  ] satisfies [string, ((state: TabSortState) => void)?][];

  const items = FilesUtils.listInFolder(files, folders, index);
  const filtered = FilesUtils.applyFilters(items, selectedFilters);
  const sorted = sortFn ? [...filtered].sort(sortFn) : filtered;
  let rows =
    sorted.map((c) => (
      <Row
        cells={[
          <FileCell content={c}></FileCell>,
          <Cell>{Bytes.pretty(c.manifest.datasetSize)}</Cell>,
          <Cell>
            {FilesUtils.formatDate(FilesUtils.getUploadedAt(c.cid)).toString()}
          </Cell>,
          <FileActions
            content={c}
            folders={folders}
            onDetails={onDetails}
            onFolderToggle={onFolderToggle}></FileActions>,
        ]}></Row>
    )) || [];

  if (limit) {
    rows = rows.slice(0, limit);
  }

  tabs.unshift({
    label: "All",
    Icon: () => <AllFilesIcon></AllFilesIcon>,
  });

  return (
    <main className="files">
      <section>
        <Tabs onTabChange={onTabChange} tabIndex={index} tabs={tabs}></Tabs>
        <div className="row gap">
          <Input
            id="folder"
            inputClassName={classnames(["files-folders"])}
            isInvalid={folder !== "" && !!error}
            value={folder}
            required={true}
            pattern="[A-Za-z0-9_\-]*"
            autoComplete="off"
            maxLength={9}
            variant={"medium"}
            placeholder="Folder name"
            onChange={onFolderChange}></Input>

          <Button
            label="Folder"
            Icon={() => <PlusIcon width={24}></PlusIcon>}
            variant="outline"
            size="small"
            disabled={!!error || !folder}
            onClick={onFolderCreate}></Button>
        </div>
      </section>

      <FilterFilters
        files={files}
        onFilterToggle={onToggleFilter}
        selected={selectedFilters}
      />

      <Table headers={headers} rows={rows} defaultSortIndex={2} />

      <FileDetails onClose={onClose} details={details} />
    </main>
  );
}
