import path from 'path';
import buildWebpackConfig from '../../../scripts/webpack.config';

declare global {
    namespace NodeJS {
        interface Global {
            webpackConfig: any;
            WEBPACK_HOT_RELOAD_URL: any;
        }
    }
}

const RootPath = path.join(__dirname);

const extraPlugins = [];
const defines = {};

const config = buildWebpackConfig({
    entry: {
        //index: [...global.WEBPACK_HOT_RELOAD_URL, path.join(RootPath, 'src', 'main', 'index.tsx')],
        auth: [...global.WEBPACK_HOT_RELOAD_URL, path.join(RootPath, 'src', 'auth', 'index.tsx')],
    },
    outputPath: process.env.BUILD__WEBPACK_OUTPUT || path.join(RootPath, '..', '..', '..', 'dist', 'tmp', 'web_crm'),
    defines,
    extraPlugins,
    loaderOptions: {
        postcss: {
            plugins: [require.resolve('tailwindcss')],
        },
    },
    alias: {
        '@softprovider-remote-tasks/app_remote_tasks/data_server': 'data_server/src/index',
    },
});

export default config;
