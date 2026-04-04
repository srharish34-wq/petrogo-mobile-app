/**
 * Storage Helper
 * Location: bunk/src/utils/storage.js
 */

const STORAGE_KEYS = {
  BUNK_TOKEN: 'bunkToken',
  BUNK_DATA: 'bunkData',
  BUNK_SETTINGS: 'bunkSettings',
  ORDER_FILTERS: 'orderFilters',
  THEME: 'theme',
  LANGUAGE: 'language'
};

class Storage {
  constructor() {
    this.prefix = 'petrogo_bunk_';
  }

  _getKey(key) {
    return `${this.prefix}${key}`;
  }

  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this._getKey(key), serialized);
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this._getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this._getKey(key));
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        this.remove(key);
      });
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  has(key) {
    return localStorage.getItem(this._getKey(key)) !== null;
  }

  getToken() {
    return this.get(STORAGE_KEYS.BUNK_TOKEN);
  }

  setToken(token) {
    return this.set(STORAGE_KEYS.BUNK_TOKEN, token);
  }

  removeToken() {
    return this.remove(STORAGE_KEYS.BUNK_TOKEN);
  }

  getBunkData() {
    return this.get(STORAGE_KEYS.BUNK_DATA);
  }

  setBunkData(data) {
    return this.set(STORAGE_KEYS.BUNK_DATA, data);
  }

  removeBunkData() {
    return this.remove(STORAGE_KEYS.BUNK_DATA);
  }

  getSettings() {
    return this.get(STORAGE_KEYS.BUNK_SETTINGS, {
      orderNotifications: true,
      emailNotifications: true,
      smsNotifications: true,
      lowStockAlerts: true,
      openTime: '06:00',
      closeTime: '22:00',
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      autoAcceptOrders: false,
      maxDailyOrders: 100,
      deliveryRadius: 10,
      minimumOrderAmount: 500,
      theme: 'light',
      language: 'en'
    });
  }

  setSettings(settings) {
    return this.set(STORAGE_KEYS.BUNK_SETTINGS, settings);
  }

  getOrderFilters() {
    return this.get(STORAGE_KEYS.ORDER_FILTERS, {
      status: 'all',
      dateRange: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }

  setOrderFilters(filters) {
    return this.set(STORAGE_KEYS.ORDER_FILTERS, filters);
  }

  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'light');
  }

  setTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme);
  }

  getLanguage() {
    return this.get(STORAGE_KEYS.LANGUAGE, 'en');
  }

  setLanguage(language) {
    return this.set(STORAGE_KEYS.LANGUAGE, language);
  }

  isAuthenticated() {
    return this.has(STORAGE_KEYS.BUNK_TOKEN) && this.has(STORAGE_KEYS.BUNK_DATA);
  }

  logout() {
    this.removeToken();
    this.removeBunkData();
  }

  export() {
    const data = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      const value = this.get(key);
      if (value !== null) {
        data[key] = value;
      }
    });
    return data;
  }

  import(data) {
    try {
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value);
      });
      return true;
    } catch (error) {
      console.error('Storage import error:', error);
      return false;
    }
  }

  getSize() {
    let total = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(this._getKey(key));
      if (item) {
        total += item.length * 2;
      }
    });
    return total;
  }

  getSizeInMB() {
    return (this.getSize() / (1024 * 1024)).toFixed(2);
  }

  getAll() {
    const data = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      data[key] = this.get(key);
    });
    return data;
  }
}

const storage = new Storage();

export const {
  set,
  get,
  remove,
  clear,
  has,
  getToken,
  setToken,
  removeToken,
  getBunkData,
  setBunkData,
  removeBunkData,
  getSettings,
  setSettings,
  getOrderFilters,
  setOrderFilters,
  getTheme,
  setTheme,
  getLanguage,
  setLanguage,
  isAuthenticated,
  logout,
  export: exportStorage,
  import: importStorage,
  getSize,
  getSizeInMB,
  getAll
} = storage;

export { STORAGE_KEYS };
export default storage;