export interface Job {
  id: string
  key: string
  status: JobStatus
  message: string
  data?: any
  params?: any
}

export type JobStatus = 'init' | 'success' | 'fail'
