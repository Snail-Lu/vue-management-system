<template>
	<div class="root">
		<el-form :inline="true" :model="formInline">
			<el-form-item label="公司名称">
				<el-select v-model="formInline.partnerId" @change="changeCompany" placeholder="请选择" size="small">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in partnerIdMap" :key="item.id" :label="item.partnerName" :value="item.id">
						{{ item.partnerName }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺名称">
				<el-select v-model="formInline.shopId" placeholder="请选择" size="small">
					<el-option v-for="item in storeList" :key="item.shopId" :label="item.shopName" :value="item.shopId">
						{{ item.shopName }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品编码">
				<el-input v-model="formInline.skuId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="商品款号">
				<el-input v-model="formInline.iId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="商品名称">
				<el-input v-model="formInline.skuName" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="平台">
				<el-input v-model="formInline.channel" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryData" type="primary" size="mini" icon="el-icon-search">查询</el-button>
				<!-- <el-button @click="goExport" type="primary">导出</el-button> -->
			</el-form-item>
		</el-form>
		<el-table
			:data="tableData"
			stripe
			style="width: 100%"
			height="620"
			v-loading="tableLoading"
			:cell-style="{ 'text-align': 'center' }"
			:header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
			border
		>
			<el-table-column v-if="idshow" prop="id" label="主键" width="0"> </el-table-column>
			<el-table-column v-if="pidshow" prop="partnerId" label="life_partner的主键" width="0"> </el-table-column>

			<el-table-column prop="partnerName" label="公司名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopName" label="店铺名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="channel" label="平台" width="200" align="center"> </el-table-column>
			<el-table-column prop="modified" label="修改时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="iId" label="商品款号" width="200" align="center"> </el-table-column>
			<el-table-column prop="skuId" label="商品编码" width="200" align="center"> </el-table-column>
			<el-table-column prop="skuName" label="商品名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopIId" label="店铺款号id" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopSkuId" label="店铺商品id" width="200" align="center"> </el-table-column>
			<el-table-column prop="enabled" label="是否在售" width="100" align="center">
				<template slot-scope="scope">{{ scope.row.enabled == 'true' ? '是' : '否' }}</template>
			</el-table-column>
			<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopId" label="店铺id" width="200" align="center"> </el-table-column>
		</el-table>
		<el-pagination
			background
			layout="total,prev,sizes, pager, next"
			:total="total"
			@size-change="handleSizeChange"
			:pageSize="formInline.pageInfo.pageSize"
			:currentPage="formInline.pageInfo.pageNum"
			@current-change="page"
		>
		</el-pagination>
	</div>
</template>

<style scoped></style>

<script>
import { getPartnerList, getStoreList } from '@/api/system.js'
export default {
	data() {
		return {
			formInline: {
				partnerId: '',
				shopId: '',
				skuId: '',
				iId: '',
				skuName: '',
				channel: '',
				pageInfo: {
					pageNum: 1,
					pageSize: 10,
					sort: true
				}
			},
			partnerIdMap: [],
			idshow: false,
			pidshow: false,
			tableLoading: false,
			tableData: [],
			storeList: [],
			currentPage: 1,
			total: 0
		}
	},
	methods: {
		goExport() {},
		page(currentPage) {
			console.log('currentPage', currentPage)
			this.formInline.pageInfo.pageNum = currentPage
			this.goSearch()
		},
		handleSizeChange(currentPage) {
			this.formInline.pageInfo.pageSize = currentPage
			this.goSearch()
		},
		queryData() {
			this.formInline.pageInfo.pageNum = 1
			this.goSearch()
		},
		goSearch() {
			console.log('获取商品映射数据')
			const that = this
			this.tableLoading = true
			this.req({
				url: `life/portal/skuMap`,
				data: {
					partnerId: this.formInline.partnerId,
					shopId: this.formInline.shopId,
					skuId: this.formInline.skuId,
					iId: this.formInline.iId,
					skuName: this.formInline.skuName,
					channel: this.formInline.channel,
					pageInfo: {
						pageNum: this.formInline.pageInfo.pageNum,
						pageSize: this.formInline.pageInfo.pageSize
					}
				},
				method: 'POST'
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.partnerSkuMapQueryListDtoList
					that.total = res.result.total
					this.tableLoading = false
				},
				err => {
					console.log('err :', err)
					this.tableLoading = false
				}
			)
		},
		changeCompany(e) {
			console.log(e)
			this.formInline.companyId = e
			this.formInline.shopId = ''
			this.getStoreList()
		},
		getStoreList() {
			this.storeList = []
			getStoreList({
				partnerId: this.formInline.companyId,
				pageInfo: {
					pageNum: 1,
					pageSize: 1000000,
					sort: true
				}
			}).then(res => {
				console.log(res)
				this.storeList = res.result.shopQueryDtoLists
				this.storeList.unshift({ shopId: '', shopName: '全部' })
			})
		}
	},
	computed: {},
	mounted() {
		// 获取公司下拉
		console.log('获取公司下拉')
		getPartnerList().then(
			res => {
				console.log('res公司下拉列表 :', res)
				this.partnerIdMap = res.result.lifePartnerQueryDtos
			},
			err => {
				console.log('err :', err)
			}
		)
		this.getStoreList()
		this.goSearch()
	}
}
</script>
