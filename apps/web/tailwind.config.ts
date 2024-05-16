import BaseConfig from '@yomu/ui/tailwind.config'
import type { Config } from 'tailwindcss'

const config: Config = {
  presets: [BaseConfig],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/components/**/*.{ts,tsx}',
  ],
  theme: {},
  plugins: [],
}
export default config
