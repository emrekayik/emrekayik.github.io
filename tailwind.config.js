module.exports = {
    content: [
        './_includes/**/*.html',
        './_layouts/**/*.html',
        './_posts/**/*.{html,md}',
        './*.{html,md}',
    ],
    theme: {
        extend: {
            animation: {
                'marquee': 'marquee 20s linear infinite',
                'infinite-scroll': 'infinite-scroll 25s linear infinite',
                'infinite-vertical-scroll': 'infinite-vertical-scroll 25s linear infinite',
            },
            keyframes: {
                'marquee': {
                    '0%': {
                        transform: 'translateX(0)'
                    },
                    '100%': {
                        transform: 'translateX(-100%)'
                    },
                },
                'infinite-scroll': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-50%)' },
                },
                'infinite-vertical-scroll': {
                    from: { transform: 'translateY(0)' },
                    to: { transform: 'translateY(-50%)' },
                },
            }
        },
    },
    daisyui: {
        themes: [
            "light", 
            "dark", 
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            {
                mytheme: {
                    "primary": "#f06e67",
                    "primary-content": "#140404",
                    "secondary": "#71ee5b",
                    "secondary-content": "#041403",
                    "accent": "#6f8de9",
                    "accent-content": "#040713",
                    "neutral": "#262931",
                    "neutral-content": "#cfd0d2",
                    "base-100": "#232035",
                    "base-200": "#1d1a2d",
                    "base-300": "#171525",
                    "base-content": "#cecdd3",
                    "info": "#2563EB",
                    "info-content": "#d2e2ff",
                    "success": "#16A34A",
                    "success-content": "#000a02",
                    "warning": "#D97706",
                    "warning-content": "#110500",
                    "error": "#DC2626",
                    "error-content": "#ffd9d4"
                }
            },
        ],
    },
    plugins: [
        require('daisyui'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
        require('tailwindcss-motion'),
        require('tailwindcss-intersect')
    ],
};