### 项目简介

> 基于 Vue2.0 + Element-UI 开发的后台管理系统。[线上地址](https://snail-lu.github.io/vue-management-system)

### 基本操作

```bash
# 克隆
git clone https://github.com/Snail-Lu/vue-management-system.git

# 进入项目根目录
cd vue-management-system

# 安装依赖
npm install

# 本地运行
npm run dev
```

### 菜单/路由配置

路由文件`src/router/index.js`

```js
// 路由配置格式
{
  path: '/test',  // url路径
  component: Layout, // 此处不用动，这个全局统一的一个布局文件
  children: [{
    path: 'test',  // 二级路径
    name: 'test',
    component: () => import('@/views/test/test'), // 文件的路径
    meta: {
      title: '测试',
      icon: 'plane' //配置选项可配置测试名称和图标
    }
  }]
},
```

### 网络请求基础配置

1. 代理配置

因为跨域资源请求的问题，在开发阶段所有和后端交互的网络请求在底层由 node.js 代理。[相关文档](https://cli.vuejs.org/config/#devserver-proxy)

打开根目录下的`vue.config.js`文件

```js
// 代理所有以‘/admin’开头的网络请求
proxy: {
  '/api': {
    target: `http://localhost:8886/`, //后台服务地址
    changeOrigin: true,
    pathRewrite: {
    }
  }
}
```

2. 配置地址

生产环境与开发环境通常有不同的服务地址。编辑`.env.development` 以及 `.env.production` 这两个文件，修改其中的 `VUE_APP_BASE_API` 配置项即可

以开发环境为例：

```js
VUE_APP_BASE_API = '/api'
```

3. 配置拦截器

打开`src/utils/request.js`，此文件封装了一个 axios 请求对象，该系统中的网络请求都是基于这个对象来处理的。
我们可以在网络请求发送之前和收到服务端回复之后做一些通用性的工作。比如根据服务端的状态码判断请求是否正常，若不正常给出相应的提示。

```js
service.interceptors.response.use(
	response => {
		const res = response.data
		// 如果服务器的状态码不为200，说明请求异常，应给出错误提示。
		if (res.code !== 200) {
			Message({
				message: res.message || 'Error check your token or method',
				type: 'error',
				duration: 2 * 1000
			})
			return Promise.reject(new Error(res.message || 'Error'))
		} else {
			return res
		}
	},
	error => {
		console.log('err' + error) // for debug
		Message({
			message: error.message,
			type: 'error',
			duration: 2 * 1000
		})
		return Promise.reject(error)
	}
)
```

4. 挂载请求对象

在`src/main.js`首先导入网络请求对象，并挂载至 Vue 全局对象，这样在每个组件中直接引用即可，不用要再导入。

```js
import request from '@/utils/request'
Vue.prototype.req = request
```

### 接口请求与数据渲染

1. 发起请求

```js
this.request({
	url: 'getInfo?id=6', // 此处写不同业务对应的url，框架会自动与baseURL拼接
	data: {},
	method: 'GET'
}).then(
	res => {
		// 请求成功后的处理
		console.log('res :', res)
	},
	err => {
		// 请求失败后的处理
		console.log('err :', err)
	}
)
```

按照最佳实践，应该把网络请求统一抽离到单一文件，然后在每个具体的页面进行对服务端数据的处理。
比如下面的这种形式，首先创建文件`src/api/system.js`，把在`system`组件中需要用到的网络请求都写入此文件。

```js
import request from '@/utils/request'

// 获取订单状态
export function getReturnOrderStatusList(params) {
	return request({
		url: 'getReturnOrderStatusList',
		method: 'get',
		params
	})
}
```

在组件`system.vue`中引入请求方法

```v
import { getReturnOrderStatusList } from "@/api/system.js";
……
mounted: function() {
  // 网络请求统一处理
  getReturnOrderStatusList().then(res => {
    console.log("api tableData :", res);
    this.tableData = res.data;
  },err=>{
    console.log("err :", err);
  });
  // 网络请求直接写在文件中
  this.req({
    url: "getReturnOrderStatusList",
    data: {},
    method: "GET"
  }).then(
    res => {
      console.log("tableData :", res);
      this.tableData = res.data;
    },
    err => {
      console.log("err :", err);
    }
  );
},
```
