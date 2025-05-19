import readline from 'readline';
import { spawn } from 'child_process';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import fs from 'fs';
import path from 'path';

// Mostrar el banner de MayOS
console.clear();
const titulo = figlet.textSync('MayOS', { horizontalLayout: 'full' });
console.log(gradient.rainbow(titulo));
console.log(chalk.cyanBright('Hola! Bienvenido a MayOS, el terminal para host que no te dejan ejecutar comandos!!!!'));
console.log(chalk.magentaBright('\nHecho con amor por SoyMaycol ⊂(◉‿◉)つ\n'));

// Crear readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.yellow('MayOS ~$ ')
});

// HACK: Mantener la salida "viva" cada segundo
setInterval(() => {
  process.stdout.write('\u200B'); // Caracter invisible para mantener el flujo activo
}, 1000);

// Función para limpiar carpeta si ya existe antes de hacer git clone
function prepararGitClone(input) {
  if (input.startsWith('git clone')) {
    const partes = input.split(' ');
    const repoUrl = partes[partes.length - 1];
    const repoName = repoUrl.split('/').pop().replace('.git', '');
    const ruta = path.join(process.cwd(), repoName);
    if (fs.existsSync(ruta)) {
      fs.rmSync(ruta, { recursive: true, force: true });
      console.log(chalk.gray(`Directorio '${repoName}' eliminado para clonar de nuevo.`));
    }
  }
}

// Ejecutar comandos con feedback
function ejecutarComando(input) {
  prepararGitClone(input);

  const proceso = spawn(input, { shell: true });
  let salidaError = '';

  proceso.stdout.on('data', (data) => {
    process.stdout.write(chalk.green(data.toString()));
  });

  proceso.stderr.on('data', (data) => {
    salidaError += data.toString();
  });

  proceso.on('close', (code) => {
    if (code !== 0) {
      console.log(chalk.redBright(`\n⛔ ERROR: ${salidaError.trim()}`));
      console.log(chalk.yellow(`⚠️ El comando terminó con código ${code}`));
    }
    rl.prompt();
  });
}

// Iniciar consola
rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();
  if (!input) return rl.prompt();

  if (input.toLowerCase() === 'exit') {
    console.log(chalk.blueBright('\nHasta luego, cerrando MayOS... (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)⁠❤'));
    return process.exit(0);
  }

  ejecutarComando(input);
});
