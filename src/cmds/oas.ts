import { spawn } from 'child_process';
import path from 'path';

export default class oasCommand implements Command {
  command = 'oas';
  usage = 'oas';
  description = 'Helpful OpenAPI generation tooling.';
  category = 'utilities';
  position = 1;

  async run() {
    const cp = spawn(path.join(__dirname, '..', '..', 'node_modules', '.bin', 'oas'), process.argv.slice(3), {
      stdio: 'inherit',
    });

    return new Promise((resolve, reject) => {
      cp.on('close', code => {
        if (code && code > 0) return reject();

        return resolve(undefined);
      });
    });
  }
}
