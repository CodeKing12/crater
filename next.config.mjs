import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    // distDir: "build",
    // assetPrefix: "./",
  // basePath: "/_next",
    // webpack: (config) => {
    //   // Add Electron main and preload scripts to the build process
    //   config.resolve.alias["@electron"] = path.resolve(__dirname, "electron");
    //   return config;
    // },
};

export default nextConfig;
