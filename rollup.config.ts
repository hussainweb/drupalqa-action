// See: https://rollupjs.org/introduction/

import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const config = {
  input: 'src/index.ts',
  output: {
    esModule: true,
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [typescript(), nodeResolve({ preferBuiltins: true }), commonjs()],
  onwarn(warning, warn) {
    // Check if warning is from any @actions/* package
    // These packages use ESM-only patterns that cause harmless warnings when bundled
    const isFromActionsPackage =
      warning.id?.includes('node_modules/@actions/') ||
      warning.loc?.file?.includes('node_modules/@actions/') ||
      warning.message.includes('@actions/')

    // Suppress "this" rewriting warnings from @actions/* packages
    // These are harmless - the code works correctly despite the warning
    if (warning.code === 'THIS_IS_UNDEFINED' && isFromActionsPackage) {
      return
    }

    // Suppress circular dependency warnings from @actions/* internal structure
    if (warning.code === 'CIRCULAR_DEPENDENCY' && isFromActionsPackage) {
      return
    }

    // Use default for everything else
    warn(warning)
  }
}

export default config
