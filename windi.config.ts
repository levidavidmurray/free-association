import { defineConfig } from 'windicss/helpers'
import defaultTheme from 'windicss/defaultTheme';
import typography from 'windicss/plugin/typography'

export default defineConfig({
    darkMode: 'class',
    attributify: true,
    plugins: [
        typography()
    ],
    theme: {
        fontFamily: {
            'sans': ['Inter', ...defaultTheme.fontFamily.sans],
        },
    },
})
