import type { Job } from '@/types/job'
import { createRandomId } from '@/utils/common'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  data() {
    return {
      jobs: <Job[]>[]
    }
  },
  methods: {
    /**
     * 创建id
     *
     * @returns
     */
    createId: () => `id_${createRandomId(8)}`,
    /**
     * 创建任务
     * 
     * @param key
     * @returns
     */
    createJob(key: string, params?: any) {
      const id = this.createId()
      const job = ref<Job>({
        id,
        key,
        status: 'init',
        message: '',
        data: undefined,
        params
      })
      return job
    },
    /**
     * 删除任务
     *
     * @param id
     * @returns
     */
    removeJob(id: string) {
      const index = this.jobs.findIndex((job) => job.id === id)
      if (index === -1) {
        return
      }
      this.jobs.splice(index, 1)
    },
    /**
     * 添加任务
     *
     * @param key
     * @returns
     */
    addJob<T = any, K = any>(key: string, params?: K) {
      const job = this.createJob(key, params)
      this.jobs.push(job.value)
      return new Promise<T>((resolve, reject) => {
        watch(
          () => job.value.status,
          () => {
            const { status, id, message, key, data } = job.value
            if (status === 'init') {
              return
            }
            if (status === 'success') {
              this.removeJob(id)
              resolve(<T>data)
              return
            }
            if (status === 'fail') {
              this.removeJob(id)
              reject(new Error(`${key} failed: [${message}]`))
              return
            }
          }
        )
      })
    },
    /**
     * 接收任务
     *
     * @param job
     */
    receiveJob(job: Job) {
      const currentJob = this.jobs.find((item) => item.id === job.id)
      if (!currentJob) {
        return
      }
      currentJob.data = job.data
      currentJob.message = job.message
      currentJob.status = job.status
    },
    /**
     * 接收事件
     *
     * @param data
     */
    receiveEvent(data: [string, ...any[]]) {
      this.$emit(...data)
    },
    /**
     * 接收数据
     *
     * @param data
     */
    receiveData(data: [string, any]) {
      const [key, value] = data
      if (key in this) {
        // @ts-ignore
        this[key] = value
        return
      }
      throw new Error(`${key} is not a property`)
    },
    /**
     * 接收方法
     *
     * @param data
     */
    receiveMethod(data: [string, ...any[]]) {
      const [key, ...value] = data
      // @ts-ignore
      if (key in this && typeof this[key] === 'function') {
        // @ts-ignore
        this[key](...value)
        return
      }
      throw new Error(`${key} is not a function`)
    }
  }
})
