import { useQuery } from "@tanstack/react-query";
import { CodexSdk } from "../sdk/codex";
import { Promises } from "../utils/promises";

const report = false;

export function useCodexConnection() {
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ["spr"],
    queryFn: async () => {
      return CodexSdk.client()
        .node.spr()
        .then((data) => Promises.rejectOnError(data, report));
    },
    refetchInterval: 5000,

    // No need to retry because we defined a refetch interval
    retry: false,

    // The client node should be local, so display the cache value while
    // making a background request looks good.
    staleTime: 0,

    // Refreshing when focus returns can be useful if a user comes back
    // to the UI after performing an operation in the terminal.
    refetchOnWindowFocus: true,

    // Cache is not useful for the spr endpoint
    gcTime: 0,

    throwOnError: false,
  });

  return { enabled: !isError && !!data, isFetching, refetch };
}
