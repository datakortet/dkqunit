module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
    },
    "overrides": [{
        files: ["**/__tests__/*.js"],
        env: {
            jest: true,
        },
        plugins: ['jest'],
        rules: {
            "jest/no-disabled-tests": "warn",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/prefer-to-have-length": "warn",
            "jest/valid-expect": "error"
        }
    }],
    "extends": "eslint:recommended",
    "parser": 'babel-eslint',
    "parserOptions": {
        // "ecmaVersion": 2018,
        "sourceType": "module",
        "codeFrame": false
    },
    "rules": {
        "indent": [
            "off",
            4, {
                SwitchCase: 1   // case statments should be indented 1 level
            }
        ],
        "no-unused-vars": ["off"],
        "linebreak-style": [
            "off",
            "windows"
        ],
        "quotes": [
            "off",
            "single",
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
