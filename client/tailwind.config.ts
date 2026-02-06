import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./state/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                white: "#ffffff",
                gray: {
                    100: "#f3f4f6",
                    200: "#e5e7eb",
                    300: "#d1d5db",
                    500: "#6b7280",
                    700: "#374151",
                    800: "#1f2937",
                },
                blue: {
                    200: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6",
                },
                "dark-bg": "#101214",
                "dark-secondary": "#1d1f21",
                "dark-tertiary": "#3b3d40",
                "blue-primary": "#0275ff",
                "stroke-dark": "#2d3135",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "scale-in": {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.2s ease-out",
                "scale-in": "scale-in 0.2s ease-out",
            },
        },
    },
    plugins: [],
};
export default config;