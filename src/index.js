import React from "react";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";
import flattenMessages from "./utils/locales";
import es from "./locales/es.json";
import en from "./locales/en.json";
import App from "./App";

// import "antd/dist/antd.css";
// // import "./index.less";
import MainProvider from "./providers/provider";

// eslint-disable-next-line no-undef
const locale = window.navigator.language.split("-")[0];
const defaultLocale = "en";

const languages = { en, es };
const messages = languages[locale];

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#f58f98",
        },
      }}
    >
      <IntlProvider
        messages={flattenMessages(
          locale === "en" || locale === "es"
            ? messages
            : languages[defaultLocale]
        )}
        locale={locale === "en" || locale === "es" ? locale : defaultLocale}
        // defaultLocale={defaultLocale}
      >
        <BrowserRouter>
          <MainProvider>
            <App />
          </MainProvider>
        </BrowserRouter>
      </IntlProvider>
    </ConfigProvider>
  </React.StrictMode>,
  // eslint-disable-next-line no-undef
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
