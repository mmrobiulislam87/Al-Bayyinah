import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Windows-এ প্যারালেল Webpack বিল্ড ওয়ার্কার মাঝেমাঝি আংশিক `.next` লিখে
   * (`Cannot find module './586.js'` ইত্যাদি)। এক সিঙ্গেল ওয়ার্কারে মিশে যাওয়া কমে।
   */
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;
