import request from '@/utils/request'

const urls = {
	orderList: `life/portal/refund`,
	orderDetail: `life/portal/refund/detail`
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
