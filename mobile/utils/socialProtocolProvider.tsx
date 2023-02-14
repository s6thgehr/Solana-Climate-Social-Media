import React, { useEffect, useState, useContext, createContext } from "react";
import { ProtocolOptions, SocialProtocol } from "@spling/social-protocol";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import useAuthorization from "./UseAuthorization";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const SocialProtocolContext = createContext({});

interface SocialProtocolContext {
  SocialProtocol?: SocialProtocol;
}

const SocialProtocolProvider = ({ children }: any) => {
  const [socialProtocol, setSocialPorotcol] = useState<SocialProtocol>();

  // Get the authorize session and selected account from the useAuthorization util
  const { authorizeSession, selectedAccount } = useAuthorization();
  // Get connection
  const { connection } = useConnection();

  // Create a wallet object to

  // Setup the configuration for the SocialProtocol
  const protocolOptions = {
    rpcUrl: "https://api.devnet.solana.com",
    useIndexer: true,
  } as ProtocolOptions;

  useEffect(() => {
    // Handle initializing the social protocol
    const initializeSocialProtocol = async () => {
      // This allows the user to authorize their wallet if they have not done so already
      await transact(async (wallet) => {
        const [freshAccount, latestBlockhash] = await Promise.all([
          authorizeSession(wallet),
          connection.getLatestBlockhash(),
        ]);
        // Create a SocialProtocol instance with the authorized wallet
        try {
          const socialProtocol: SocialProtocol = await new SocialProtocol(
            wallet, // user wallet
            null, // payer (optional)
            protocolOptions // protocol options defined above
          ).init();
          setSocialPorotcol(socialProtocol);
        } catch (error) {
          console.log(error);
        }
      });
    };

    initializeSocialProtocol();
  }, [selectedAccount]);

  const socialProtocolContext: SocialProtocolContext = {
    SocialProtocol: socialProtocol,
  };

  return (
    <SocialProtocolContext.Provider value={socialProtocolContext}>
      {children}
    </SocialProtocolContext.Provider>
  );
};

const useSocialProtocol = (): SocialProtocolContext => {
  return useContext(SocialProtocolContext);
};

export { SocialProtocolProvider, useSocialProtocol };
