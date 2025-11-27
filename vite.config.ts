import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    // App is served from the root of spinozaethics.org
    base: "/",
    build: {
        outDir: "docs",
    },
});