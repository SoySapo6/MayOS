import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import chalk from 'chalk';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.clear();
console.log(chalk.magentaBright('\n[MayOS-Server] Terminal API iniciada con éxito\n'));

app.post('/cmd', (req, res) => {
  const { command } = req.body;

  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'Comando inválido o vacío.' });
  }

  const [cmd, ...args] = command.split(' ');

  console.log(chalk.yellow(`\n[MayOS-API] Ejecutando comando: ${command}`));

  const proceso = spawn(cmd, args, { shell: true });

  proceso.stdout.on('data', (data) => {
    process.stdout.write(chalk.green(`[stdout] ${data}`));
  });

  proceso.stderr.on('data', (data) => {
    process.stdout.write(chalk.red(`[stderr] ${data}`));
  });

  proceso.on('close', (code) => {
    console.log(chalk.blueBright(`[MayOS-API] Comando finalizado con código: ${code}\n`));
  });

  res.status(200).json({ status: 'Comando recibido y ejecutándose' });
});

app.listen(PORT, () => {
  console.log(chalk.cyanBright(`[MayOS-Server] Escuchando en http://localhost:${PORT}`));
});
