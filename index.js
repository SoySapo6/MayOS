import readline from 'readline';
import { spawn } from 'child_process';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';

// Mostrar título
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

function ejecutarComando(cmd, args = []) {
  const proceso = spawn(cmd, args, { shell: true });

  proceso.stdout.on('data', (data) => {
    process.stdout.write(chalk.green(`${data}`));
  });

  proceso.stderr.on('data', (data) => {
    const mensaje = data.toString();

    console.log(chalk.red(`\n⛔ ERROR: ${mensaje.trim()} ⛔`));
    console.log(chalk.yellow(`⚠️ ADVERTENCIA: Puede que el comando esté mal o no exista ⚠️\n`));
  });

  proceso.on('close', () => rl.prompt());
}

rl.prompt();
rl.on('line', (line) => {
  const input = line.trim();
  if (input.toLowerCase() === 'exit') {
    console.log(chalk.blueBright('\nChau chau, cerrando MayOS...'));
    process.exit(0);
  }

  const [cmd, ...args] = input.split(' ');
  ejecutarComando(cmd, args);
});
