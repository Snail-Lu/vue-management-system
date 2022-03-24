<template>
	<div class="root">
		<el-form :inline="true" :model="searchForm">
			<el-form-item label="商品编码">
				<el-input v-model="searchForm.goodsCode" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="商品名称">
				<el-input v-model="searchForm.goodsName" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="onSearch" type="primary" size="mini" icon="el-icon-search">查询</el-button>
				<el-button @click="onAdd" type="primary" size="mini" icon="el-icon-plus">新增</el-button>
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
			<el-table-column label="商品图片" prop="pic" width="100">
				<template slot-scope="scope">
					<el-image
						style="width: 40px; height: 40px"
						v-if="scope.row.pic"
						:src="scope.row.pic"
						:preview-src-list="[scope.row.pic]"
					>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="skuId" label="商品编码" />
			<el-table-column prop="name" label="商品名称" />
			<el-table-column prop="shortName" label="商品简称" />
			<el-table-column prop="salePrice" label="销售价" />
			<el-table-column prop="costPrice" label="成本价" />
			<el-table-column prop="category" label="分类" />
			<el-table-column prop="enabled" label="是否启用">
				<template slot-scope="scope">{{
					scope.row.enabled == '1' ? '启用' : scope.row.enabled == '0' ? '备用' : '禁用'
				}}</template>
			</el-table-column>
			<el-table-column align="center" fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			background
			layout="total,prev,sizes,pager, next"
			:total="total"
			@size-change="handleSizeChange"
			:pageSize="searchForm.pageInfo.pageSize"
			:currentPage="searchForm.pageInfo.pageNum"
			@current-change="page"
		>
		</el-pagination>
	</div>
</template>

<script>
export default {
	data() {
		return {
			searchForm: {
				goodsCode: '',
				goodsName: '',
				pageInfo: {
					pageNum: 1,
					pageSize: 10,
					sort: true
				}
			},
			tableData: [],
			currentPage: 1,
			total: 0,
			tableLoading: false
		}
	},
	methods: {
		page(currentPage) {
			this.searchForm.pageInfo.pageNum = currentPage
			this.getData()
		},
		handleSizeChange(currentPage) {
			this.searchForm.pageInfo.pageSize = currentPage
			this.getData()
		},
		onSearch() {
			this.searchForm.pageInfo.pageNum = 1
			this.getData()
		},
		getData() {
			const { searchForm: data } = this
			this.tableLoading = true
			this.req({
				url: `/list`,
				data,
				method: 'POST'
			}).then(
				res => {
					this.tableData = res.result.list
					this.total = res.result.total
					this.tableLoading = false
				},
				err => {
					this.tableLoading = false
				}
			)
		},
		onAdd() {
			this.$router.push({ path: '/table/add' })
		}
	}
}
</script>

<style scoped></style>
