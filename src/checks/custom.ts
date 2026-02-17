import type { CustomOptions } from '../types.js'

export default function custom(
  options: CustomOptions,
  _webRoot: string
): string[] {
  return options.command !== undefined ? options.command : []
}
