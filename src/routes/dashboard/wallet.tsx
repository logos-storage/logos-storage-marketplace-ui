import { Card } from "../../components/Card/Card";
import WalletIcon from "../../assets/icons/wallet.svg?react";
import PlusIcon from "../../assets/icons/plus.svg?react";
import RequestDurationIcon from "../../assets/icons/request-duration.svg?react";
import { RequireAssitance } from "../../components/RequireAssitance/RequireAssitance";
import "./wallet.css";
import BuySellIcon from "../../assets/icons/buy-sell.svg?react";
import SendIcon from "../../assets/icons/send.svg?react";
import SwapIcon from "../../assets/icons/swap.svg?react";
import BridgeIcon from "../../assets/icons/bridge.svg?react";
import ReceiveIcon from "../../assets/icons/receive.svg?react";
import ImportIcon from "../../assets/icons/import.svg?react";
import RefreshIcon from "../../assets/icons/refresh.svg?react";
import TokensIcon from "../../assets/icons/tokens.svg?react";
import FavoriteIcon from "../../assets/icons/favorite.svg?react";
import ContactsIcon from "../../assets/icons/contacts.svg?react";
import CodexTokenIcon from "../../assets/icons/codextoken.svg?react";
import EthereumIcon from "../../assets/icons/ethereum.svg?react";
import {
  ButtonIcon,
  TabProps,
  Tabs,
} from "@codex-storage/marketplace-ui-components";
import {
  CommonFollowers,
  FollowerTag,
  ProfileCard,
} from "ethereum-identity-kit";

export const WalletRoute = () => {
  const tabs: TabProps[] = [
    {
      label: "Tokens",
      Icon: TokensIcon,
    },
    {
      label: "NFTs",
      Icon: FavoriteIcon,
    },
    {
      label: "Contacts",
      Icon: ContactsIcon,
    },
  ];

  return (
    <div className="wallet-page">
      <Card
        icon={<WalletIcon width={24}></WalletIcon>}
        title="Connected Account"
        buttonLabel="Add Wallet"
        buttonIcon={() => <PlusIcon width={20} />}>
        <>
          <div className="buttons">
            <div>
              <ButtonIcon Icon={BuySellIcon} disabled></ButtonIcon>
              <small>Buy / Sell</small>
            </div>
            <div>
              <ButtonIcon Icon={SendIcon} disabled></ButtonIcon>
              <small>Send</small>
            </div>
            <div>
              <ButtonIcon Icon={SwapIcon} disabled></ButtonIcon>
              <small>Swap</small>
            </div>
            <div>
              <ButtonIcon Icon={BridgeIcon} disabled></ButtonIcon>
              <small>Bridge</small>
            </div>
            <span></span>
            <div>
              <ButtonIcon Icon={ReceiveIcon} disabled></ButtonIcon>
              <small>Receive</small>
            </div>
            <div>
              <ButtonIcon Icon={ImportIcon} disabled></ButtonIcon>
              <small>Import</small>
            </div>
            <div>
              <ButtonIcon Icon={RefreshIcon} disabled></ButtonIcon>
              <small>Refresh</small>
            </div>
          </div>
          <Tabs tabs={tabs} tabIndex={0} onTabChange={() => {}}></Tabs>
          <ul>
            <li>
              <ButtonIcon Icon={CodexTokenIcon} disabled></ButtonIcon>
              <div>
                <small>Codex</small>
                <p>123,223 CDX</p>
              </div>
            </li>
            <li>
              <ButtonIcon Icon={EthereumIcon} disabled></ButtonIcon>
              <div>
                <small>Ethereum</small>
                <p>2.32 ETH</p>
              </div>
            </li>
          </ul>
        </>
      </Card>
      <Card icon={<span></span>} title="">
        <div>
          <div>
            <RequestDurationIcon width={24}></RequestDurationIcon>
          </div>
          <div>You currently have no activity.</div>
          <RequireAssitance></RequireAssitance>
        </div>
      </Card>
    </div>
  );
};
