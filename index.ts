import concurrently from 'concurrently';
concurrently([
   {
      name: 'server',
      command: 'npm run dev',
      cwd: 'packages/server',
      prefixColor: 'blue',
   },
   {
      name: 'client',
      command: 'npm run dev',
      cwd: 'packages/client',
      prefixColor: 'green',
   },
]);
