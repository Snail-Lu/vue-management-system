<template>
	<div class="root">
		<el-form :inline="true" :model="formInline">
			<el-form-item label="公司">
				<el-select v-model="formInline.companyId" @change="changeCompany" placeholder="请选择" size="small">
					<el-option v-for="item in companyIdMap" :label="item.partnerName" :value="item.id" :key="item.id">
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
			<el-form-item label="订单状态">
				<el-select v-model="formInline.status" placeholder="请选择" size="small">
					<el-option v-for="item in statusMap" :label="item.label" :value="item.value" :key="item.label">
						{{ item.label }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="订单类型">
				<el-select v-model="formInline.type" placeholder="请选择" size="small">
					<el-option v-for="item in typeMap" :label="item.label" :value="item.value" :key="item.label">
						{{ item.label }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="订单时间范围">
				<el-date-picker
					v-model="formInline.orderDateStart"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
					size="small"
				>
				</el-date-picker>
				<el-date-picker
					v-model="formInline.orderDateEnd"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
					size="small"
				>
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryData" type="primary" size="mini" icon="el-icon-search">查询</el-button>
				<!-- <el-button @click="goExport" type="primary">导出</el-button> -->
			</el-form-item>
		</el-form>
		<el-table
			:data="tableData"
			stripe
			v-loading="tableLoading"
			style="width: 100%"
			height="650"
			:cell-style="{ 'text-align': 'center' }"
			:header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
			border
			@row-dblclick="handledbClick"
		>
			<el-table-column v-if="idshow" prop="id" label="主键" width="0"> </el-table-column>
			<el-table-column v-if="companyIdshow" prop="partnerId" label="公司主键" width="0"> </el-table-column>
			<el-table-column prop="partnerName" label="公司名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopName" label="店铺名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="oId" label="内部订单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="soId" label="线上订单号" width="200" align="center"> </el-table-column>

			<el-table-column prop="status" label="订单状态" width="100" align="center">
				<template slot-scope="scope">
					<p v-for="item in statusMap" :key="item.value">
						<span v-if="item.value == scope.row.status">{{ item.label }}</span>
					</p>
				</template>
			</el-table-column>
			<el-table-column prop="type" label="订单类型" width="100" align="center">
				<template slot-scope="scope">
					<p v-for="item in typeMap" :key="item.value">
						<span v-if="item.value == scope.row.type">{{ item.label }}</span>
					</p>
				</template>
			</el-table-column>

			<el-table-column prop="orderDate" label="下单时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="isCod" label="是否货到付款" width="200" align="center"> </el-table-column>
			<el-table-column prop="lId" label="快递单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="sendDate" label="发货日期" width="200" align="center"> </el-table-column>
			<el-table-column prop="payDate" label="支付时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="freight" label="运费" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverAddress" label="收货地址" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverDistrict" label="区" width="200" align="center"> </el-table-column>
			<el-table-column prop="wmsCoId" label="发货仓编号" width="200" align="center"> </el-table-column>

			<el-table-column prop="logisticsCompany" label="快递公司" width="200" align="center"> </el-table-column>
			<el-table-column prop="freeAmount" label="抵扣金额" width="200" align="center"> </el-table-column>
			<el-table-column prop="questionType" label="问题类型" width="200" align="center"> </el-table-column>
			<el-table-column prop="outerPayId" label="外部支付单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="soId" label="线上订单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="orderFrom" label="订单来源" width="200" align="center"> </el-table-column>
			<el-table-column prop="payAmount" label="应付金额" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopBuyerId" label="买家昵称" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopStatus" label="平台订单状态" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverMobile" label="手机" width="200" align="center"> </el-table-column>

			<el-table-column prop="questionDesc" label="问题描述" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverCity" label="收件信息-市" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverState" label="收件信息-省" width="200" align="center"> </el-table-column>

			<el-table-column prop="receiverName" label="收件信息-收件人" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopId" label="店铺编号" width="200" align="center"> </el-table-column>
			<el-table-column prop="coId" label="公司编号" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverName" label="收件信息-收件人" width="200" align="center"> </el-table-column>
			<el-table-column prop="drpCoIdFrom" label="分销商编号" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverName" label="收件信息-收件人" width="200" align="center"> </el-table-column>
			<el-table-column prop="modified" label="修改时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverName" label="收件信息-收件人" width="200" align="center"> </el-table-column>
			<el-table-column prop="labels" label="多标签" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverName" label="收件信息-收件人" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverName" label="收件信息-收件人" width="200" align="center"> </el-table-column>
			<el-table-column prop="paidAmount" label="实际支付金额" width="200" align="center"> </el-table-column>
			<el-table-column prop="currency" label="币种" width="200" align="center"> </el-table-column>
			<el-table-column prop="buyerMessage" label="买家留言" width="200" align="center"> </el-table-column>
			<el-table-column prop="lcId" label="物流公司编码" width="200" align="center"> </el-table-column>
			<el-table-column prop="invoiceTitle" label="发票抬头" width="200" align="center"> </el-table-column>
			<el-table-column prop="invoiceType" label="发票类型" width="200" align="center"> </el-table-column>
			<el-table-column prop="buyerTaxNo" label="发票税号" width="200" align="center"> </el-table-column>
			<el-table-column prop="creatorName" label="业务员" width="200" align="center"> </el-table-column>
			<el-table-column prop="planDeliveryDate" label="计划发货时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="node" label="线下备注" width="200" align="center"> </el-table-column>
			<el-table-column prop="receiverTown" label="收件信息-街道" width="200" align="center"> </el-table-column>
			<el-table-column prop="remark" label="订单备注；卖家备注" width="200" align="center"> </el-table-column>
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
						<el-table-column prop="isGift" label="是否赠品" width="200" align="center"> </el-table-column>
						<el-table-column prop="skuId" label="商家编码" width="200" align="center"> </el-table-column>
						<el-table-column prop="name" label="商品名称" width="200" align="center"> </el-table-column>
						<el-table-column prop="refundStatus" label="申请退款的状态" width="200" align="center"> </el-table-column>
						<el-table-column prop="refundId" label="退款的唯一单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="price" label="单价" width="200" align="center"> </el-table-column>
						<el-table-column prop="outerOiId" label="子订单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="itemStatus" label="商品状态" width="200" align="center"> </el-table-column>
						<el-table-column prop="iId" label="款式编码" width="200" align="center"> </el-table-column>
						<el-table-column prop="propertiesValue" label="属性" width="200" align="center"> </el-table-column>
						<el-table-column prop="oiId" label="子订单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="amount" label="总额" width="200" align="center"> </el-table-column>

						<el-table-column prop="amount" label="总额" width="200" align="center"> </el-table-column>
						<el-table-column prop="shopSkuId" label="外部sku_id" width="200" align="center"> </el-table-column>
						<el-table-column prop="rawSoId" label="原始线上单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="qty" label="数量" width="200" align="center"> </el-table-column>
						<el-table-column prop="isPresale" label="是否预售" width="200" align="center"> </el-table-column>
						<el-table-column prop="basePrice" label="基本售价" width="200" align="center"> </el-table-column>
						<el-table-column prop="pic" label="商品图片" width="200" align="center">
							<template slot-scope="scope">
								<img v-if="scope.row.pic" :src="scope.row.pic" style="height: 80px; width: 80px" />
								<img v-if="!scope.row.pic" :src="defaultGoods" style="height: 80px; width: 80px" />
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="支付信息">
					<el-table
						:data="detailPayTableData"
						stripe
						style="width: 100%"
						height="400"
						:cell-style="{ 'text-align': 'center' }"
						:header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
						border
					>
						<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
						<el-table-column prop="isOrderPay" label="是否支付" width="200" align="center"> </el-table-column>
						<el-table-column prop="buyerAccount" label="支付帐号" width="200" align="center"> </el-table-column>
						<el-table-column prop="shopName" label="店铺名称" width="200" align="center"> </el-table-column>
						<el-table-column prop="shopId" label="店铺编号" width="200" align="center"> </el-table-column>
						<el-table-column prop="amount" label="支付金额" width="200" align="center"> </el-table-column>
						<el-table-column prop="payDate" label="支付日期" width="200" align="center"> </el-table-column>
						<el-table-column prop="outerPayId" label="外部支付单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="payId" label="支付单ID" width="200" align="center"> </el-table-column>
						<el-table-column prop="payment" label="支付渠道" width="200" align="center"> </el-table-column>
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
				orderDateStart: '',
				orderDateEnd: '',
				shopName: '',
				shopId: '',
				oId: '',
				soId: '',
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
				orderId: row.id
			}).then(
				res => {
					console.log('res :', res)
					that.detailPayTableData = res.result.orderPayDtoList
					that.detailItemTableData = res.result.orderItemDtoList
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
				status: this.formInline.status,
				shopName: this.formInline.shopName,
				shopId: this.formInline.shopId,
				type: this.formInline.type,
				orderDateStart: this.formInline.orderDateStart,
				orderDateEnd: this.formInline.orderDateEnd,
				pageInfo: {
					pageNum: this.formInline.pageInfo.pageNum,
					pageSize: this.formInline.pageInfo.pageSize
				}
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.orderDtoList
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
