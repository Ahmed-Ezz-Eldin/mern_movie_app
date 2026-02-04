import { createSlice } from '@reduxjs/toolkit';
import i18n from '../../i18n/index';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    lang: localStorage.getItem('lang') || 'en',
  },
  reducers: {
    toggleLanguage: (state) => {
      state.lang = state.lang === 'en' ? 'ar' : 'en';
      i18n.changeLanguage(state.lang);
      localStorage.setItem('lang', state.lang);
    },
  },
});

export const { toggleLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;
