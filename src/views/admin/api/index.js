import request from '@/utils/request'
const urls = {
	login: '/admin/list',
	register: '/admin/register'
}

// 管理员新增
export function addAdmin(data) {
	return request({
		url: urls.register,
		method: 'post',
		data
	})
}

// 管理员详情
export function addAdmin(data) {
	return request({
		url: urls.register,
		method: 'post',
		data
	})
}

// 管理员列表
export function getAdminsList(data) {
	return request({
		url: urls.login,
		method: 'post',
		data
	})
}
