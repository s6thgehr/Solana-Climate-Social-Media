// This is an example of how to create a transaction with the mobile wallet adapter. This example transaction records a message in buffer format by calling the MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr program.
import {
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { useState } from "react";
// import { TextEncoder } from "text-encoding";
import useAuthorization from "./UseAuthorization";

export const recordMessage = async (
  messageBuffer: Buffer
): Promise<[string, RpcResponseAndContext<SignatureResult>]> => {
  // Get the authorize session and selected account from the useAuthorization util
  const { authorizeSession, selectedAccount } = useAuthorization();
  // Get connection
  const { connection } = useConnection();

  // Commence the transaction
  const [signature] = await transact(async (wallet) => {
    // This allows the user to authorize their wallet if they have not done so already
    const [freshAccount, latestBlockhash] = await Promise.all([
      authorizeSession(wallet),
      connection.getLatestBlockhash(),
    ]);
    // The below creates the actual transaction using the authorized wallet
    const memoProgramTransaction = new Transaction({
      ...latestBlockhash,
      feePayer:
        // Either the public key that was already selected when this method was called...
        selectedAccount?.publicKey ??
        // ...or the newly authorized public key.
        freshAccount.publicKey,
    });

    // Normally I would need to derive accounts here or somewhere above if necessary
    // Now create and add the instruction to the transaction
    memoProgramTransaction.add(
      new TransactionInstruction({
        data: messageBuffer,
        keys: [],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      })
    );

    // Send the transaction
    return await wallet.signAndSendTransactions({
      transactions: [memoProgramTransaction],
    });
  });

  // Verify that the transaction is successful and return the value
  return [signature, await connection.confirmTransaction(signature)];
};
