import readline from 'readline';
import { spawn } from 'child_process';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';

console.clear();
const titulo = figlet.textSync('MayOS', { horizontalLayout: 'full' });
console.log(gradient.rainbow(titulo));
console.log(chalk.cyanBright('Hola! Bienvenido a MayOS, el terminal para host que no te dejan ejecutar comandos!!!!'));
console.log(chalk.magentaBright('\nHecho por SoyMaycol <3\n'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.yellow('MayOS ~$ ')
});

function ejecutarComando(input) {
  const proceso = spawn(input, {
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe']
  });

  proceso.stdout.on('data', (data) => {
    process.stdout.write(chalk.green(data.toString()));
  });

  proceso.stderr.on('data', (data) => {
    const msg = data.toString().trim();

    // Mostrar solo si hay contenido
    if (msg) {
      console.log(chalk.redBright(`\n⛔ ERROR: ${msg}`));
      console.log(chalk.yellow(`⚠️ ADVERTENCIA: Puede que el comando esté mal o no exista ⚠️\n`));
    }
  });

  proceso.on('close', () => rl.prompt());
}

rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();
  if (!input) return rl.prompt();
  if (input.toLowerCase() === 'exit') {
    console.log(chalk.blueBright('\nHasta luego, cerrando MayOS...'));
    return process.exit(0);
  }

  ejecutarComando(input);
});
