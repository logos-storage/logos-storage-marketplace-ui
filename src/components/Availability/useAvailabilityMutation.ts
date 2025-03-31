import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Promises } from "../../utils/promises";
import { WebStorage } from "../../utils/web-storage";
import { AvailabilityState } from "./types";
import { Dispatch, useState } from "react";
import {
  StepperAction,
  StepperState,
} from "@codex-storage/marketplace-ui-components";
import { CodexSdk } from "../../sdk/codex";
import { CodexAvailability } from "@codex-storage/sdk-js";
import { Times } from "../../utils/times";
import { AvailabilityUtils } from "./availability.utils";

export function useAvailabilityMutation(
  dispatch: Dispatch<StepperAction>,
  state: StepperState
) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error | null>(null);

  const { mutateAsync } = useMutation({
    /* eslint-disable @typescript-eslint/no-unused-vars */
    mutationFn: ({
      totalSize,
      totalSizeUnit,
      duration,
      durationUnit,
      name,
      ...input
    }: AvailabilityState) => {
      const fn: (
        input: Omit<AvailabilityState, "totalSizeUnit" | "durationUnit">
      ) => Promise<"" | CodexAvailability> = input.id
        ? (input) => {
            return CodexSdk.marketplace()
              .updateAvailability({
                totalSize: input.totalSize,
                duration: input.duration,
                minPricePerBytePerSecond: input.minPricePerBytePerSecond,
                totalCollateral: input.totalCollateral,
                id: input.id || "",
              })
              .then((s) => Promises.rejectOnError(s));
          }
        : (input) =>
            CodexSdk.marketplace()
              .createAvailability(input)
              .then((s) => Promises.rejectOnError(s));

      return fn({
        ...input,
        duration: Times.value(durationUnit) * duration,
        totalSize: Math.trunc(
          totalSize * AvailabilityUtils.unitValue(totalSizeUnit)
        ),
      });
    },
    onSuccess: (res, body) => {
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
      queryClient.invalidateQueries({ queryKey: ["space"] });

      WebStorage.delete("availability-1");
      WebStorage.delete("availability-step");

      if (typeof res === "object" && body.name) {
        WebStorage.availabilities.add(res.id, body.name);
      }

      setError(null);

      dispatch({
        type: "next",
        step: state.step,
      });
    },
    onError: (error) => {
      setError(error);

      WebStorage.set("availability-step", state.step - 1);

      dispatch({
        type: "next",
        step: state.step,
      });
    },

    throwOnError: false,
  });

  return { mutateAsync, error };
}
