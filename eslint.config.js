import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
    {
        plugins: {
            '@stylistic/js': stylisticJs
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                // Node.js globals
                global: 'readonly',
                require: 'readonly',
                module: 'readonly',
                process: 'readonly',
                // ES2021 globals
                Promise: 'readonly',
                Map: 'readonly',
                Set: 'readonly',
                WeakMap: 'readonly',
                WeakSet: 'readonly',
                BigInt: 'readonly',
                console: 'readonly'
            }
        },
        files: ['**/*.js', '**/*.cjs'],
        ignores: ['node_modules/**'],
        rules: {
            // Custom rules from previous config
            'indent': ['error', 4],
            'semi': ['error', 'always'],
            'no-unused-vars': 'warn',
            'prefer-const': 'warn',
            'no-var': 'warn',

            // Common rules from standard config
            'no-console': 'warn',
            'no-debugger': 'warn',
            'no-alert': 'warn',
            'no-duplicate-imports': 'error',
            'no-template-curly-in-string': 'error',
            'block-scoped-var': 'error',
            'curly': ['error', 'all'],
            'eqeqeq': ['error', 'always'],
            'no-use-before-define': 'error',
            'camelcase': 'error',
            'comma-dangle': ['error', 'never'],
            '@stylistic/js/indent': ['error', 4]
        }
    },
    {
        files: ['.eslintrc.{js,cjs}'],
        languageOptions: {
            sourceType: 'script'
        }
    }
];
