const fs = require('fs');
// Environment paths
const targetPath = './src/environments/environment.ts';
const productionTargetPath = './src/environments/environment.prod.ts';
// File structures
const envConfigFile = process.env.secrets.ENVIRONMENT_CONTENT;
const envProdConfigFile = process.env.secrets.ENVIRONMENT_PROD_CONTENT;

console.log(typeof envConfigFile);
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
fs.writeFile(productionTargetPath, envProdConfigFile, function(err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      `Angular environment.prod.ts file generated correctly at ${productionTargetPath} \n`
    );
  }
});
