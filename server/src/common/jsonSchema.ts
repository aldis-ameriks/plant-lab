import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

// eslint-disable-next-line import/no-mutable-exports
export let jsonSchema;

export function initJsonSchema() {
  jsonSchema = validationMetadatasToSchemas();
}
