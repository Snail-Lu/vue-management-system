<template>
	<div class="root">
		<el-form :inline="true" :model="formInline">
			<!-- <el-form-item label="公司名称">
            <el-input v-model="formInline.partnerName" clearable></el-input>
          </el-form-item> -->
			<el-form-item label="公司名称">
				<el-select v-model="formInline.partnerId" placeholder="请选择" size="small">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in partnerIdMap" :key="item.id" :label="item.partnerName" :value="item.id">
						{{ item.partnerName }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类目名称">
				<el-input v-model="formInline.name" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="父级类目名称">
				<el-input v-model="formInline.parentCName" clearable size="small"></el-input>
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
			<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="name" label="类目名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="parentCName" label="父级类目名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="cId" label="类目id" width="300" align="center"> </el-table-column>
			<el-table-column prop="parentCId" label="父级类目id" width="200" align="center"> </el-table-column>
			<el-table-column prop="modified" label="修改时间" align="center"> </el-table-column>
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
export default {
	data() {
		return {
			formInline: {
				partnerId: '',
				name: '',
				parentCName: '',
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
			console.log('获取商品类目数据')
			const that = this
			this.tableLoading = true
			this.req({
				url: `life/portal/category`,
				data: {
					partnerId: this.formInline.partnerId,
					name: this.formInline.name,
					parentCName: this.formInline.parentCName,
					pageInfo: {
						pageNum: this.formInline.pageInfo.pageNum,
						pageSize: this.formInline.pageInfo.pageSize
					}
				},
				method: 'POST'
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.pullPartnerQueryCategoryDtoList
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
		this.goSearch()
	}
}
</script>
