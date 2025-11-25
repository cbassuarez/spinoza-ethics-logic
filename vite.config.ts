import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "/spinoza-ethics-logic/",
    build: {
        outDir: "docs",
    },
});
