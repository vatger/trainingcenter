/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class", '[data-mode="dark"]'],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
    safelist: [
        "button bg-red-50 dark:bg-red-500 dark:bg-opacity-20 hover:bg-red-100 dark:hover:bg-red-500 dark:hover:bg-opacity-30 active:bg-red-200 dark:active:bg-red-500 dark:active:bg-opacity-40 text-red-600 dark:text-red-50 h-9 px-3 py-2 text-sm radius-round m-5 ",
        "button bg-indigo-50 dark:bg-indigo-500 dark:bg-opacity-20 hover:bg-indigo-100 dark:hover:bg-indigo-500 dark:hover:bg-opacity-30 active:bg-indigo-200 dark:active:bg-indigo-500 dark:active:bg-opacity-40 text-indigo-600 dark:text-indigo-50 h-9 px-3 py-2 text-sm radius-round m-5 ",
        "button bg-emerald-50 dark:bg-emerald-500 dark:bg-opacity-20 hover:bg-emerald-100 dark:hover:bg-emerald-500 dark:hover:bg-opacity-30 active:bg-emerald-200 dark:active:bg-emerald-500 dark:active:bg-opacity-40 text-emerald-600 dark:text-emerald-50 h-9 px-3 py-2 text-sm radius-round m-5 ",
        "button bg-red-500 hover:bg-red-400 active:bg-red-600 text-white h-11 w-14 inline-flex items-center justify-center text-xl text-2xl radius-circle m-5 p-2 ",
        "button bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white h-11 w-14 inline-flex items-center justify-center text-xl radius-circle m-5 p-2 ",
        "button bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white h-11 px-8 py-2 radius-none m-5 opacity-100",
        "input focus:ring-indigo-500 focus-within:ring-indigo-500 focus-within:border-indigo-500 focus:border-indigo-500 input-wrapper text-xs text-sm text-base text-xl",
    ],
};
