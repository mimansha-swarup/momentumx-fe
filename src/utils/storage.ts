export const getLocalStorageData = <T>(key: string, state: T) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : state;
  } catch {
    return state;
  }
};

export const setLocalStorageData = <T>(key: string, state: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Storage quota exceeded or unavailable
  }
};
