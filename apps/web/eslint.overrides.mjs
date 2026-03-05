// App-specific ESLint rule overrides for papa-everetts-pizza.
// This file is never synced by the template — edit freely.
export default [
  // Relax rules that require large template/composable refactors
  {
    files: ['app/**/*.vue', 'app/**/*.ts'],
    rules: {
      'vue-official/no-template-complex-expressions': 'off',
      'vue-official/require-use-prefix-for-composables': 'off',
    },
  },
]
