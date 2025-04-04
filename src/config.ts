import { http, createConfig } from "wagmi";
import { linea, mainnet, sepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, linea],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [linea.id]: http(),
  },
});
