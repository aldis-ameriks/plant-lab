import Ajv from 'ajv'
import addFormats from 'ajv-formats'

export const regex = {
  email:
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
  number: /^[0-9]+$/
}

export const ajv = addFormats(new Ajv({ strictRequired: true, allErrors: true }).addFormat('number', regex.number), {
  mode: 'fast',
  formats: ['email', 'date']
})
