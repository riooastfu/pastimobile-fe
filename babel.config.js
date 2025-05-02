module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ["module:react-native-dotenv", {
      "moduleName": "@env", // How you'll import it (e.g., import { API_KEY } from '@env')
      "path": ".env",       // Path to your .env file
      "blocklist": null,    // Optional: Variables to exclude
      "allowlist": null,    // Optional: Variables to include (whitelist)
      "safe": false,        // Optional: If true, requires all vars in allowlist to be defined
      "allowUndefined": true, // Optional: If false, throws error for undefined vars
      "verbose": false      // Optional: Log diagnostics
    }]
  ]
};
