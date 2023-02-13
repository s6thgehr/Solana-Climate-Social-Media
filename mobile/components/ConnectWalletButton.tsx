import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import React, { ComponentProps, useState } from "react";
import { Button } from "react-native";

import useAuthorization from "../utils/useAuthorization";

type Props = Readonly<ComponentProps<typeof Button>>;

export default function ConnectWalletButton(props: Props) {
  const { authorizeSession } = useAuthorization();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);
  const handleConnectPress = async () => {
    try {
      if (authorizationInProgress) {
        return;
      }
      setAuthorizationInProgress(true);
      await transact(async (wallet) => {
        await authorizeSession(wallet);
      });
    } finally {
      setAuthorizationInProgress(false);
    }
  };
  return (
    <Button
      {...props}
      disabled={authorizationInProgress}
      onPress={handleConnectPress}
    />
  );
}
