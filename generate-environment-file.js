const fs = require('fs');
const targetPath = './src/environments/environment.prod.ts';
// `environment.ts` file structure
const envConfigFile = process.env.secrets.ENVIRONMENT_PROD_CONTENT;
fs.writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
   }
});
