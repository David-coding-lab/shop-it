import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHUNK_SIZE = 400;
const COUNT_SUFFIX = ".__count";

const isWeb = Platform.OS === "web";

async function chunkGet(key: string): Promise<string | null> {
  const countRaw = await SecureStore.getItemAsync(`${key}${COUNT_SUFFIX}`);
  if (!countRaw) return null;

  const count = Number.parseInt(countRaw, 10);
  if (!Number.isFinite(count) || count < 0) return null;

  const chunks: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const chunk = await SecureStore.getItemAsync(`${key}.${i}`);
    if (chunk == null) return null;
    chunks.push(chunk);
  }
  return chunks.join("");
}

async function chunkSet(key: string, value: string): Promise<void> {
  const previousRaw = await SecureStore.getItemAsync(`${key}${COUNT_SUFFIX}`);
  const previousCount = previousRaw ? Number.parseInt(previousRaw, 10) || 0 : 0;

  const nextCount = Math.ceil(value.length / CHUNK_SIZE);
  for (let i = 0; i < nextCount; i += 1) {
    const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    await SecureStore.setItemAsync(`${key}.${i}`, chunk);
  }
  await SecureStore.setItemAsync(`${key}${COUNT_SUFFIX}`, String(nextCount));

  for (let i = nextCount; i < previousCount; i += 1) {
    await SecureStore.deleteItemAsync(`${key}.${i}`);
  }
}

async function chunkRemove(key: string): Promise<void> {
  const previousRaw = await SecureStore.getItemAsync(`${key}${COUNT_SUFFIX}`);
  const previousCount = previousRaw ? Number.parseInt(previousRaw, 10) || 0 : 0;

  for (let i = 0; i < previousCount; i += 1) {
    await SecureStore.deleteItemAsync(`${key}.${i}`);
  }
  await SecureStore.deleteItemAsync(`${key}${COUNT_SUFFIX}`);
}

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) return AsyncStorage.getItem(key);
    return chunkGet(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) return AsyncStorage.setItem(key, value);
    return chunkSet(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (isWeb) return AsyncStorage.removeItem(key);
    return chunkRemove(key);
  },
};
