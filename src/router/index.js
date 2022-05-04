import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
	{
		path: '/login',
		component: () => import('@/views/common/login.vue'),
		hidden: true
	},

	{
		path: '/404',
		component: () => import('@/views/common/404.vue'),
		hidden: true
	},

	// 主页面
	{
		path: '/',
		component: Layout,
		redirect: '/home',
		children: [
			{
				path: 'home',
				name: 'home',
				component: () => import('@/views/common/home.vue'),
				meta: {
					title: '首页',
					icon: 'el-icon-s-home'
				}
			}
		]
	},
	{
		path: '/charts',
		component: Layout,
		children: [
			{
				path: '',
				name: 'charts',
				component: () => import('@/views/charts/index.vue'),
				meta: {
					title: '报表图表',
					icon: 'el-icon-s-data'
				}
			}
		]
	},

	// 表单表格
	{
		path: '/admin',
		component: Layout,
		children: [
			{
				path: '',
				name: 'admin',
				component: () => import('@/views/admin/index'),
				meta: {
					icon: 'el-icon-menu',
					title: '管理员列表'
				}
			},
			{
				path: 'add',
				name: 'addAdmin',
				component: () => import('@/views/admin/add'),
				meta: {
					icon: 'el-icon-menu',
					title: '新增管理员'
				},
				hidden: true
			}
		]
	},
	// 404 page must be placed at the end !!!
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]

const createRouter = () =>
	new Router({
		mode: 'hash',
		base: '/vue-management-system',
		scrollBehavior: () => ({
			y: 0
		}),
		routes: constantRoutes
	})

const router = createRouter()

export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
