# Github action for DrupalQA

This action runs checks from [DrupalQA](https://github.com/hussainweb/drupalqa) on a Drupal code base. While you can directly use the Docker image with Github Actions, this Action makes it simpler to specify and configure some of the checks.

## Inputs

### `php-version`

The PHP version to use (corresponds to the Docker image). Allowed options are and their corresponding Docker images are as follows. Default: `8.1`.

| php-version | Docker image |
| ----------- | ------------ |
| 7.3         | hussainweb/drupalqa:php7.3 (_not supported_) |
| 7.4         | hussainweb/drupalqa:php7.4 (_not supported_) |
| 8.0         | hussainweb/drupalqa:php8.0 |
| 8.1         | hussainweb/drupalqa:php8.1 |
| 8.2         | hussainweb/drupalqa:php8.1 |
| latest      | hussainweb/drupalqa:latest |

Note: The actual Docker image used also depends on the `registry` option. If that option is set to `'ghcr'` (default value), then the Docker image is prefixed with `ghcr.io/`. For example, `ghcr.io/hussainweb/drupalqa:php8.2`.

### `web-root`

The web root (document root) to consider for default values for some of the checks. Default: `web`.

### `checks`

An YAML string describing the checks to run. The default structure is as below.

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
