// Theme governance, enforced in tooling rather than by convention.
// Design values (colours, radius, fonts, spacing...) may only be written as
// literals in the designer-owned theme file. Everywhere else they must come
// from Bootstrap Sass variables ($primary), CSS variables (var(--bs-primary))
// or Sass functions — never hardcoded.

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-declaration-strict-value'],
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'scale-unlimited/declaration-strict-value': [
      [
        '/color$/',
        'fill',
        'stroke',
        'font-family',
        'font-size',
        'font-weight',
        'line-height',
        '/radius$/',
        '/^padding/',
        '/^margin/',
        'gap',
        'box-shadow',
      ],
      {
        ignoreValues: ['0', 'auto', 'inherit', 'initial', 'unset', 'none', 'transparent', 'currentcolor'],
        disableFix: true,
      },
    ],
  },
  overrides: [
    {
      // The single source of truth: the only file allowed to define raw values.
      files: ['src/styles/_theme.scss'],
      rules: {
        'color-no-hex': null,
        'scale-unlimited/declaration-strict-value': null,
      },
    },
  ],
};
