const CracoLessPlugin = require("craco-less");

module.exports = {
  eslint: {
    configure: {
      rules: {
        "react/prop-types": 0,
      },
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#F58F98",
              "@link-color": "#90525A",
              "@border-radius-base": "2px",
              "@background": "#121212",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
