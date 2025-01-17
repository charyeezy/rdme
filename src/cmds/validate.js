const chalk = require('chalk');
const fs = require('fs');
const OASNormalize = require('oas-normalize');

module.exports = class ValidateCommand {
  constructor() {
    this.command = 'validate';
    this.usage = 'validate [file] [options]';
    this.description = 'Validate your OpenAPI/Swagger definition.';
    this.category = 'apis';
    this.position = 2;

    this.hiddenArgs = ['spec'];
    this.args = [
      {
        name: 'spec',
        type: String,
        defaultOption: true,
      },
    ];
  }

  async run(opts) {
    const { spec } = opts;

    async function validateSpec(specPath) {
      const oas = new OASNormalize(specPath, { colorizeErrors: true, enablePaths: true });

      return oas
        .validate(false)
        .then(api => {
          if (api.swagger) {
            return Promise.resolve(chalk.green(`${specPath} is a valid Swagger API definition!`));
          }
          return Promise.resolve(chalk.green(`${specPath} is a valid OpenAPI API definition!`));
        })
        .catch(err => {
          return Promise.reject(new Error(err.message));
        });
    }

    if (spec) {
      return validateSpec(spec);
    }

    // If the user didn't supply an API specification, let's try to locate what they've got, and validate that. If they
    // don't have any, let's let the user know how they can get one going.
    return new Promise((resolve, reject) => {
      ['swagger.json', 'swagger.yaml', 'openapi.json', 'openapi.yaml'].forEach(file => {
        if (!fs.existsSync(file)) {
          return;
        }

        console.info(chalk.yellow(`We found ${file} and are attempting to validate it.`));
        resolve(validateSpec(file));
      });

      reject(
        new Error(
          "We couldn't find an OpenAPI or Swagger definition.\n\nIf you need help creating one run `rdme oas init`!"
        )
      );
    });
  }
};
