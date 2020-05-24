import { writeFileSync } from 'fs';

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

// eslint-disable-next-line import/no-mutable-exports
export let jsonSchema;

export function initJsonSchema() {
  jsonSchema = validationMetadatasToSchemas();
  writeFileSync(`${__dirname}/jsonSchema-generated.json`, JSON.stringify(jsonSchema, null, 2));
}
