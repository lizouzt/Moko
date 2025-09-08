import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enTranslation from './en/translation.json'
import zhTranslation from './zh/translation.json'

i18next.use(initReactI18next).use(LanguageDetector).init({
  debug: process.env.NODE_ENV === "development",
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources: {
    zh: {
      translation: zhTranslation,
    },
    en: {
      translation: enTranslation,
    },
  },
  // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
  // set returnNull to false (and also in the i18next.d.ts options)
  // returnNull: false,
})

export default i18next