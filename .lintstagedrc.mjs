export default {
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix'],
  '**/*': 'prettier --write --ignore-unknown',
}
