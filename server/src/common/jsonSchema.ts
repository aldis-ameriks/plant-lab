import { writeFileSync } from 'fs';

import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

import { isLocal } from 'common/config';

export function initJsonSchema() {
  if (isLocal) {
    const jsonSchema = validationMetadatasToSchemas();
    writeFileSync(`${__dirname}/jsonSchema-generated.json`, JSON.stringify(jsonSchema, null, 2));
  }
}
