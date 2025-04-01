import { Button, Input } from "@codex-storage/marketplace-ui-components";
import "./ManifestFetch.css";
import { ChangeEvent, useState } from "react";
import { CodexSdk } from "../../sdk/codex";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Promises } from "../../utils/promises";

export function ManifestFetch() {
  const [cid, setCid] = useState("");
  const queryClient = useQueryClient();

  const { refetch } = useQuery({
    queryFn: () => {
      CodexSdk.client()
        .data.networkDownload(cid)
        .then((s) => {
          if (s.error === false) {
            setCid("");
            queryClient.invalidateQueries({ queryKey: ["cids"] });
          }
          return Promises.rejectOnError(s);
        });

      return CodexSdk.client()
        .data.fetchManifest(cid)
        .then((s) => {
          if (s.error === false) {
            setCid("");
            queryClient.invalidateQueries({ queryKey: ["cids"] });
          }
          return Promises.rejectOnError(s);
        });
    },
    queryKey: ["manifest"],

    // Disable the fetch to make it available on refetch only
    enabled: false,

    // No need to retry because if the connection to the node
    // is back again, all the queries will be invalidated.
    retry: false,

    // The client node should be local, so display the cache value while
    // making a background request looks good.
    staleTime: 0,

    refetchOnWindowFocus: false,
  });

  const onDownload = () => refetch();

  const onCidChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCid(e.currentTarget.value);

  return (
    <div className="manifest-fetch">
      <Input
        id="cid"
        value={cid}
        placeholder="CID"
        variant={"medium"}
        autoComplete="off"
        onChange={onCidChange}></Input>
      <Button label="Fetch" onClick={onDownload} variant="outline"></Button>
    </div>
  );
}
