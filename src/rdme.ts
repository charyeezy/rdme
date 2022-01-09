import chalk from 'chalk';
import rdme from '.';

rdme(process.argv.slice(2))
  .then((msg?: string) => {
    // eslint-disable-next-line no-console
    if (msg) console.log(msg);
    return process.exit(0);
  })
  .catch((err: Error) => {
    let message = `Yikes, something went wrong! Please try again and if the problem persists, get in touch with our support team at ${chalk.underline(
      'support@readme.io'
    )}.`;

    if (err && 'message' in err) {
      message = err.message;
    }

    // eslint-disable-next-line no-console
    console.error(chalk.red(`\n${message}\n`));
    return process.exit(1);
  });
