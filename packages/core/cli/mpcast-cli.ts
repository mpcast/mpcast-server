#!/usr/bin/env node
import program from 'commander';

import { logColored } from './cli-utils';
// import { importProducts } from './populate';
// tslint:disable-next-line:no-var-requires
const version = require('../../package.json').version;

// tslint:disable:no-console
logColored(`
                                    __
   ____ ___  ____  _________ ______/ /_
  / __ \`__ \\/ __ \\/ ___/ __ \`/ ___/ __/
 / / / / / / /_/ / /__/ /_/ (__  ) /_
/_/ /_/ /_/ .___/\\___/\\__,_/____/\\__/
         /_/
                                       `);

program.version(`Mpcast CLI v${version}`, '-v --version').name('mpcast');
// program
//   .command('import-products <csvFile>')
//   .option('-l, --language', 'Specify ISO 639-1 language code, e.g. "de", "es". Defaults to "en"')
//   .description('Import product data from the specified csv file')
//   .action(async (csvPath, command) => {
//     const filePath = path.join(process.cwd(), csvPath);
//     await importProducts(filePath, command.language);
//   });
program.parse(process.argv);
if (!process.argv.slice(2).length) {
  program.help();
}
