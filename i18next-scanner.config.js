const fs = require('fs');
const chalk = require('chalk');

module.exports = {
    input: [
        "src/**/*.{ts,tsx}",
        "!src/i18n/**",
        "!src/styles/**",
        "!**/node_modules/**",
    ],
    output: './',
    options: {
        debug: false,
        func: {
            list: ['i18next.t', 'i18n.t'],
            extensions: ['.js', '.jsx']
        },
        trans: false,
        lngs: ['en', 'zh'],
        defaultLng: 'zh',
        defaultNs: 'resource',
        defaultValue: '__STRING_NOT_TRANSLATED__',
        resource: {
            loadPath: 'src/i18n/{{lng}}/translation.json',
            savePath: 'src/i18n/{{lng}}/translation.json',
            jsonIndent: 2,
            lineEnding: '\n'
        },
        nsSeparator: false, // namespace separator
        keySeparator: false, // key separator
        interpolation: {
            prefix: '{{',
            suffix: '}}'
        },
        metadata: {},
        allowDynamicKeys: false,
    },
    transform: function customTransform(file, enc, done) {
        ("use strict");

        const parser = this.parser;
        const content = fs.readFileSync(file.path, enc);

        let count = 0;
        //指定扫描的标识
        parser.parseFuncFromString(content, { list: ["lang", "t"] }, (key, options) => {
            parser.set(key, Object.assign({}, options, {
                defaultValue: key,
                nsSeparator: false,
                keySeparator: false
            }));

            ++count;
        });

        if (count > 0) {
            console.log(`i18next-scanner: count=${chalk.cyan(count)}, file=${chalk.yellow(JSON.stringify(file.relative))}`);
        }

        done();
    },
};