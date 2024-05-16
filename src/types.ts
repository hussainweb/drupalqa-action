export type OptionsObject = {}

export type CheckCallable = (
  options: OptionsObject,
  webRoot: string
) => string[]

export interface PhpCsOptions extends OptionsObject {
  standard?: string
  extensions?: string
  ignore?: string
  path?: string
}

export interface PhpMdOptions {
  path?: string
  format?: string
  ruleset?: string
  suffixes?: string
  exclude?: string
}

export interface PhpLintOptions {
  path?: string
  extensions?: string
  exclude?: string
  no_default_options?: boolean
  verbose?: boolean
}

export interface GrumPHPOptions {
  testsuite?: string
  tasks?: string[]
}

export interface PhpStanOptions {
  configuration?: string
  paths?: string[]
}
