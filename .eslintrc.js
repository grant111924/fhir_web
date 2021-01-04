module.exports = {
  extends: [
    "eslint:recommended",
  ],
  env: {
    browser: true,
    node:true
  },
  parser: "babel-eslint",
  rules:{
    'no-alert': 0,
    'no-console': 0,
    'global-require': 0,
  }
};

