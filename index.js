import readline from 'readline';
import { createContainer } from '@soymaycol/maycontainers';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const container = createContainer({
  name: 'myapp',
  distro: 'alpine', // alpine, debian, ubuntu
  version: 'latest'
});

let containerReady = false;

async function main() {
  console.log('⊂(・▽・)⊃ Iniciando contenedor solo una vez...');

  if (!containerReady) {
    await container.init();
    await container.run('apk add nodejs npm curl').catch(() => {}); // Instalamos curl si no está
    containerReady = true;
  }

  console.log('(｡･ω･｡)ﾉ♡ Contenedor listo, Terminal activa UwU');
  promptInput();
}

function promptInput() {
  rl.question('🐚 MyApp ~$ ', async (cmd) => {
    if (cmd.trim() === 'exit') {
      console.log('Cerrando contenedor, bye bye (ಥ﹏ಥ)');
      await container.destroy().catch(() => {});
      rl.close();
      process.exit(0);
    }

    if (!containerReady) {
      console.log('Espera que el contenedor termine de inicializarse UwU');
      return promptInput();
    }

    try {
      const output = await container.run(cmd);
      if (output?.stdout) console.log(output.stdout.trim());
      if (output?.stderr) console.error(output.stderr.trim());
    } catch {
      // Error silenciado para que no reviente el chat
    }

    promptInput();
  });
}

main().catch(console.error);
