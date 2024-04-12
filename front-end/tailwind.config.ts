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
        app: 'linear-gradient(.3turn, #06A9EC, #7B53BB, #E7038E)'
      }
    }
  },
  plugins: [nextui()]
}
export default config
