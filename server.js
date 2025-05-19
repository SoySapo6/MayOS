import express from 'express';
import { spawn } from 'child_process';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

// Banner MayOS
console.clear();
const titulo = figlet.textSync('MayOS', { horizontalLayout: 'full' });
console.log(gradient.rainbow(titulo));
console.log(chalk.cyanBright('Hola! Bienvenido a MayOS, el terminal para host que no te dejan ejecutar comandos!!!!'));
console.log(chalk.bgYellow.black('\n ⚠️  ADVERTENCIA  ⚠️'));
console.log(chalk.yellowBright('¡Usa ') + chalk.greenBright('mayos --begin TuCarpeta') + chalk.yellowBright(' para iniciar tu proyecto (bots y más)!'));
console.log(chalk.redBright('¡Es obligatorio para comenzar correctamente! ') + chalk.magentaBright('(｡•̀ᴗ-)✧\n'));
console.log(chalk.magentaBright('\nHecho con amor por SoyMaycol ⊂(◉‿◉)つ\n'));

// MAYOS SPECIAL
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

// Comando especial mayos --begin
function procesarComandoEspecial(input) {
  const match = input.match(/^mayos\s+--begin\s+(.+)/);
  if (match) {
    const carpeta = match[1];
    const nombreScript = `inicio-${carpeta}.sh`;
    const contenido = `#!/bin/bash
echo "📂 Proyecto Comenzado!"
cd "${carpeta}" || exit
exec bash
`;

    fs.writeFileSync(nombreScript, contenido);
    fs.chmodSync(nombreScript, 0o755);

    const proceso = spawn(`./${nombreScript}`, { stdio: 'inherit', shell: true });

    proceso.on('close', () => {
      fs.unlinkSync(nombreScript);
      console.log(chalk.gray(`Script '${nombreScript}' eliminado.`));
    });

    return true;
  }
  return false;
}

// Ejecutar comandos reales
function ejecutarComando(input) {
  if (!input) return;
  if (procesarComandoEspecial(input)) return;
  prepararGitClone(input);

  const proceso = spawn(input, { shell: true });

  proceso.stdout.on('data', (data) => {
    process.stdout.write(chalk.green(data.toString()));
  });

  proceso.stderr.on('data', (data) => {
    process.stdout.write(chalk.red(data.toString()));
  });

  proceso.on('close', (code) => {
    if (code !== 0) {
      console.log(chalk.redBright(`⛔ ERROR: El comando falló con código ${code}`));
    }
  });
}

// Endpoint GET
app.get('/run', (req, res) => {
  const comando = req.query.cmd;
  if (!comando) {
    res.status(400).send('Falta el parámetro ?cmd=');
    return;
  }

  // Ejecutar pero no responder nada visible
  ejecutarComando(comando);
  res.status(200).end(); // silencio absoluto jeje
});

app.listen(PORT, () => {
  console.log(chalk.greenBright(`\nServidor MayOS corriendo en http://localhost:${PORT}/run?cmd=tucomando\n`));
});
