const chalk = require('chalk');
const OpenAPICommand = require('./openapi');

module.exports = class SwaggerCommand extends OpenAPICommand {
  constructor() {
    super();

    this.command = 'swagger';
    this.usage = 'swagger [file] [options]';
    this.description = 'Alias for `rdme openapi`. [deprecated]';
    this.position += 1;
  }

  async run(opts) {
    console.warn(chalk.yellow('⚠️  Warning! `rdme swagger` has been deprecated. Please use `rdme openapi` instead.'));
    return super.run(opts);
  }
};
