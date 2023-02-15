import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import React, {ComponentProps, useState} from 'react';
import {Button} from 'react-native-paper';
import useSocialProtocolStore from '../stores/useSocialProtocolStore';
import {ProtocolOptions, SocialProtocol} from '@spling/social-protocol';
import {Transaction} from '@solana/web3.js';

import useAuthorization from '../utils/useAuthorization';
import useGuardedCallback from '../utils/useGuardedCallback';

type Props = Readonly<ComponentProps<typeof Button>>;

export default function ConnectButton(props: Props) {
  const {selectedAccount, authorizeSession} = useAuthorization();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);
  const setSocialPorotcol = useSocialProtocolStore(
    state => state.setSocialPotocol,
  );

  const handleConnectPress = useGuardedCallback(async () => {
    try {
      if (authorizationInProgress) {
        return;
      }
      setAuthorizationInProgress(true);
      await transact(async wallet => {
        console.log('Authorizing...');
        const refreshed = await authorizeSession(wallet);
        const account = refreshed || selectedAccount;
        console.log('Account: ', account);
        const nodeWallet = {
          signTransaction: async (tx: Transaction) => {
            const transactions = await wallet.signTransactions({
              transactions: [tx],
            });
            // Mutation expected
            return Object.assign(tx, transactions[0]);
          },
          signAllTransactions(txs: Transaction[]) {
            return wallet.signTransactions({
              transactions: txs,
            });
          },
          async signMessage(message: Uint8Array) {
            return (
              await wallet.signMessages({
                addresses: [account.address],
                payloads: [message],
              })
            )[0];
          },
          publicKey: account.publicKey,
          payer: undefined as any,
        };
        try {
          const protocolOptions = {
            rpcUrl: 'https://api.mainnet-beta.solana.com/',
            useIndexer: true,
          } as ProtocolOptions;
          console.log('Creating social protocol');

          const socialProtocol: SocialProtocol = await new SocialProtocol(
            nodeWallet, // user wallet
            null, // payer (optional)
            protocolOptions, // protocol options defined above
          ).init();
          setSocialPorotcol(socialProtocol);
          console.log('Finished');
        } catch (error) {
          console.log(error);
        }
      });
    } finally {
      setAuthorizationInProgress(false);
    }
  }, []);

  return (
    <Button
      {...props}
      disabled={authorizationInProgress}
      onPress={handleConnectPress}
    />
  );
}
