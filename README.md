## uni-app renderjs 跨层调用

基于 uni-app 的 [renderjs](https://uniapp.dcloud.net.cn/tutorial/renderjs.html#renderjs) 以及 Vue 3 的 `Composition API`，利用 `mixin` 创建自定义组件，跨层调用浏览器环境下的 `DOM` 和 `BOM`，实现 input 文件选择、canvas 生成视频封面、封装 FormData 请求等功能。

### 安装

```bash
# npm
npm install uni-render-logic
```

```bash
# yarn
yarn add uni-render-logic
```

```bash
# pnpm
pnpm install uni-render-logic
```

### 示例

参考 `./example` 文件夹调用 `canvas` 生成视频封面

### 使用

1.  分别在视图层和逻辑层导入 `mixin`

    ```html
    <!-- MyComp.vue -->
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

2.  模板绑定视图层数据、逻辑层模块

    ```html
    <!-- MyComp.vue -->
    <template>
      <view :jobs="jobs" :change:jobs="<moduleName>.dispatchJob"></view>
    </template>
    ```

3.  视图层、逻辑层示例

    ```html
    <!-- MyComp.vue -->
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
      import { logicMixin } from 'uni-render-logic'

      export default {
      mixins: [logicMixin],
      methods:{
        /**
         * 测试
         *
         * @param args 传递参数
         */
        test(...args){
          // Map 类型，JSON.parse(JSON.stringify(<Map>)) 转换后变成 {}
          // { a: 1, b: [], c: "test", d: false, e: {}, f: {} }
          console.log(args[0])

          // ... DOM 操作
          const ele = document.createElement('div')
          ele.innerText = 'hello world'
          document.body.appendChild(ele)

          // 触发事件
          this.emitEvent('<eventName>', 1, 2)

          // 修改视图层数据
          this.emitData('<key>', true)

          // 触发视图层方法
          this.emitMethod('<methodName>', 1, 2)

          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(ele.innerText)
            }, 1000)
          })
        },
      }
      }
    </script>
    ```

4.  跨层调用逻辑层方法，监听逻辑层事件

    ```html
    <!-- 父组件 -->
    <template>
      <!-- MyComp 组件 -->
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
        // 调用逻辑层 'test' 方法
        // 由于跨层调用是异步的，无论 'test' 方法是否异步，结果均返回 Promise
        const res = await comp.value?.addJob<string>('test', {
          a: 1,
          b: [],
          c: 'test',
          d: false,
          e: {},
          // Map 类型
          f: new Map()
        })
        // 'hello world'
        console.log(res)
      }

      /**
       * 处理逻辑层触发事件
       */
      const handleEvent = (a: number, b: number) => {
        // 1 2
        console.log(a, b)
      }
    </script>
    ```
