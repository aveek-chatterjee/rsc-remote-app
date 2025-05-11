const { ModuleFederationPlugin } = require("webpack").container;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    if (!options.isServer) {
      console.log("Injecting MF for client...");
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "rsc_remote",
          filename: "static/chunks/remoteEntry.js",
          exposes: {
            "./ClientCounter": "./src/components/client/ClientCounter.jsx",
          },
        })
      );
      config.output.publicPath = "auto";
    }
    return config;
  },
};

module.exports = nextConfig;
