module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@app': './app',
          '@components': './components',
        },
      }],
      'react-native-reanimated/plugin', // keep last if you use it
    ],
  };
};
