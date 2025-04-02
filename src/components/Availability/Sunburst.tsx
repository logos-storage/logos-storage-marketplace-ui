import { CodexNodeSpace } from "@codex-storage/sdk-js";
import { Times } from "../../utils/times";
import { Strings } from "../../utils/strings";
import { Bytes } from "../../utils/bytes";
import { useEffect, useRef, useState } from "react";
import { CallbackDataParams, ECBasicOption } from "echarts/types/dist/shared";
import * as echarts from "echarts/core";

// Import bar charts, all suffixed with Chart
import { SunburstChart } from "echarts/charts";
import { AvailabilityWithSlots } from "./types";
import "./Sunburst.css";
import { AvailabilityUtils } from "./availability.utils";

type Props = {
  availabilities: AvailabilityWithSlots[];
  space: CodexNodeSpace;
};

import { TooltipComponent } from "echarts/components";
import { SVGRenderer } from "echarts/renderers";

echarts.use([SunburstChart, TooltipComponent, SVGRenderer]);

export function Sunburst({ availabilities, space }: Props) {
  const div = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.EChartsType | null>(null);
  const [, setRefresher] = useState(Date.now());

  useEffect(() => {
    if (div.current && !chart.current) {
      chart.current = echarts.init(div.current, null, {
        renderer: "svg",
      });
      setRefresher(Date.now());
    }
  }, [chart, div]);

  useEffect(() => {
    const refresh = () => chart.current?.resize();

    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
    };
  }, []);

  const data = availabilities.map((a, index) => {
    return {
      name: Strings.shortId(a.id),
      value: a.totalSize,
      itemStyle: {
        color: AvailabilityUtils.availabilityColors[index],
        borderColor: "transparent",
      },
      tooltip: {
        backgroundColor: "#333",
        textStyle: {
          color: "#fff",
        },
        color: "white",
        formatter: (params: CallbackDataParams) => {
          return (
            params.marker +
            a.id +
            "<br/>" +
            "Duration " +
            Times.pretty(a.duration) +
            "<br/>" +
            "Total remaining collateral " +
            a.totalRemainingCollateral +
            "<br/>" +
            "Min price per byte per second " +
            a.minPricePerBytePerSecond +
            "<br/>" +
            "Size " +
            Bytes.pretty(a.totalSize)
          );
        },
      },
      children: a.slots.map((slot) => ({
        name: "",
        value: slot.size,
        children: [],
        itemStyle: {
          color: AvailabilityUtils.slotColors[index],
          borderColor: "transparent",
        },
        tooltip: {
          backgroundColor: "#333",
          textStyle: {
            color: "#fff",
          },
          formatter: (params: CallbackDataParams) => {
            return params.marker + "Slot " + slot.id + Bytes.pretty(slot.size);
          },
        },
      })),
    };
  });

  if (chart.current) {
    const option: ECBasicOption = {
      series: {
        type: "sunburst",
        data: [
          ...data,
          {
            name: "Space remaining",
            value:
              space.quotaMaxBytes -
              space.quotaReservedBytes -
              space.quotaUsedBytes,
            children: [],
            itemStyle: {
              color: "#2F2F2F",
              borderColor: "transparent",
            },
            tooltip: {
              backgroundColor: "#333",
              textStyle: {
                color: "#fff",
              },
              formatter: (params: CallbackDataParams) => {
                return (
                  params.marker +
                  " Space remaining " +
                  Bytes.pretty(
                    space.quotaMaxBytes -
                      space.quotaReservedBytes -
                      space.quotaUsedBytes
                  )
                );
              },
            },
          },
        ],
        radius: [60, "90%"],
        itemStyle: {
          borderWidth: 1,
        },
        label: {
          show: false,
        },
        levels: [
          {},
          {
            r0: "35%",
            r: "70%",
            label: {
              align: "right",
            },
          },
          {
            r0: "75%",
            r: "85%",
            itemStyle: {},
            label: {
              position: "outside",
              textShadowBlur: 5,
              textShadowColor: "#333",
            },
            downplay: {
              label: {
                opacity: 1,
              },
            },
          },
        ],
      },
      tooltip: {
        // type: "item",
      },
    };

    chart.current.setOption(option);
    chart.current?.resize();

    // chart.current.off("click");
    // chart.current.on("click", function (params) {
    //   // console.info(params.componentIndex);
    //   // console.info(params.dataIndex);

    //   const index = params.dataIndex;

    //   const detail =
    //     params.dataIndex === 0 ? null : availabilities[index - 1].id;

    //   document.dispatchEvent(
    //     new CustomEvent("codexavailabilityid", {
    //       detail,
    //     })
    //   );
    // });
  }

  const size = window.innerWidth > 500 ? 350 : 300;

  return (
    <div
      id="chart"
      ref={div}
      className="sunburst"
      style={{
        height: size,
      }}></div>
  );
}
