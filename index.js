import readline from 'readline';
import fs from 'fs';
import { createContainer } from '@soymaycol/maycontainers';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const container = createContainer({
  name: 'myapp',
  distro: 'alpine',
  version: 'latest',
  persist: true, // Si tu módulo soporta esto, si no lo ignora, lo dejamos igual
});

const dataDir = './mycontainer-data';

async function main() {
  console.log('⊂(・▽・)⊃ Verificando contenedor...');

  if (!fs.existsSync(dataDir)) {
    console.log('(｡･ω･｡)ﾉ♡ Primera vez, creando contenedor...');
    fs.mkdirSync(dataDir, { recursive: true });
    await container.init({ storage: dataDir });
    await container.run('apk add nodejs npm').catch(() => {});
  } else {
    console.log('(≧◡≦) Contenedor detectado, reutilizando...');
    await container.init({ storage: dataDir });
  }

  console.log('✧ Terminal lista, escribe tus comandos ✧');
  promptInput();
}

function promptInput() {
  rl.question('🐚 MyApp ~$ ', async (cmd) => {
    if (cmd.trim() === 'exit') {
      console.log('Saliendo... (ಥ﹏ಥ)');
      await container.destroy().catch(() => {}); // Silenciar errores
      rl.close();
      process.exit(0);
    }

    try {
      const output = await container.run(cmd);

      if (output?.stdout) console.log(output.stdout.trim());
      if (output?.stderr) console.error(output.stderr.trim());
    } catch {
      // Silencio absoluto, no queremos spam ni error feo
    }

    promptInput();
  });
}

main().catch(() => {});
