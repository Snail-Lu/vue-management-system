import request from '@/utils/request'

const urls = {
  inventoryList: `life/portal/inventory`
}

// 获取库存列表
export function getInventoryList(params) {
  return request({
    url: urls.inventoryList,
    method: 'post',
    data: params
  })
}






