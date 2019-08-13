const assert = require('assert');
const config = require('config');
const configStore = require('../../lib/configstore');
const cmd = require('../../cmds/open');
const loginCmd = require('../../cmds/login');

describe('rdme open', () => {
  it('should error if no project provided', done => {
    configStore.delete('project');

    cmd.run({}).catch(err => {
      assert.equal(err.message, `Please login using \`${config.cli} ${loginCmd.command}\`.`);
      return done();
    });
  });

  it('should open the project', done => {
    configStore.set('project', 'subdomain');

    function mockOpen(url) {
      assert.equal(url, 'https://subdomain.readme.io');
      done();
      return Promise.resolve();
    }

    cmd.run({ mockOpen });
  });
});