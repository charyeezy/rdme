import chalk from 'chalk';
import config from 'config';
import open from 'open';
import configStore from '../lib/configstore';

export default class openCommand implements Command {
  command = 'open';
  usage = 'open';
  description = 'Open your current ReadMe project in the browser.';
  category = 'utilities';
  position = 2;

  async run(opts: {
    // Optional mock for the `open` library that you can supply for testing purposes.
    mockOpen?: () => Promise<string>;
  }) {
    const project = configStore.get('project');
    if (!project) {
      return Promise.reject(new Error(`Please login using \`${config.get('cli')} login\`.`));
    }

    const hub: string = config.get('hub');
    const url = hub.replace('{project}', project);

    return (opts.mockOpen || open)(url, {
      wait: false,
    }).then(() => Promise.resolve(`Opening ${chalk.green(url)} in your browser...`));
  }
}
