import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  AppState,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl, PublicKey, PublicKeyInitData } from "@solana/web3.js";
import React, { Suspense } from "react";
import { Cache, SWRConfig } from "swr";
import { SocialProtocolProvider } from "./utils/SocialProtocolProvider";

const DEVNET_ENDPOINT = /*#__PURE__*/ clusterApiUrl("devnet");

function cacheReviver(key: string, value: any) {
  if (key === "publicKey") {
    return new PublicKey(value as PublicKeyInitData);
  } else {
    return value;
  }
}

const STORAGE_KEY = "app-cache";
let initialCacheFetchPromise: Promise<void>;
let initialCacheFetchResult: any;
function asyncStorageProvider() {
  if (initialCacheFetchPromise == null) {
    initialCacheFetchPromise = AsyncStorage.getItem(STORAGE_KEY).then(
      (result) => {
        initialCacheFetchResult = result;
      }
    );
    throw initialCacheFetchPromise;
  }
  let storedAppCache;
  try {
    storedAppCache = JSON.parse(initialCacheFetchResult, cacheReviver);
  } catch {}
  const map = new Map(storedAppCache || []);
  initialCacheFetchResult = undefined;
  function persistCache() {
    const appCache = JSON.stringify(Array.from(map.entries()));
    AsyncStorage.setItem(STORAGE_KEY, appCache);
  }
  AppState.addEventListener("change", (state) => {
    if (state !== "active") {
      persistCache();
    }
  });
  AppState.addEventListener("memoryWarning", () => {
    persistCache();
  });
  return map as Cache<any>;
}

export default function App() {
  return (
    <ConnectionProvider
      config={{ commitment: "processed" }}
      endpoint={DEVNET_ENDPOINT}
    >
      <SWRConfig value={{ provider: asyncStorageProvider }}>
        <SocialProtocolProvider>
          {/* App goes here */}
          <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <StatusBar style="auto" />
          </View>
          {/* App ends here */}
        </SocialProtocolProvider>
      </SWRConfig>
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
