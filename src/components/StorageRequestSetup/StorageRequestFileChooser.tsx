import { CodexSdk } from "../../sdk/codex";
import "./StorageRequestFileChooser.css";
import { ChangeEvent, useEffect } from "react";
import {
  Dropdown,
  DropdownOption,
  Upload,
  WebFileIcon,
} from "@codex-storage/marketplace-ui-components";
import { useData } from "../../hooks/useData";
import { StorageRequestComponentProps } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import ChooseCidIcon from "../../assets/icons/choose-cid.svg?react";
import UploadIcon from "../../assets/icons/upload.svg?react";
import { FilesUtils } from "../Files/files.utils";

export function StorageRequestFileChooser({
  storageRequest,
  dispatch,
  onStorageRequestChange,
}: StorageRequestComponentProps) {
  const queryClient = useQueryClient();
  const files = useData();

  useEffect(() => {
    dispatch({
      type: "toggle-buttons",
      isNextEnable: !!storageRequest.cid,
      isBackEnable: true,
    });
  }, [dispatch, storageRequest]);

  const onSelected = (o: DropdownOption) => {
    onStorageRequestChange({ cid: o.subtitle });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    onStorageRequestChange({ cid: value });
  };

  const onSuccess = (data: string) => {
    FilesUtils.setUploadedAt(data, Date.now() / 1000);

    queryClient.invalidateQueries({ queryKey: ["cids"] });

    onStorageRequestChange({ cid: data });
  };

  const onDelete = () => onStorageRequestChange({ cid: "" });

  const options =
    files.map((f) => {
      return {
        Icon: () => <WebFileIcon type={f.manifest.mimetype || ""} size={24} />,
        title: f.manifest.filename || "",
        subtitle: f.cid,
      };
    }) || [];

  return (
    <div className="file-chooser">
      <header>
        <ChooseCidIcon></ChooseCidIcon>
        <h6>Choose a CID</h6>
      </header>

      <Dropdown
        label=""
        id="cid"
        placeholder="CID"
        onChange={onChange}
        value={storageRequest.cid || ""}
        options={options}
        onSelected={onSelected}
        variant="medium"
      />

      <div className="row gap">
        <hr />
        <span>OR</span>
        <hr />
      </div>

      <div className="row gap">
        <UploadIcon width={24} color="#969696"></UploadIcon>
        <h6>Upload</h6>
      </div>

      <Upload
        onSuccess={onSuccess}
        editable={false}
        multiple={false}
        onDeleteItem={onDelete}
        codexData={CodexSdk.client().data}
        successMessage={"Success, the CID has been copied to the field on top."}
      />
    </div>
  );
}
