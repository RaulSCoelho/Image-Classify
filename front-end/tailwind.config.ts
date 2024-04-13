import type { Config } from 'tailwindcss'

const { nextui } = require('@nextui-org/react')

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        app: `linear-gradient(40deg, #e7038eba, rgb(219 16 16 / 0%) 70.71%),
              linear-gradient(224deg, rgba(0, 0, 0, 0), rgba(255, 255, 255, 1), rgba(0, 0, 0, 0) 100%),
              linear-gradient(254deg, #7b53bbba, rgba(0, 255, 0, 0) 70.71%),
              linear-gradient(68deg, #06a9ecba, rgba(255, 255, 255, 1) 70.71%);`
      }
    }
  },
  plugins: [nextui()]
}
export default config
