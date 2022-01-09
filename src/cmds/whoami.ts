import chalk from 'chalk';
import config from 'config';
import configStore from '../lib/configstore';

export default class whoamiCommand implements Command {
  command = 'whoami';
  usage = 'whoami';
  description = 'Displays the current user and project authenticated with ReadMe.';
  category = 'admin';
  position = 3;

  async run() {
    if (!configStore.has('email') || !configStore.has('project')) {
      return Promise.reject(new Error(`Please login using \`${config.get('cli')} login\`.`));
    }

    return Promise.resolve(
      `You are currently logged in as ${chalk.green(configStore.get('email'))} to the ${chalk.blue(
        configStore.get('project')
      )} project.`
    );
  }
}
