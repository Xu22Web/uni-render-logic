## uni-app renderjs 跨层调用

### 描述

- 基于 [renderjs](https://uniapp.dcloud.net.cn/tutorial/renderjs.html#renderjs) 通过自定义组件直接操作浏览器环境下的 DOM 和 BOM，参考 `example/MSnapshot.vue` 调用 `canvas` 生成视频海报

  1.  分别在视图层和逻辑层导入

      ```html
      <!-- 视图层 -->
      <script>
        import { renderMixin } from 'uni-render-logic'

        export default {
          mixins: [renderMixin]
        }
      </script>

      <!-- 逻辑层 -->
      <script module="<moduleName>" lang="renderjs">
        import { logicMixin } from 'uni-render-logic'

        export default {
         mixins: [logicMixin],
        }
      </script>
      ```

  2.  模板绑定逻辑层模块

      ```html
      <!-- MyComp.vue -->
      <template>
        <view :jobs="jobs" :change:jobs="<moduleName>.dispatchJob"></view>
      </template>
      ```

  3.  示例

      ```html
      <!-- 视图层 -->
      <script>
        import { renderMixin } from 'uni-render-logic'

        export default {
          mixins: [renderMixin],
          data() {
            return {
              ['<key>']: false
            }
          },
          methods: {
            ['<methodName>'](a, b) {
              // 被调用
              console.log('<methodName> called', a, b)
            }
          }
        }
      </script>

      <!-- 逻辑层 -->
      <script module="<moduleName>" lang="renderjs">
        import { logicMixin } from '@/mixins/logic'

        export default {
        mixins: [logicMixin],
        methods:{
          /**
           * 测试
           * @param args 传递过来的参数（会被 JSON.stringify 请勿传递复杂类型）
           */
          test(...args){
            // Map 类型 JSON.parse(JSON.stringify(<Map>)) 转换后变成 {}
            // { a: 1, b: [], c: "test", d: false, e: {}, f: {} }
            console.log(args[0])

            // ... DOM 操作
            const ele = document.createElement('div')
            ele.innerText = 'test'
            document.body.appendChild(ele)

            // 触发事件
            this.emitEvent('<eventName>', 1, 2)
            // 修改视图层数据
            this.emitData('<key>', true)
            // 触发视图层方法
            this.emitMethod('<methodName>', 1, 2)
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve('hello world')
              }, 1000)
            })
          },
        }
        }
      </script>
      ```

  4.  调用组件方法，监听组件事件

      ```html
      <!-- 父组件 -->
      <template>
        <!-- 调用子组件 -->
        <MyComp @['<eventName>']="handleEvent" ref="comp" />
        <button @click="handleTest">测试</button>
      </template>
      <script setup lang="ts">
        import MyComp from '@/components/MyComp.vue'
        const comp = ref<InstanceType<typeof MyComp>>()

        /**
         * 处理测试
         */
        const handleTest = async () => {
          // 调用逻辑层 'test' 方法传参 手动声明返回值 `string` 类型
          const res = await comp.value?.addJob<string>('test', {
            a: 1,
            b: [],
            c: 'test',
            d: false,
            e: {},
            // 复杂类型
            f: new Map()
          })
          // 'hello world'
          console.log(res)
        }

        /**
         * 处理事件
         */
        const handleEvent = (a: number, b: number) => {
          // 1 2
          console.log(a, b)
        }
      </script>
      ```
