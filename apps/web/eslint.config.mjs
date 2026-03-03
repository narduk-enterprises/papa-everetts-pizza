// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import { sharedConfigs } from '@narduk/eslint-config'

export default withNuxt(
  ...sharedConfigs,
  // Relax rules that require large template/composable refactors
  {
    files: ['app/**/*.vue', 'app/**/*.ts'],
    rules: {
      'vue-official/no-template-complex-expressions': 'off',
      'vue-official/require-use-prefix-for-composables': 'off',
    },
  },
)
