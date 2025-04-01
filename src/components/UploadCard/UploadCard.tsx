import { Upload } from "@codex-storage/marketplace-ui-components";
import { CodexSdk } from "../../sdk/codex";
import { useQueryClient } from "@tanstack/react-query";
import UploadIcon from "../../assets/icons/upload.svg?react";
import { FilesUtils } from "../Files/files.utils";

export function UploadCard() {
  const queryClient = useQueryClient();

  const onSuccess = (cid: string) => {
    FilesUtils.setUploadedAt(cid, Date.now() / 1000);
    queryClient.invalidateQueries({ queryKey: ["cids"] });
  };

  return (
    <main>
      <Upload
        multiple
        codexData={CodexSdk.client().data}
        onSuccess={onSuccess}
        Icon={() => <UploadIcon width={40} color={"#96969666"} />}
      />
    </main>
  );
}
