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
			<el-form-item label="内部订单号">
				<el-input v-model="formInline.oId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="线上订单号">
				<el-input v-model="formInline.soId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="退货退款单号">
				<el-input v-model="formInline.outerAsId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="售后类型">
				<el-select v-model="formInline.type" placeholder="请选择" size="small">
					<el-option v-for="item in typeMap" :key="item.value" :label="item.label" :value="item.value">
						{{ item.label }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态">
				<el-select v-model="formInline.status" placeholder="请选择" size="small">
					<el-option v-for="item in statusMap" :key="item.value" :label="item.label" :value="item.value">
						{{ item.label }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="买家账号">
				<el-input v-model="formInline.shopBuyerId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="登记时间范围">
				<el-date-picker
					v-model="formInline.createdStart"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
					size="small"
				>
				</el-date-picker>
				<el-date-picker
					v-model="formInline.createdEnd"
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
			<el-table-column prop="oId" label="内部订单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="soId" label="线上订单号" width="200" align="center"> </el-table-column>

			<el-table-column prop="status" label="状态" width="100" align="center">
				<template slot-scope="scope">
					<p v-for="item in statusMap" :key="item.label">
						<span v-if="item.value == scope.row.status">{{ item.label }}</span>
					</p>
				</template>
			</el-table-column>
			<el-table-column prop="type" label="售后类型" width="100" align="center">
				<template slot-scope="scope">
					<p v-for="item in typeMap" :key="item.label">
						<span v-if="item.value == scope.row.type">{{ item.label }}</span>
					</p>
				</template>
			</el-table-column>

			<el-table-column prop="outerAsId" label="平台退货退款单号" width="200" align="center"> </el-table-column>

			<el-table-column prop="shopBuyerId" label="买家账号" width="200" align="center"> </el-table-column>

			<el-table-column prop="created" label="登记时间" width="200" align="center"> </el-table-column>

			<el-table-column prop="asId" label="售后单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="asDate" label="申请时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="modified" label="修改时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopStatus" label="商家状态" width="200" align="center"> </el-table-column>
			<el-table-column prop="remark" label="备注" width="200" align="center"> </el-table-column>
			<el-table-column prop="goodStatus" label="货物状态" width="200" align="center"> </el-table-column>
			<el-table-column prop="questionType" label="问题类型" width="200" align="center"> </el-table-column>
			<el-table-column prop="warehouse" label="仓库" width="200" align="center"> </el-table-column>

			<el-table-column prop="refund" label="退款金额" width="200" align="center"> </el-table-column>
			<el-table-column prop="payment" label="补偿金额" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverName" label="收件人" width="200" align="center"> </el-table-column>
			<el-table-column prop="logisticsCompany" label="物流公司" width="200" align="center"> </el-table-column>
			<el-table-column prop="lId" label="物流单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="whId" label="仓库编号" width="200" align="center"> </el-table-column>
			<el-table-column prop="drpCoIdFrom" label="分销商编号" width="200" align="center"> </el-table-column>
			<el-table-column prop="wmsCoId" label="分仓id" width="200" align="center"> </el-table-column>
			<el-table-column prop="confirmDate" label="最后确认日期" width="200" align="center"> </el-table-column>
			<el-table-column prop="freight" label="卖家应退运费" width="200" align="center"> </el-table-column>
			<el-table-column prop="node" label="售后线下备注" width="200" align="center"> </el-table-column>
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

		<el-dialog title="订单明细" :visible.sync="orderDetailVisible" width="60%">
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
						<el-table-column prop="asId" label="售后单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="asiId" label="售后子单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="skuId" label="商品编码" width="200" align="center"> </el-table-column>
						<el-table-column prop="qty" label="数量" width="200" align="center"> </el-table-column>
						<el-table-column prop="price" label="单价" width="200" align="center"> </el-table-column>
						<el-table-column prop="amount" label="金额" width="200" align="center"> </el-table-column>
						<el-table-column prop="name" label="商品名称" width="200" align="center"> </el-table-column>

						<el-table-column prop="pic" label="商品图片" width="200" align="center">
							<template slot-scope="scope">
								<img v-if="scope.row.pic" :src="scope.row.pic" style="height: 80px; width: 80px" />
								<img v-if="!scope.row.pic" :src="defaultGoods" style="height: 80px; width: 80px" />
							</template>
						</el-table-column>

						<el-table-column prop="type" label="类型" width="200" align="center"> </el-table-column>
						<el-table-column prop="propertiesValue" label="颜色规格" width="200" align="center"> </el-table-column>
						<el-table-column prop="rQty" label="实收退货数量" width="200" align="center"> </el-table-column>
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
				createdStart: '',
				createdEnd: '',
				oId: '',
				soId: '',
				outerAsId: '',
				shopId: '',
				shopBuyerId: '',
				status: '',
				type: '',
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
			// 状态（WaitConfirm:待确认,Confirmed:已确认,Cancelled:作废,Merged:被合并）
			statusMap: [
				{ value: '', label: '全部' },
				{ value: 'WaitConfirm', label: '待确认' },
				{ value: 'Confirmed', label: '已确认' },
				{ value: 'Cancelled', label: '作废' },
				{ value: 'Merged', label: '被合并' }
			],
			// ，普通退货，其它，拒收退货，仅退款，投诉，补发，换货
			typeMap: [
				{ value: '', label: '全部' },
				{ value: '普通退货', label: '普通退货' },
				{ value: '拒收退货', label: '拒收退货' },
				{ value: '仅退款', label: '仅退款' },
				{ value: '维修', label: '维修' },
				{ value: '投诉', label: '投诉' },
				{ value: '补发', label: '补发' },
				{ value: '换货', label: '换货' },
				{ value: '其它', label: '其它' }
			]
		}
	},
	methods: {
		handledbClick(row, event, column) {
			this.orderDetailVisible = true
			console.log('获取订单详情~ID：' + row.id)
			const that = this
			getOrderDetail({
				refundId: row.id
			}).then(
				res => {
					console.log('res :', res)
					that.detailItemTableData = res.result.refundItemDtoList
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
				oId: this.formInline.oId,
				soId: this.formInline.soId,
				outerAsId: this.formInline.outerAsId,
				shopId: this.formInline.shopId,
				shopBuyerId: this.formInline.shopBuyerId,
				status: this.formInline.status,
				type: this.formInline.type,
				createdStart: this.formInline.createdStart,
				createdEnd: this.formInline.createdEnd,
				pageInfo: {
					pageNum: this.formInline.pageInfo.pageNum,
					pageSize: this.formInline.pageInfo.pageSize
				}
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.refundDtoList
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
