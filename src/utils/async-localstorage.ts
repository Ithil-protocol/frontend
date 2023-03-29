const mockStorage = new Map()

const delay = async () => {
  return await new Promise((resolve) => setTimeout(resolve, 0))
}

export const ClientLocalStorageCache = {
  setItem: async (key: string, value: string) => {
    if (typeof window === 'undefined') {
      return await Promise.resolve(mockStorage.set(key, value))
    }
    return await delay().then(() => localStorage.setItem(key, value))
  },

  getItem: async (key: string) => {
    if (typeof window === 'undefined') {
      return await Promise.resolve(mockStorage.get(key))
    }
    return await delay().then(() => localStorage.getItem(key))
  },

  removeItem: async (key: string) => {
    if (typeof window === 'undefined') {
      mockStorage.delete(key)
      return await Promise.resolve()
    }
    return await delay().then(() => localStorage.removeItem(key))
  },
}
