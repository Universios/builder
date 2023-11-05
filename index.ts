const express = require('express');
import { exec } from "child_process";
import { writeFileSync } from 'fs';
const app = express();
const port = 80;

app.get('/', (req: any, res: any) => {
  res.send('Hello World! from EC2');
});

app.get('/triggerBuild', (req: any, res: any) => {

  const website = 'judith.ctunnels.com';
  const webdir = `/mnt/static-cdn/clients/clients-mono/sites/${website}`;
  const image = '265076617171.dkr.ecr.eu-central-1.amazonaws.com/builder-image:latest';

  const bashScript = `
        #!/bin/bash
        sudo docker run --rm -v ${webdir}:/app ${image} sh -c "cd app && npm run build"
    `;

  const scriptPath = `${webdir}/buildScript.sh`;

  // Write the bash script to the target directory
  writeFileSync(scriptPath, bashScript);

  // Give execution permissions to the script
  exec(`chmod +x ${scriptPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error changing permissions: ${err}`);
      res.status(500).send('Error changing script permissions');
      return;
    }

    // Execute the script
    exec(scriptPath, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error executing script: ${err}`);
        res.status(500).send('Error in build process');
        return;
      }

      console.log(stdout);
      res.send('Pages published');
    });
  });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
