import {
  Row,
  Cell,
  Table,
  TabSortState,
} from "@codex-storage/marketplace-ui-components";
import { Times } from "../../utils/times";
import { CustomStateCellRender } from "../CustomStateCellRender/CustomStateCellRender";
import { TruncateCell } from "../TruncateCell/TruncateCell";
import { CodexPurchase } from "@codex-storage/sdk-js";
import PurchaseHistoryIcon from "../../assets/icons/purchase-history-outline.svg?react";
import { useState } from "react";
import { PurchaseUtils } from "../Purchase/purchase.utils";

type Props = {
  purchases: CodexPurchase[];
};

type SortFn = (a: CodexPurchase, b: CodexPurchase) => number;

export function PurchaseHistory({ purchases }: Props) {
  const [sortFn, setSortFn] = useState<SortFn>(() =>
    PurchaseUtils.sortById("desc")
  );

  const onSortById = (state: TabSortState) =>
    setSortFn(() => PurchaseUtils.sortById(state));

  const headers = [
    ["request id", onSortById],
    ["duration"],
    ["expiry"],
    ["status"],
  ] satisfies [string, ((state: TabSortState) => void)?][];

  const sorted = sortFn ? [...purchases].sort(sortFn) : purchases;

  const rows = sorted
    .filter((p) => !!p.request)
    .map((p) => {
      const duration = parseInt(p.request!.ask.duration, 10);

      return (
        <Row
          cells={[
            <TruncateCell value={p.requestId} />,
            <Cell>{Times.pretty(duration)}</Cell>,
            <Cell>{p.request!.expiry}</Cell>,
            <CustomStateCellRender state={p.state} message={p.error || ""} />,
          ]}></Row>
      );
    });

  if (purchases.length > 0) {
    return (
      <div className="purchases">
        <header>
          <span>
            <PurchaseHistoryIcon></PurchaseHistoryIcon> Purchase history
          </span>
        </header>

        <Table headers={headers} rows={rows} defaultSortIndex={0}></Table>
      </div>
    );
  }

  return "";
}
