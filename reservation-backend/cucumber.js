
let common = [
    'features/**/*.feature',
    '--require-module ts-node/register',
    '--require ./features/**/*.ts',
    '--format progress-bar',
    '--publish-quiet',
  ].join(' ');

module.exports = {
    default: common
}
