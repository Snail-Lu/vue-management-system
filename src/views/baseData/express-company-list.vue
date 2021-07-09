<template>
	<div class="root">
		<el-form :inline="true" :model="formInline">
			<el-form-item label="公司">
				<el-select v-model="formInline.partnerId" placeholder="请选择" size="small">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in partnerIdMap" :key="item.id" :label="item.partnerName" :value="item.id">
						{{ item.partnerName }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="快递公司编码">
				<el-input v-model="formInline.lcId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="快递公司名称">
				<el-input v-model="formInline.lcName" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryData" type="primary" icon="el-icon-search" size="mini">查询</el-button>
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
			<el-table-column v-if="partnerIdshow" prop="partnerId" label="合作方主键" width="0"> </el-table-column>
			<el-table-column prop="partnerName" label="合作方名称" width="400" align="center"> </el-table-column>
			<el-table-column prop="lastPullTime" label="最后拉取时间" width="400" align="center"> </el-table-column>
			<el-table-column prop="lcId" label="快递公司编码" width="400" align="center"> </el-table-column>
			<el-table-column prop="lcName" label="快递公司" align="center"> </el-table-column>
		</el-table>
		<el-pagination
			background
			layout="total,prev, sizes, pager, next"
			:total="total"
			:pageSize="formInline.pageInfo.pageSize"
			:currentPage="formInline.pageInfo.pageNum"
			@current-change="page"
			@size-change="handleSizeChange"
		>
		</el-pagination>
	</div>
</template>

<script>
import { getPartnerList } from '@/api/system.js'
export default {
	data() {
		return {
			formInline: {
				partnerId: '',
				lcId: '',
				lcName: '',
				pageInfo: {
					pageNum: 1,
					pageSize: 10,
					sort: true
				}
			},
			partnerIdMap: [],
			tableData: [],
			idshow: false,
			partnerIdshow: false,
			tableLoading: false,
			currentPage: 1,
			total: 0
		}
	},
	methods: {
		goSearch() {
			console.log('获取数据')
			const that = this
			this.tableLoading = true
			this.req({
				url: `life/portal/logisticscompany`,
				data: {
					partnerId: this.formInline.partnerId,
					lcId: this.formInline.lcId,
					lcName: this.formInline.lcName,
					pageInfo: {
						pageNum: this.formInline.pageInfo.pageNum,
						pageSize: this.formInline.pageInfo.pageSize
					}
				},
				method: 'POST'
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.pullPartnerLocQueryDtos
					that.total = res.result.total
					this.tableLoading = false
				},
				err => {
					console.log('err :', err)
					this.tableLoading = false
				}
			)
		},
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
		}
	},
	mounted() {
		// 获取公司下拉
		console.log('获取公司')
		getPartnerList().then(
			res => {
				console.log('res公司下拉列表 :', res)
				this.partnerIdMap = res.result.lifePartnerQueryDtos
			},
			err => {
				console.log('err :', err)
			}
		)
		this.goSearch()
	}
}
</script>
