import { type Context } from '../../../helpers/context.ts'
import { request } from '../../../helpers/request.ts'

export function sendTelegram(context: Pick<Context, 'config'>, text: string) {
  const { config } = context
  if (!config.telegram.accessKey || !config.telegram.receiver) {
    return
  }
  return request(`https://api.telegram.org/bot${config.telegram.accessKey}/sendMessage`, {
    method: 'POST',
    body: JSON.stringify({
      chat_id: config.telegram.receiver,
      text
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
}
