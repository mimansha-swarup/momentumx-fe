export const getLocalStorageData = <T>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed: unknown = JSON.parse(saved);
    if (typeof fallback === typeof parsed) return parsed as T;
    if (
      typeof fallback === "object" &&
      typeof parsed === "object" &&
      parsed !== null
    ) {
      return parsed as T;
    }
    return fallback;
  } catch {
    return fallback;
  }
};

export const setLocalStorageData = <T>(key: string, state: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Storage quota exceeded or unavailable
  }
};
