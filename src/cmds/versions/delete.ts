import config from 'config';
import APIError from '../../lib/apiError';
import { getProjectVersion } from '../../lib/versionSelect';
import { cleanHeaders } from '../../lib/cleanHeaders';
import fetch from 'node-fetch';

export default class deleteVersionCommand implements Command {
  command = 'versions:delete';
  usage = 'versions:delete --version=<version> [options]';
  description = 'Delete a version associated with your ReadMe project.';
  category = 'versions';
  position = 4;

  hiddenArgs = ['version'];
  args = [
    {
      name: 'key',
      type: String,
      description: 'Project API key',
    },
    {
      name: 'version',
      type: String,
      defaultOption: true,
    },
  ];

  async run(opts: { key: string; version: string }) {
    const { key, version } = opts;

    if (!key) {
      return Promise.reject(new Error('No project API key provided. Please use `--key`.'));
    }

    const selectedVersion = await getProjectVersion(version, key, false).catch(e => {
      return Promise.reject(e);
    });

    return fetch(`${config.get('host')}/api/v1/version/${selectedVersion}`, {
      method: 'delete',
      headers: cleanHeaders(key),
    }).then(res => {
      if (res.error) {
        return Promise.reject(new APIError(res));
      }

      return Promise.resolve(`Version ${selectedVersion} deleted successfully.`);
    });
  }
}
