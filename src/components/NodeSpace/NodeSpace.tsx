import { useQuery } from "@tanstack/react-query";
import Loader from "../../assets/loader.svg";
import { CodexSdk } from "../../sdk/codex";
import { SpaceAllocation } from "@codex-storage/marketplace-ui-components";
import { Promises } from "../../utils/promises";
import "./NodeSpace.css";

const defaultSpace = {
  quotaMaxBytes: 0,
  quotaReservedBytes: 0,
  quotaUsedBytes: 0,
  totalBlocks: 0,
};

export function NodeSpace() {
  const { data: space, isPending } = useQuery({
    queryFn: () =>
      CodexSdk.client()
        .data.space()
        .then((s) => Promises.rejectOnError(s)),
    queryKey: ["space"],
    initialData: defaultSpace,

    // No need to retry because if the connection to the node
    // is back again, all the queries will be invalidated.
    retry: false,

    // The client node should be local, so display the cache value while
    // making a background request looks good.
    staleTime: 0,

    // Refreshing when focus returns can be useful if a user comes back
    // to the UI after performing an operation in the terminal.
    refetchOnWindowFocus: true,
  });

  if (isPending || !space) {
    return <img src={Loader} width={24} height={24} alt="Loader" />;
  }

  const { quotaMaxBytes, quotaReservedBytes, quotaUsedBytes } = space;

  return (
    <main className="node-space">
      <h6>Disk</h6>

      <SpaceAllocation
        data={[
          {
            title: "Allocated",
            size: quotaUsedBytes,
            color: "#FF6E61",
          },
          {
            title: "Available",
            size: quotaReservedBytes,
            color: "#34A0FF",
          },
          {
            title: "Free",
            size: quotaMaxBytes - quotaReservedBytes - quotaUsedBytes,
            color: "#6F6F6F",
          },
        ]}></SpaceAllocation>
    </main>
  );
}
