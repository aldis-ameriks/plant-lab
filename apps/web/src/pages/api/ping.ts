import { NextApiRequest, NextApiResponse } from 'next'

export default function ping(req: NextApiRequest, res: NextApiResponse): void {
  res.statusCode = 200
  res.end('pong')
}
