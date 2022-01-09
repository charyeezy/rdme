import chalk from 'chalk';
import config from 'config';
import { validate as isEmail } from 'isemail';
import { promisify } from 'util';
import configStore from '../lib/configstore';
import APIError from '../lib/apiError';
import fetch from 'node-fetch';

const read = promisify(require('read'));

const testing = process.env.NODE_ENV === 'testing';

export default class loginCommand implements Command {
  command = 'login';
  usage = 'login [options]';
  description = 'Login to a ReadMe project.';
  category = 'admin';
  position = 1;

  args = [
    {
      name: 'project',
      type: String,
      description: 'Project subdomain',
    },
    {
      name: '2fa',
      type: Boolean,
      description: 'Prompt for a 2FA token',
    },
  ];

  async run(opts: {
    project: string;
    '2fa'?: boolean;

    email?: string;
    password?: string;
    token?: string;
  }) {
    let { email, password, project, token } = opts;

    async function getCredentials() {
      return {
        email: await read({ prompt: 'Email:', default: configStore.get('email') }),
        password: await read({ prompt: 'Password:', silent: true }),
        project: opts.project || (await read({ prompt: 'Project subdomain:', default: configStore.get('project') })),
        token: opts['2fa'] && (await read({ prompt: '2fa token:' })),
      };
    }

    // We only want to prompt for input outside of the test environment
    /* istanbul ignore next */
    if (!testing) {
      ({ email, password, project, token } = await getCredentials());
    }

    if (!project) {
      return Promise.reject(new Error('No project subdomain provided. Please use `--project`.'));
    }

    if (!isEmail(email)) {
      return Promise.reject(new Error('You must provide a valid email address.'));
    }

    return fetch(`${config.get('host')}/api/v1/login`, {
      method: 'post',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        project,
        token,
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          return Promise.reject(new APIError(res));
        }

        configStore.set('apiKey', res.apiKey);
        configStore.set('email', email);
        configStore.set('project', project);

        return `Successfully logged in as ${chalk.green(email)} to the ${chalk.blue(project)} project.`;
      });
  }
}
