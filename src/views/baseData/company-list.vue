<template>
	<div class="root">
		<el-form :inline="true" :model="formInline">
			<el-form-item label="公司名称">
				<el-input v-model="formInline.partnerName" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="状态">
				<el-select v-model="formInline.status" placeholder="请选择" size="small">
					<el-option v-for="item in statusMap" :key="item.value" :label="item.label" :value="item.value">
						{{ item.label }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="有效期范围">
				<el-date-picker
					v-model="formInline.expiredDateStart"
					type="datetime"
					placeholder="选择日期"
					value-format="yyyy-MM-dd HH:mm:ss"
					size="small"
				>
				</el-date-picker>
				<el-date-picker
					v-model="formInline.expiredDateEnd"
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
			style="width: 100%"
			height="620"
			v-loading="tableLoading"
			:cell-style="{ 'text-align': 'center' }"
			:header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
			border
		>
			<el-table-column v-if="idshow" prop="id" label="主键" width="0"> </el-table-column>
			<el-table-column prop="partnerName" label="公司名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="partnerid" label="公司编号" width="300" align="center"> </el-table-column>
			<el-table-column prop="token" label="接入密钥" width="300" align="center"> </el-table-column>
			<el-table-column prop="status" label="状态" width="50" align="center">
				<template slot-scope="scope">{{ scope.row.status == '0' ? '停用' : '启用' }}</template>
			</el-table-column>
			<el-table-column prop="expiredDate" label="token有效日期" width="200" align="center"> </el-table-column>
			<el-table-column prop="lastRefreshTokenTime" label="最后刷新token的时间" width="200" align="center">
			</el-table-column>
			<el-table-column prop="firstDrp" label="是否是第一次拉取分销商信息" width="100" align="center">
				<template slot-scope="scope">{{ scope.row.firstDrp == '0' ? '否' : '是' }}</template>
			</el-table-column>
			<el-table-column prop="firstSku" label="是否是第一次拉取普通商品信息" width="100" align="center">
				<template slot-scope="scope">{{ scope.row.firstSku == '0' ? '否' : '是' }}</template>
			</el-table-column>

			<el-table-column prop="firstCategory" label="是否是第一次拉取商品类目信息" width="100" align="center">
				<template slot-scope="scope">{{ scope.row.firstCategory == '0' ? '否' : '是' }}</template>
			</el-table-column>
			<el-table-column prop="firstCombineSku" label="是否是第一次拉取组合商品信息" width="100" align="center">
				<template slot-scope="scope">{{ scope.row.firstCombineSku == '0' ? '否' : '是' }}</template>
			</el-table-column>
			<el-table-column prop="firstInventory" label="是否是第一次拉取库存信息" width="100" align="center">
				<template slot-scope="scope">{{ scope.row.firstInventory == '0' ? '否' : '是' }}</template>
			</el-table-column>
			<el-table-column prop="firstLogistic" label="是否是第一次拉取发货信息" width="100" align="center">
				<template slot-scope="scope">{{ scope.row.firstLogistic == '0' ? '否' : '是' }}</template>
			</el-table-column>
			<el-table-column prop="firstOrder" label="是否是第一次拉取订单信息" width="100" align="center">
				<template slot-scope="scope">{{ scope.row.firstOrder == '0' ? '否' : '是' }}</template>
			</el-table-column>
			<el-table-column prop="firstRefund" label="是否是第一次拉取退货退款信息" width="100" align="center">
				<template slot-scope="scope">{{ scope.row.firstRefund == '0' ? '否' : '是' }}</template>
			</el-table-column>
		</el-table>
		<el-pagination
			background
			layout="total,prev,sizes,pager,next"
			:total="total"
			:pageSize="formInline.pageInfo.pageSize"
			:currentPage="formInline.pageInfo.pageNum"
			@current-change="page"
			@size-change="handleSizeChange"
		>
		</el-pagination>
	</div>
</template>

<style scoped></style>

<script>
export default {
	data() {
		return {
			formInline: {
				partnerName: '',
				status: '',
				expiredDateStart: '',
				expiredDateEnd: '',
				pageInfo: {
					pageNum: 1,
					pageSize: 10,
					sort: true
				}
			},
			statusMap: [{ value: '', label: '全部' }, { value: '1', label: '启用' }, { value: '0', label: '停用' }],
			idshow: false,
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
		handleSizeChange(pageSize) {
			this.formInline.pageInfo.pageNum = 1
			this.formInline.pageInfo.pageSize = pageSize
			this.goSearch()
		},
		queryData() {
			this.formInline.pageInfo.pageNum = 1
			this.goSearch()
		},
		goSearch() {
			const that = this
			this.tableLoading = true
			this.req({
				url: `life/portal/partnerList`,
				data: {
					partnerName: this.formInline.partnerName,
					status: this.formInline.status,
					expiredDateStart: this.formInline.expiredDateStart,
					expiredDateEnd: this.formInline.expiredDateEnd,
					pageInfo: {
						pageNum: this.formInline.pageInfo.pageNum,
						pageSize: this.formInline.pageInfo.pageSize
					}
				},
				method: 'POST'
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.lifePartnerQueryListDtos
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
	computed: {},
	mounted() {
		// 获取接口列表
		// getInterfaces().then(
		//   (res) => {
		//     console.log("res :", res);
		//     that.interfaceTypeMap = res.data.data;
		//   },
		//   (err) => {
		//     console.log("err :", err);
		//   }
		// );
		this.goSearch()
	}
}
</script>
