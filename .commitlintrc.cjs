module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'refactor', 'perf', 'test', 'build', 'ci']
    ],
    'header-max-length': [2, 'always', 100]
  }
};
