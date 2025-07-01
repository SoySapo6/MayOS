// ✧･ﾟ: *✧･ﾟ:* Terminal Real con MayContainers *:･ﾟ✧*:･ﾟ✧
import readline from 'readline';
import { createContainer, quickRun } from '@soymaycol/maycontainers';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const container = createContainer({
  name: 'myapp',
  distro: 'alpine', // alpine, debian, ubuntu
  version: 'latest'
});

async function main() {
  console.log('⊂(・▽・)⊃ Iniciando contenedor...');

  await container.init();
  console.log('(｡･ω･｡)ﾉ♡ Contenedor listo UwU');

  await container.run('echo "Hello desde el contenedor UwU"');
  await container.run('apk add nodejs npm');
  await container.run('node --version');

  console.log('✧ Terminal lista, escribe comandos ✧');
  promptInput();
}

function promptInput() {
  rl.question('🐚 MayContainer ~$ ', async (cmd) => {
    if (cmd.trim() === 'exit') {
      console.log('Saliendo... (ಥ﹏ಥ)');
      await container.destroy();
      rl.close();
      process.exit(0);
    }

    try {
      const output = await container.run(cmd);
      if (output.stdout) console.log(output.stdout.trim());
      if (output.stderr) console.error(output.stderr.trim());
    } catch (err) {
      // console.error('Error ejecutando comando:', err.message); que no diga nada na mas xD
    }

    promptInput();
  });
}

main().catch(console.error);

// Quick Run fuera del contenedor, solo para probar
quickRun('echo "Quick comando ejecutado fuera"', { distro: 'alpine' })
  .then(() => console.log('Quick comando listo (≧◡≦)'))
  .catch(console.error);
