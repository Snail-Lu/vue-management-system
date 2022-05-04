import request from '@/utils/request'
const urls = {
	login: '/admin/login'
}

// 管理员登录
export function login(data) {
	return request({
		url: urls.login,
		method: 'post',
		data
	})
}
