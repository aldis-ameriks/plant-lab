/* eslint-disable @typescript-eslint/no-explicit-any */

export type Tables = 'abusers' | 'crons' | 'errors'

export type AbuserEntity = {
  created_at: Date
  headers: any
  id: string
  ip: string
  method: string
  url: string
}

export type AbuserInsertEntity = {
  created_at?: Date
  headers: any
  id?: string
  ip: string
  method: string
  url: string
}

export type CronEntity = {
  executed_at: Date
  id: string
  name: string
  next_execution_at: Date
}

export type CronInsertEntity = {
  executed_at?: Date
  id?: string
  name: string
  next_execution_at: Date
}

export type ErrorEntity = {
  content: any
  headers: any | null
  id: string
  ip: string | null
  req_id: string | null
  sent_at: Date | null
  source: string | null
  time: Date
}

export type ErrorInsertEntity = {
  content: any
  headers?: any | null
  id?: string
  ip?: string | null
  req_id?: string | null
  sent_at?: Date | null
  source?: string | null
  time?: Date
}
