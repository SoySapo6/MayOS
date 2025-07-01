import readline from 'readline';
import { createContainer } from '@soymaycol/maycontainers';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const container = createContainer({
  name: 'myapp',
  distro: 'alpine',
  version: 'latest'
});

async function main() {
  console.log('⊂(・▽・)⊃ Iniciando contenedor una sola vez...');

  await container.init();
  console.log('(｡･ω･｡)ﾉ♡ Contenedor listo UwU');

  await container.run('apk add nodejs npm').catch(() => {});
  await container.run('node --version').catch(() => {});

  console.log('✧ Terminal interactiva lista, escribe tus comandos ✧');
  promptInput();
}

function promptInput() {
  rl.question('🐚 MyApp ~$ ', async (cmd) => {
    if (cmd.trim() === 'exit') {
      console.log('Saliendo y destruyendo contenedor... (ಥ﹏ಥ)');
      await container.destroy().catch(() => {});
      rl.close();
      process.exit(0);
    }

    try {
      const output = await container.run(cmd);
      if (output?.stdout) console.log(output.stdout.trim());
      if (output?.stderr) console.error(output.stderr.trim());
    } catch {
      // Silencio total para no mostrar errores feos
    }

    promptInput();
  });
}

main().catch(() => {});
