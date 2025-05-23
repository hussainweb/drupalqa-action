# Github action for DrupalQA

This action runs checks from [DrupalQA](https://github.com/hussainweb/drupalqa) on a Drupal code base. While you can directly use the Docker image with Github Actions, this Action makes it simpler to specify and configure some of the checks.

## Inputs

### `php-version`

The PHP version to use (corresponds to the Docker image). Allowed options and their corresponding Docker images are as follows. Default: `8.2`.

| php-version | Docker image |
| ----------- | ------------ |
| 7.3         | hussainweb/drupalqa:php7.3 (_not supported_) |
| 7.4         | hussainweb/drupalqa:php7.4 (_not supported_) |
| 8.0         | hussainweb/drupalqa:php8.0 (_not supported_) |
| 8.1         | hussainweb/drupalqa:php8.1 |
| 8.2         | hussainweb/drupalqa:php8.2 |
| 8.3         | hussainweb/drupalqa:php8.3 |
| 8.4         | hussainweb/drupalqa:php8.4 |
| latest      | hussainweb/drupalqa:latest |

Note: The actual Docker image used also depends on the `registry` option. If that option is set to `'ghcr'` (default value), then the Docker image is prefixed with `ghcr.io/`. For example, `ghcr.io/hussainweb/drupalqa:php8.2`.

### `web-root`

The web root (document root) for default values for some of the checks. Default: `web`.

### `checks`

A YAML string describing the checks to run. The default structure is as below.

```yaml
    checks: |
      phplint: {}
      phpcs: {}
```

The options for each of these are described in the [DrupalQA checks](#drupalqa-checks) section.

### `registry`

The registry to use to download the image. Only 'ghcr' and 'dockerhub' are supported. You probably don't need to change this option. It's only there to compare the performance and switch to DockerHub in case there is a problem with ghcr.io (which is unlikely). Default: `ghcr`.

## Outputs

No outputs.

## Example usage

```yaml
uses: hussainweb/drupalqa@v1
with:
  php-version: 8.2
  checks: |
    phplint: {}
    phpcs:
      standard: phpcs.xml
    phpmd:
      ruleset: phpmd.xml
```

## DrupalQA Checks

DrupalQA action supports configuring checks for the following tools.

### phplint

These are the default options for `phplint`.

```yaml
    checks: |
      phplint:
        exclude: vendor,web/core,web/modules/contrib
        extensions: php,module,theme,engine,inc,install
        verbose: ''
        path: ''
```

In the above sample, the paths begin with `web` as it is the default for `web-root` input. The actual default will depend on the `web-root` input.

`phplint` supports a `.phplint.yml` and can be run without any options. If you are using this, you can pass in the `no_default_options` option as follows.

```yaml
    checks: |
      phplint:
        no_default_options: true
```

If you set this option to true, all other options are ignored.

### phpcs

These are the default options for `phpcs`. All are optional and you can override these as per the [command line options of phpcs](https://github.com/squizlabs/PHP_CodeSniffer/wiki/Usage).

```yaml
    checks: |
      phpcs:
        standard: Drupal,DrupalPractice
        extensions: php,module,inc,install,test,profile,theme
        ignore: ''
        path: web/modules/custom
```

In the above sample, the path begins with `web` as it is the default for `web-root` input. The actual default will depend on the `web-root` input.

You can specify multiple paths by separating them with a comma.

```yaml
    checks: |
      phpcs:
        standard: Drupal,DrupalPractice
        path: web/modules/custom,web/themes/custom
```

### phpmd

These are the default options for `phpmd`. All are optional and you can override these as per the [command line options of phpmd](https://phpmd.org/documentation/).

```yaml
    checks: |
      phpmd:
        path: web/modules/custom
        format: text
        ruleset: codesize,naming,unusedcode
        suffixes: php,module,theme,engine,inc
        exclude: ''
```

In the above sample, the path begins with `web` as it is the default for `web-root` input. The actual default will depend on the `web-root` input.

### grumphp

These are the default options for `grumphp`. All are optional and you can override these as per the [command line options of `grumphp run`](https://github.com/phpro/grumphp/blob/v2.x/doc/commands.md#run).

```yaml
    checks: |
      grumphp:
        testsuite: ''
        tasks: []
```

This runs `grumphp run` on the code base.

### phpstan

These are the default options for `phpstan`. All are optional and you can override these as per the [command line options of `phpstan`](https://phpstan.org/user-guide/command-line-usage).

```yaml
    checks: |
      phpstan:
        configuration: ''
        paths: []
```

This runs `phpstan` on the code base with the specified options. For the defaults to work, you must have a `phpstan.neon` configuration file in your codebase as [mentioned in the documentation](https://phpstan.org/user-guide/command-line-usage#running-without-arguments). Note that the default `phpstan.neon` as generated by [`axelerant/drupal-quality-checker`](https://github.com/axelerant/drupal-quality-checker) is valid for this purpose.

### custom

This allows you to run any arbitrary commands that you may want to run from within the tools that are available within the Docker image. This is useful if you want to run one of the tools available in the drupalqa Docker image but there is no custom check written above, or if you want to use a configuration option not available above. In any case, if you think what you are trying to run here is common enough, consider submitting an issue and/or a pull request to add the check. Look at other pull requests such as #121 and #122 to see how to write a check.

Example usage:

```yaml
    checks: |
      custom_linters:
        command: ['grumphp', 'run', '--testsuite=linters']
      custom_stylecheck:
        command: ['grumphp', 'run', '--testsuite=style']
```

The above will run two commands as shown. The `custom` check was introduced for situations where we need to run the same command twice with different options. This is otherwise not possible using the typical check format as keys may not be repeated in YAML.
