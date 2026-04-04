/**
 * Auth Service
 * Location: bunk/src/services/authService.js
 *
 * Login flow (uses existing backend, NO new endpoints):
 *   1. GET /api/v1/bunks → returns all active verified bunks
 *   2. Find the bunk where contactPerson.phone === entered phone
 *   3. Store bunk in localStorage — bunk._id is used for all future API calls
 */

import api from './api';

const BUNK_TOKEN_KEY = 'bunkToken';
const BUNK_DATA_KEY  = 'bunkData';

const authService = {

  /**
   * Login by registered phone number (contactPerson.phone)
   * Uses existing: GET /api/v1/bunks
   */
  login: async ({ phone }) => {
    // GET /api/v1/bunks
    // Returns: { status: 'success', data: { bunks: [...], count: N } }
    const { data } = await api.get('/bunks');
    const bunks = data.data.bunks || [];

    // Match against contactPerson.phone
    const bunk = bunks.find(
      (b) => b.contactPerson?.phone === phone.trim()
    );

    if (!bunk) {
      throw new Error(
        'No active petrol bunk found for this phone number. Please contact support.'
      );
    }

    // Simple session token — replace with JWT if needed later
    const token = `bunk_${bunk._id}_${Date.now()}`;

    localStorage.setItem(BUNK_TOKEN_KEY, token);
    localStorage.setItem(BUNK_DATA_KEY, JSON.stringify(bunk));

    return { bunk, token };
  },

  /**
   * Logout — clears session
   */
  logout: () => {
    localStorage.removeItem(BUNK_TOKEN_KEY);
    localStorage.removeItem(BUNK_DATA_KEY);
  },

  /**
   * Returns true if a session token exists
   */
  isAuthenticated: () => {
    return Boolean(localStorage.getItem(BUNK_TOKEN_KEY));
  },

  /**
   * Returns the stored bunk object
   * { _id, name, contactPerson, address, fuelAvailability, rating, stats, ... }
   */
  getBunkData: () => {
    try {
      const raw = localStorage.getItem(BUNK_DATA_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Re-fetch bunk from backend and refresh localStorage
   * Uses existing: GET /api/v1/bunks/:bunkId
   */
  getCurrentBunk: async () => {
    const bunk = authService.getBunkData();
    if (!bunk?._id) throw new Error('No bunk session found');
    const { data } = await api.get(`/bunks/${bunk._id}`);
    const fresh = data.data.bunk;
    localStorage.setItem(BUNK_DATA_KEY, JSON.stringify(fresh));
    return data;
  },
};

export default authService;