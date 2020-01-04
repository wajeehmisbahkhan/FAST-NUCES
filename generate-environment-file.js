const fs = require('fs');
// Environment paths
const targetPath = './src/environments/environment.ts';
const productionTargetPath = './src/environments/environment.prod.ts';
// File structures
const envConfigFile = process.env.ENVIRONMENT_CONTENT;
const envProdConfigFile = process.env.ENVIRONMENT_PROD_CONTENT;
// Write
fs.writeFile(targetPath, envConfigFile, function(err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      `Angular environment.ts file generated correctly at ${targetPath} \n`
    );
  }
});
fs.writeFile(targetPath, envProdConfigFile, function(err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      `Angular environment.prod.ts file generated correctly at ${targetPath} \n`
    );
  }
});
