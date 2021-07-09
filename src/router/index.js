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
		redirect: '/main',
		children: [
			{
				path: 'main',
				name: 'main',
				component: () => import('@/views/common/main.vue'),
				meta: {
					title: '首页',
					icon: 'el-icon-s-home'
				}
			}
		]
	},

	// 基础数据相关接口
	{
		path: '/base',
		component: Layout,
		meta: {
			title: '基础数据查询',
			icon: 'el-icon-menu'
		},
		children: [
			{
				path: 'company',
				name: 'company',
				component: () => import('@/views/baseData/company-list'),
				meta: {
					title: '公司信息查询'
				}
			},
			{
				path: 'shop',
				name: 'shop',
				component: () => import('@/views/baseData/shop-list'),
				meta: {
					title: '店铺查询'
				}
			},
			{
				path: 'express',
				name: 'express',
				component: () => import('@/views/baseData/express-company-list'),
				meta: {
					title: '物流公司查询'
				}
			},
			{
				path: 'warehouse',
				name: 'warehouse',
				component: () => import('@/views/baseData/warehouse-list'),
				meta: {
					title: '仓库查询'
				}
			}
		]
	},
	{
		path: '/goods',
		component: Layout,
		meta: {
			title: '商品数据查询',
			icon: 'el-icon-menu'
		},
		children: [
			{
				path: 'category',
				name: 'category',
				component: () => import('@/views/goods/category-list'),
				meta: {
					title: '商品类目查询'
				}
			},
			{
				path: 'common',
				name: 'common',
				component: () => import('@/views/goods/common'),
				meta: {
					title: '普通商品查询'
				}
			},
			{
				path: 'map',
				name: 'map',
				component: () => import('@/views/goods/map'),
				meta: {
					title: '商品映射查询'
				}
			},
			{
				path: 'combine',
				name: 'combine',
				component: () => import('@/views/goods/combine'),
				meta: {
					title: '组合商品查询'
				}
			}
		]
	},
	{
		path: '/order',
		component: Layout,
		meta: {
			title: '订单数据查询',
			icon: 'el-icon-menu'
		},
		children: [
			{
				path: 'inventory',
				name: 'inventory',
				component: () => import('@/views/order/inventory/pages/inventory-list'),
				meta: {
					title: '库存查询'
				}
			},
			{
				path: 'non-tao',
				name: 'non-tao',
				component: () => import('@/views/order/order/pages/non-tao-list'),
				meta: {
					title: '非淘系订单查询'
				}
			},
			{
				path: 'tao',
				name: 'tao',
				component: () => import('@/views/order/order/pages/tao-list'),
				meta: {
					title: '淘系订单查询'
				}
			},
			{
				path: 'all',
				name: 'all',
				component: () => import('@/views/order/order/pages/all-list'),
				meta: {
					title: '汇总订单查询'
				}
			},
			{
				path: 'delivery',
				name: 'delivery',
				component: () => import('@/views/order/delivery/pages/delivery-list'),
				meta: {
					title: '发货查询'
				}
			},
			{
				path: 'refund',
				name: 'refund',
				component: () => import('@/views/order/refund/pages/refund-list'),
				meta: {
					title: '退货查询'
				}
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
		mode: 'history', // require service support
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
