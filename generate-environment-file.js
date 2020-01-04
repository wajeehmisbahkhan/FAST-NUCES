const fs = require('fs').promises;
// Environment paths
const targetPath = './src/environments/environment.ts';
const productionTargetPath = './src/environments/environment.prod.ts';
// File structures
const envConfigFile = process.env.ENVIRONMENT_CONTENT;
const envProdConfigFile = process.env.ENVIRONMENT_PROD_CONTENT;
// Write
await fs.writeFile(targetPath, envConfigFile, function(err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      `Angular environment.ts file generated correctly at ${targetPath} \n`
    );
  }
});
await fs.writeFile(productionTargetPath, envProdConfigFile, function(err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      `Angular environment.prod.ts file generated correctly at ${productionTargetPath} \n`
    );
  }
});
