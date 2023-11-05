const express = require('express');
import { exec } from "child_process";
const app = express();
const port = 80;

app.get('/triggerBuild', (req: any, res: any) => {

  const website = 'judith.ctunnels.com';
  const webdir = `/mnt/static-cdn/clients/clients-mono/sites/${website}`;
  const image = 'your-docker-image-name';  // replace with your image name

  const command = `
      docker run --rm ${image} sh -c "cd ${webdir} && npm run build"
    `;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error in build process');
      return;
    }

    console.log(stdout);
    res.send('Pages published');
  });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
