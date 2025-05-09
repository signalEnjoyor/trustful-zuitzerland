import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
 
export const cbWalletConnector = coinbaseWallet({
  appName: "Wagmi Smart Wallet",
  preference: "smartWalletOnly",
});
 
export const wagmiConfig = createConfig({
  chains: [base],
  // turn off injected provider discovery
  multiInjectedProviderDiscovery: false,
  connectors: [cbWalletConnector],
  ssr: true,
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT),
  },
});
 
declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

