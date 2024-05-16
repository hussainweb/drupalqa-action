import {CustomOptions} from '../types'

export default function custom(
  options: CustomOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webRoot: string
): string[] {
  return options.command !== undefined ? options.command : []
}
