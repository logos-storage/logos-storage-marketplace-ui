import { Avatar, ProfileStats } from "ethereum-identity-kit";
import "./WalletLogin.css";

export function WalletConnect() {
  return (
    <div className="wallet-login">
      <Avatar
        address="0x1234...abcd"
        name="vitalik.eth"
        className="wallet-avatar"
      />
      <div>
        <header>
          <p>Account</p>
          <var>vitalik.eth</var>
        </header>
        <ProfileStats addressOrName="vitalik.eth" />
        <footer>
          <p>Connected</p>
          <a>Disconnect</a>
        </footer>
      </div>
    </div>
  );
}
