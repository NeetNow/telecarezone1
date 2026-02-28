// craco.config.js - Optimized for performance
const path = require("path");
require("dotenv").config();

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Disable all performance-related features
      webpackConfig.performance = {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
      };

      // Remove hot module replacement plugin completely
      webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
        const pluginName = plugin.constructor.name;
        return pluginName !== 'HotModuleReplacementPlugin' && 
               pluginName !== 'ReactRefreshWebpackPlugin' &&
               pluginName !== 'WebpackDevServer';
      });

      // Disable watch mode completely
      webpackConfig.watch = false;
      webpackConfig.watchOptions = {
        ignored: /.*$/,
        poll: false,
        aggregateTimeout: 0
      };

      // Optimize module resolution
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        extensions: ['.js', '.jsx', '.json'],
        modules: ['node_modules'],
        symlinks: false,
        cacheWithContext: false
      };

      // Disable source maps in development for better performance
      webpackConfig.devtool = false;

      // Optimize caching
      webpackConfig.cache = false;

      // Remove unnecessary plugins
      webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
        const pluginName = plugin.constructor.name;
        return !pluginName.includes('ForkTsChecker') &&
               !pluginName.includes('ESLint') &&
               !pluginName.includes('Progress');
      });

      return webpackConfig;
    },
  },
  devServer: (devServerConfig) => {
    // Disable all dev server features that cause performance issues
    return {
      ...devServerConfig,
      hot: false,
      liveReload: false,
      compress: false,
      client: {
        logging: 'none',
        overlay: false,
        reconnect: false
      },
      static: {
        watch: false
      },
      setupMiddlewares: (middlewares) => {
        return middlewares;
      }
    };
  }
};
