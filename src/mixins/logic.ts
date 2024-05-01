import type { Job } from '@/types/job'
import { createRandomId } from '@/utils/common'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      jobMap: new Map<string, Job>()
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
     * 分配任务
     *
     * @param jobs
     */
    dispatchJob(jobs: Job[]) {
      jobs.forEach((job) => {
        const { id, status } = job
        if (this.jobMap.has(id) || status !== 'init') {
          return
        }
        this.jobMap.set(id, job)
        this.handleJob(job)
      })
    },
    /**
     * 处理任务
     *
     * @param jobs
     * @returns
     */
    async handleJob(job: Job) {
      const { key, params } = job
      if (!(key in this)) {
        job.status = 'fail'
        job.message = 'job key error'
        this.emitJob(job)
        return
      }

      // @ts-ignore
      if (typeof this[key] === 'function') {
        try {
          // @ts-ignore
          const res = await this[key](params)
          job.status = 'success'
          job.data = res
          this.emitJob(job)
        } catch (err: any) {
          job.status = 'fail'
          job.message = err.message
          this.emitJob(job)
        }
        return
      }

      // @ts-ignore
      this[key] = params
      job.status = 'success'
      this.emitJob(job)
    },
    /**
     * 触发任务更新
     *
     * @param this
     * @param job
     * @returns
     */
    emitJob(job: Job) {
      // @ts-ignore
      if (!this.$ownerInstance) {
        return
      }
      this.jobMap.delete(job.id)
      // @ts-ignore
      this.$ownerInstance.callMethod('receiveJob', job)
    },
    /**
     * 触发事件
     *
     * @param data
     * @returns
     */
    emitEvent(...data: [string, ...any[]]) {
      // @ts-ignore
      if (!this.$ownerInstance) {
        return
      }
      // @ts-ignore
      this.$ownerInstance.callMethod('receiveEvent', data)
    },
    /**
     * 触发数据更新
     *
     * @param data
     * @returns
     */
    emitData(...data: [string, any]) {
      // @ts-ignore
      if (!this.$ownerInstance) {
        return
      }
      // @ts-ignore
      this.$ownerInstance.callMethod('receiveData', data)
    },
    /**
     * 触发方法
     *
     * @param data
     * @returns
     */
    emitMethod(...data: [string, ...any[]]) {
      // @ts-ignore
      if (!this.$ownerInstance) {
        return
      }
      // @ts-ignore
      this.$ownerInstance.callMethod('receiveMethod', data)
    }
  }
})
