<template>
	<div class="root">
		<el-form :inline="true" :model="formInline">
			<el-form-item label="公司">
				<el-select v-model="formInline.companyId" @change="changeCompany" placeholder="请选择" size="small">
					<el-option v-for="item in companyIdMap" :key="item.id" :label="item.partnerName" :value="item.id">
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
			<el-form-item label="订单号">
				<el-input v-model="formInline.oId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="发货时间范围">
				<el-date-picker
					v-model="formInline.sendDateStart"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
					size="small"
				>
				</el-date-picker>
				<el-date-picker
					v-model="formInline.sendDateEnd"
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
			@row-dblclick="handledbClick"
		>
			<el-table-column v-if="idshow" prop="id" label="主键" width="0"> </el-table-column>
			<el-table-column v-if="companyIdshow" prop="partnerId" label="公司主键" width="0"> </el-table-column>
			<el-table-column prop="partnerName" label="公司名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopId" label="店铺编号" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopName" label="店铺名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="oId" label="订单号-erp" width="200" align="center"> </el-table-column>
			<el-table-column prop="soId" label="订单号" width="200" align="center"> </el-table-column>

			<el-table-column prop="sendDate" label="发货日期" width="200" align="center"> </el-table-column>

			<el-table-column prop="freight" label="运费" width="200" align="center"> </el-table-column>
			<el-table-column prop="weight" label="重量" width="200" align="center"> </el-table-column>
			<el-table-column prop="lcId" label="快递公司代码" width="200" align="center"> </el-table-column>
			<el-table-column prop="lId" label="快递单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="logisticsCompany" label="快递公司" width="200" align="center"> </el-table-column>
			<el-table-column prop="modified" label="修改时间" width="200" align="center"> </el-table-column>
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

		<el-dialog title="发货明细" :visible.sync="orderDetailVisible" width="60%">
			<el-tabs type="border-card">
				<el-tab-pane label="商品信息">
					<el-table
						:data="detailItemTableData"
						stripe
						style="width: 100%"
						height="400"
						:cell-style="{ 'text-align': 'center' }"
						:header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
						border
					>
						<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
						<el-table-column prop="skuId" label="商家SKU" width="200" align="center"> </el-table-column>
						<el-table-column prop="qty" label="购买数量" width="200" align="center"> </el-table-column>
						<el-table-column prop="outerOiId" label="子订单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="rawSoId" label="原始平台订单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="oId" label="内部单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="refundStatus" label="商品退款状态" width="200" align="center"> </el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
	</div>
</template>

<style scoped></style>

<script>
import { getPartnerList, getStoreList } from '@/api/system.js'
import { getOrderDetail, getOrderList } from '../api'

export default {
	data() {
		return {
			defaultGoods: require('@/icons/default-sku.jpg'),
			formInline: {
				companyId: '',
				sendDateStart: '',
				sendDateEnd: '',
				shopId: '',
				oId: '',
				pageInfo: {
					pageNum: 1,
					pageSize: 10,
					sort: true
				}
			},
			orderDetailVisible: false,
			companyIdMap: [],
			idshow: false,
			companyIdshow: false,
			tableLoading: false,
			tableData: [],
			detailPayTableData: [],
			detailItemTableData: [],
			storeList: [],
			currentPage: 1,
			total: 0,
			//待付款：WaitPay；发货中：Delivering；被合并：Merged；异常：Question；
			// 被拆分：Split；等供销商|外仓发货：WaitOuterSent；已付款待审核：WaitConfirm；
			// 已客审待财审：WaitFConfirm；已发货：Sent；取消：Cancelled
			statusMap: [
				{ value: '', label: '全部' },
				{ value: 'Cancelled', label: '取消' },
				{ value: 'Delivering', label: '发货中' },
				{ value: 'Merged', label: '被合并' },
				{ value: 'Question', label: '异常' },
				{ value: 'Sent', label: '已发货' },
				{ value: 'Split', label: '被拆分' },
				{ value: 'WaitConfirm', label: '已付款待审核' },
				{ value: 'WaitFConfirm', label: '已客审待财审' },
				{ value: 'WaitPay', label: '待付款' },
				{ value: 'WaitOuterSent', label: '等供销商|外仓发货' }
			],
			typeMap: [
				{ value: '', label: '全部' },
				{ value: '唯品会JITX订单', label: '唯品会JITX订单' },
				{ value: '换货订单', label: '换货订单' },
				{ value: '普通订单', label: '普通订单' }
			]
		}
	},
	methods: {
		handledbClick(row, event, column) {
			this.orderDetailVisible = true
			console.log('获取订单详情~ID：' + row.id)
			const that = this
			getOrderDetail({
				logisticId: row.id
			}).then(
				res => {
					console.log('res :', res)
					that.detailItemTableData = res.result.logisticItemDtoList
				},
				err => {
					console.log('err :', err)
				}
			)
		},

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
			getOrderList({
				companyId: this.formInline.companyId,
				shopId: this.formInline.shopId,
				oId: this.formInline.oId,
				sendDateStart: this.formInline.sendDateStart,
				sendDateEnd: this.formInline.sendDateEnd,
				pageInfo: {
					pageNum: this.formInline.pageInfo.pageNum,
					pageSize: this.formInline.pageInfo.pageSize
				}
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.logisticDtoList
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
		this.getStoreList()
		this.goSearch()
	}
}</script
>>
