import * as uuid from "uuid";

const LOCAL_STORAGE_NAMESPACE = "SimpleREPL";
const storageKey = `${LOCAL_STORAGE_NAMESPACE}.sessionId`;

/**
 * Gets an existing session ID (if it exists in local storage) or creates a new one
 */
export function getSessionId(): string {
  const existingSessionId = localStorage.getItem(storageKey);
  if (existingSessionId) {
    return existingSessionId;
  }

  const newSessionId = uuid.v4();
  localStorage.setItem(storageKey, newSessionId);
  return newSessionId;
}

/**
 * Resets the session, generating a new session ID and persisting that to local storage
 */
export function resetSession(): string {
  const newSessionId = uuid.v4();
  localStorage.setItem(storageKey, newSessionId);
  return newSessionId;
}
