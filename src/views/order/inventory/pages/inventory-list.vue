<template>
	<div class="root">
		<el-form :inline="true" :model="formInline">
			<el-form-item label="公司">
				<el-select v-model="formInline.companyId" placeholder="请选择" size="small">
					<el-option v-for="item in companyIdMap" :key="item.id" :label="item.partnerName" :value="item.id">
						{{ item.partnerName }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品编码">
				<el-input v-model="formInline.skuId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="款式编码">
				<el-input v-model="formInline.iId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="拉取时间范围">
				<el-date-picker
					v-model="formInline.modifiedStart"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
					size="small"
				>
				</el-date-picker>
				<el-date-picker
					v-model="formInline.modifiedEnd"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
					size="small"
				>
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryData" type="primary" size="mini" icon="el-icon-search">查询</el-button>
				<!-- <el-button @click="goExport" type="primary">导出</el-button>-->
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
			<el-table-column v-if="companyIdshow" prop="partnerId" label="公司主键" width="0"> </el-table-column>
			<el-table-column prop="partnerName" label="公司名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="skuId" label="商品编码" width="200" align="center"> </el-table-column>
			<el-table-column prop="iId" label="款式编码" width="200" align="center"> </el-table-column>
			<el-table-column prop="qty" label="主仓实际库存" width="200" align="center"> </el-table-column>
			<el-table-column prop="orderLock" label="订单占有数" width="200" align="center"> </el-table-column>
			<el-table-column prop="virtualQty" label="虚拟库存" width="200" align="center"> </el-table-column>
			<el-table-column prop="purchaseQty" label="采购在途数" width="200" align="center"> </el-table-column>
			<el-table-column prop="returnQty" label="销退仓库存" width="200" align="center"> </el-table-column>
			<el-table-column prop="defectiveQty" label="次品库存" width="200" align="center"> </el-table-column>
			<el-table-column prop="inQty" label="进货仓库存" width="200" align="center"> </el-table-column>
			<el-table-column prop="defectiveQty" label="次品库存" width="200" align="center"> </el-table-column>
			<el-table-column prop="modified" label="修改时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="minQty" label="安全库存下限" width="200" align="center"> </el-table-column>
			<el-table-column prop="maxQty" label="安全库存上限" width="200" align="center"> </el-table-column>
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
import { getPartnerList } from '@/api/system.js'
import { getInventoryList } from '../api'

export default {
	data() {
		return {
			formInline: {
				companyId: '',
				modifiedStart: '',
				modifiedEnd: '',
				skuId: '',
				iId: '',
				pageInfo: {
					pageNum: 1,
					pageSize: 10,
					sort: true
				}
			},
			companyIdMap: [],
			idshow: false,
			companyIdshow: false,
			tableLoading: false,
			tableData: [],
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
			console.log('获取数据')
			const that = this
			this.tableLoading = true
			getInventoryList({
				companyId: this.formInline.companyId,
				skuId: this.formInline.skuId,
				iId: this.formInline.iId,
				modifiedStart: this.formInline.modifiedStart,
				modifiedEnd: this.formInline.modifiedEnd,
				pageInfo: {
					pageNum: this.formInline.pageInfo.pageNum,
					pageSize: this.formInline.pageInfo.pageSize
				}
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.inventoryDtoList
					that.total = res.result.total
					this.tableLoading = false
				},
				err => {
					console.log('err :', err)
					this.tableLoading = false
				}
			)
		}
	},
	mounted() {
		// 获取公司下拉
		console.log('获取公司')
		getPartnerList().then(
			res => {
				this.companyIdMap = res.result.lifePartnerQueryDtos
				this.companyIdMap.unshift({ id: '', partnerName: '全部' })
			},
			err => {
				console.log('err :', err)
			}
		)
		this.goSearch()
	}
}</script
>>
