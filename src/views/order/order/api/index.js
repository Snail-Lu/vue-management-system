import request from '@/utils/request'

const urls = {
	orderList: `life/portal/orders`,
	orderDetail: `life/portal/orders/detail`,
	orderDeliveryList: 'life/portal/orderOuts',
	orderDeliveryListDetail: 'life/portal/orderOuts/detail',
	allOrderListDetail: 'life/portal/orderTotal/detail',
	allOrderList: 'life/portal/orderTotals'
}

// 获取库存列表
export function getOrderList(params) {
	return request({
		url: urls.orderList,
		method: 'post',
		data: params
	})
}

// 获取库存列表
export function getOrderDetail(params) {
	return request({
		url: urls.orderDetail,
		method: 'post',
		data: params
	})
}

// 获取出库列表
export function orderDeliveryList(params) {
	return request({
		url: urls.orderDeliveryList,
		method: 'post',
		data: params
	})
}

// 获取出库详情列表
export function orderDeliveryListDetail(params) {
	return request({
		url: urls.orderDeliveryListDetail,
		method: 'post',
		data: params
	})
}

// 获取总订单详情列表
export function allOrderListDetail(params) {
	return request({
		url: urls.allOrderListDetail,
		method: 'post',
		data: params
	})
}

// 获取总订单列表
export function allOrderList(params) {
	return request({
		url: urls.allOrderList,
		method: 'post',
		data: params
	})
}
