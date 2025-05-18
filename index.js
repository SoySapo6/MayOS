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
console.log(chalk.magentaBright('\nHecho por SoyMaycol <3\n'));

// Crear readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.yellow('MayOS ~$ ')
});

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

// Función para ejecutar comandos reales
function ejecutarComando(input) {
  prepararGitClone(input); // Revisar si es git clone

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
      console.log(chalk.yellow(`⚠️ ADVERTENCIA: El comando falló con código ${code} ⚠️\n`));
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
    console.log(chalk.blueBright('\nHasta luego, cerrando MayOS...'));
    return process.exit(0);
  }

  ejecutarComando(input);
});
