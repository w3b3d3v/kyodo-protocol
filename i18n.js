import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import * as Yup from "yup"

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  })

function setupYup() {
  Yup.setLocale({
    mixed: {
      required: ({ path }) => i18n.t("validation.required", { field: i18n.t(path) }),
    },
  })
}

i18n.on("initialized", setupYup)
i18n.on("languageChanged", setupYup)

//   // ... other Yup configurations
// })

export default i18n
