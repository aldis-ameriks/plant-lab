/* istanbul ignore file */
import { initApi } from './helpers/initApi'
;(async () => {
  await initApi({ graphql: true })
})()
