import request from '@/utils/request'

const urls = {
	orderList: `life/portal/logistic`,
	orderDetail: `life/portal/logistic/detail`
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
