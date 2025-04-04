import "./root.css";
import { Menu } from "../components/Menu/Menu";
import { useCallback, useState } from "react";
import { AppBar } from "../components/AppBar/AppBar";
import { Backdrop } from "@codex-storage/marketplace-ui-components";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useIsMobile } from "../hooks/useMobile";
import "ethereum-identity-kit/css";
import { TransactionProvider } from "ethereum-identity-kit";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../config";

export const Root = () => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const onExpanded = useCallback((val: boolean) => setIsExpanded(val), []);

  const onIconClick = () => {
    if (isMobile) {
      setIsExpanded(true);
    }
  };

  const onClose = () => setIsExpanded(false);

  return (
    <div className="layout">
      <Menu isExpanded={isExpanded} onExpanded={onExpanded}></Menu>

      <main>
        <AppBar onIconClick={onIconClick} onExpanded={onExpanded} />
        <div>
          <ScrollRestoration></ScrollRestoration>
          <WagmiProvider config={wagmiConfig}>
            <TransactionProvider>
              <Outlet />
            </TransactionProvider>
          </WagmiProvider>
        </div>
      </main>

      <Backdrop onClose={onClose} open={isExpanded && isMobile}></Backdrop>
    </div>
  );
};
