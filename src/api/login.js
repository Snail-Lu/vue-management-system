import request from '@/utils/request'
const urls = {
	login: '/api/admin/login'
}

// 管理员登录
export function login(data) {
	return request({
		url: urls.login,
		method: 'post',
		data
	})
}
