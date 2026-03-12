// App-specific ESLint rule overrides for papa-everetts-pizza.
// This file is never synced by the template — edit freely.
export default [
  // Relax rules that require large template/composable refactors
  {
    files: ['app/**/*.vue', 'app/**/*.ts'],
    rules: {
      'narduk/no-template-complex-expressions': 'off',
      'narduk/require-use-prefix-for-composables': 'off',
    },
  },
]
