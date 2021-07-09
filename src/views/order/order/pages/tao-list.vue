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
			<el-form-item label="出库状态">
				<el-select v-model="formInline.status" placeholder="请选择" size="small">
					<el-option v-for="item in statusMap" :key="item.value" :label="item.label" :value="item.value">
						{{ item.label }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="订单类型">
				<el-select v-model="formInline.orderType" placeholder="请选择" size="small">
					<el-option v-for="item in typeMap" :key="item.value" :label="item.label" :value="item.value">
						{{ item.label }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="支付时间范围">
				<el-date-picker
					v-model="formInline.payDateStart"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
					size="small"
				>
				</el-date-picker>
				<el-date-picker
					v-model="formInline.payDateEnd"
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
			:header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
			border
			@row-dblclick="handledbClick"
			:cell-style="setRowStyle"
		>
			<el-table-column prop="businessStaff" label="业务人员" width="200" align="center" highlight-current-row>
			</el-table-column>
			<el-table-column prop="coId" label="公司编号" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopName" label="店铺名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="drpCoIdFrom" label="分销商编号" width="200" align="center"> </el-table-column>
			<el-table-column prop="created" label="创建时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="ioDate" label="出库时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="modified" label="修改时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="status" label="出库状态" width="150" align="center">
				<template slot-scope="scope">
					<p v-for="item in statusMap" :key="item.value">
						<span v-if="item.value == scope.row.status">{{ item.label }}</span>
					</p>
				</template>
			</el-table-column>
			<el-table-column prop="orderType" label="订单类型" width="200" align="center">
				<template slot-scope="scope">
					<p v-for="item in typeMap" :key="item.value">
						<span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
					</p>
				</template>
			</el-table-column>
			<el-table-column prop="payDate" label="支付时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="isCod" label="是否货到付款" width="200" align="center"> </el-table-column>
			<el-table-column prop="buyerMessage" label="买家留言" width="200" align="center"> </el-table-column>
			<el-table-column prop="lId" label="快递单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="paidAmount" label="实际支付金额" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopBuyerId" width="200" label="买家帐号" align="center"> </el-table-column>
			<el-table-column prop="shopId" label="店铺编号" width="200" align="center"> </el-table-column>
			<el-table-column prop="oId" label="ERP 内部订单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="soId" label="线上订单号" width="200" align="center"> </el-table-column>
			<el-table-column prop="wmsCoId" label="分仓编号" width="200" align="center"> </el-table-column>
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
						<el-table-column prop="skuId" label="商品编码" width="200" align="center"> </el-table-column>
						<el-table-column prop="name" label="商品名称" width="200" align="center"> </el-table-column>
						<el-table-column prop="ioiId" label="子订单号" width="200" align="center"> </el-table-column>
						<el-table-column prop="iId" label="款式编码" width="200" align="center"> </el-table-column>
						<el-table-column prop="propertiesValue" label="颜色规格" width="200" align="center"> </el-table-column>
						<el-table-column prop="saleAmount" label="金额" width="200" align="center"> </el-table-column>
						<el-table-column prop="qty" label="数量" width="200" align="center"> </el-table-column>
						<el-table-column prop="saleBasePrice" label="基本售价" width="200" align="center"> </el-table-column>
						<el-table-column prop="salePrice" label="单价" width="200" align="center"> </el-table-column>
						<el-table-column prop="pic" label="商品图片" width="200" align="center">
							<template slot-scope="scope">
								<img v-if="scope.row.pic" :src="scope.row.pic" style="height: 80px; width: 80px" />
								<img v-if="!scope.row.pic" :src="defaultGoods" style="height: 80px; width: 80px" />
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- <el-tab-pane label="出库信息">
          <el-table
            :data="detailPayTableData"
            stripe
            style="width: 100%"
            height="400"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
            border
          >

            <el-table-column
              prop="lastPullTime"
              label="最后拉取时间"
              width="200"
              align="center"
            >
            </el-table-column>
             <el-table-column
              prop="ioDate"
              label="出库时间"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="businessStaff"
              label="业务人员"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="buyerMessage"
              width="200"
              label="买家留言"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="partnerName"
              width="200"
              label="公司名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="created"
              width="200"
              label="创建时间"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="currency"
              width="200"
              label="币种"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="drpCoIdFrom"
              width="200"
              label="分销商编号"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="fWeight"
              width="200"
              label="实称重量"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="freeAmount"
              width="200"
              label="抵扣金额"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="freight"
              width="200"
              label="运费"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="invoiceTitle"
              width="200"
              label="发票抬头"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="ioId"
              width="200"
              label="出库单号"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="status" label="出库状态" width="150" align="center">
            <template slot-scope="scope">
            <p v-for="item in statusMap" :key="item.value">
            <span v-if="item.value == scope.row.status">{{item.label}}</span>
            </p>
            </template>
            </el-table-column>
            <el-table-column
            prop="orderType"
            label="订单类型"
            width="200"
            align="center"
            >
            <template slot-scope="scope">
            <p v-for="item in typeMap" :key="item.value">
            <span v-if="item.value == scope.row.orderType">{{item.label}}</span>
            </p>
            </template>
            </el-table-column>
            <el-table-column
              prop="isCod"
              label="是否货到付款"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="lId"
              label="快递单号"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="lcId"
              label="物流公司编码"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="mergeSoId"
              label="合并订单号"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="modified"
              label="修改时间"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="paidAmount"
              label="实际支付金额"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="payAmount"
              label="应付金额"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="payDate"
              label="支付时间"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="receiverAddress"
              width="200"
              label="收货地址"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="receiverAddress"
              width="200"
              label="收件信息"
              align="center"
            >
            <template slot-scope="scope">
            {{scope.row.receiverState}}{{scope.row.receiverCity}}{{scope.row.receiverDistrict}}{{scope.row.receiverTown}}
            </template>
            </el-table-column>
            <el-table-column
              prop="receiverMobile"
              label="收件人电话"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="receiverPhone"
              width="200"
              label="收件人手机"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="receiverName"
              width="200"
              label="收件人"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="remark"
              label="订单备注；卖家备注"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="shopBuyerId"
              label="买家帐号"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="shopId"
              width="200"
              label="店铺编号"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="shopName"
              width="200"
              label="店铺名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="soId"
              label="线上订单号"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="weight"
              label="预估重量"
              width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="wmsCoId"
              label="分仓编号"
              width="200"
              align="center"
            >
            </el-table-column>
          </el-table>

        </el-tab-pane> -->
			</el-tabs>
		</el-dialog>
	</div>
</template>

<style scoped></style>

<script>
import { getPartnerList, getStoreList } from '@/api/system.js'
import { orderDeliveryListDetail, orderDeliveryList } from '../api'

export default {
	data() {
		return {
			defaultGoods: require('@/icons/default-sku.jpg'),
			tableLoading: false,
			formInline: {
				companyId: '',
				payDateEnd: '',
				payDateStart: '',
				shopId: '',
				oId: '',
				soId: '',
				status: '',
				orderType: '',
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
				{ value: 'Archive', label: '归档' },
				{ value: 'WaitConfirm', label: '待出库' },
				{ value: 'Confirmed', label: '已出库' },
				{ value: 'Cancelled', label: '取消' },
				{ value: 'Delete', label: '作废' },
				{ value: 'OuterConfirming', label: '外部发货中' }
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
		setRowStyle(row, index) {
			if (row.columnIndex == '0') {
				return 'color:#409EFF;'
			}
		},
		handledbClick(row, column, cell, event) {
			this.orderDetailVisible = true
			console.log('获取订单详情~ID：' + row.id)
			const that = this
			orderDeliveryListDetail({
				orderOutId: row.id
			}).then(
				res => {
					console.log('res :', res)
					that.detailPayTableData.push(res.result.orderOutDto)
					// orderOutDto
					that.detailItemTableData = res.result.orderOutItemDtoList
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
			orderDeliveryList(this.formInline).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.orderOutDtoList
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
