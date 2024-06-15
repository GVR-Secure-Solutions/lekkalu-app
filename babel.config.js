process.env.TAMAGUI_TARGET = 'native'

module.exports = function (api) {
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                '@tamagui/babel-plugin',
                {
                    components: ['tamagui'],
                    config: './tamagui.config.ts',
                    logTimings: true,
                },
            ],
            'react-native-reanimated/plugin',
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        '@/components': './components',
                        '@/utils': './utils',
                        '@/queries': './queries',
                        '@/hooks': './hooks',
                        '@/tamagui.config': './tamagui.config.ts',
                        '@/schema': './schema',
                        '@/app': './app',
                        '@/context': './context',
                    },
                },
            ],
        ],
    }
}
