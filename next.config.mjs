import path from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "release/app",
  // Make sure to remove these. These are for testing electron-builder only
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // assetPrefix: "./",
  // basePath: "/_next",
  webpack: (config) => {
    // if (!isServer) {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "electron"),
            to: path.resolve(__dirname, "release/app/electron"),
          },
          {
            from: path.resolve(__dirname, "database"),
            to: path.resolve(__dirname, "release/app/database"),
          },
        ],
      }),
    );
    // }
    return config;
  },
};

export default nextConfig;
