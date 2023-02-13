import React, { useEffect, useState, useContext } from "react";
import { ProtocolOptions, SocialProtocol } from "@spling/social-protocol";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import useAuthorization from "../utils/useAuthorization";
import { useConnection } from "@solana/wallet-adapter-react";

const SocialProtocolProvider = () => {
  const [socialProtocol, setSocialPorotcol] = useState<SocialProtocol>();

  // Get the authorize session and selected account from the useAuthorization util
  const { authorizeSession, selectedAccount } = useAuthorization();
  // Get connection
  const { connection } = useConnection();

  // Setup the configuration for the SocialProtocol
  const protocolOptions = {
    rpcUrl: "https://api.mainnet-beta.solana.com/",
    useIndexer: true,
  } as ProtocolOptions;

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
};
