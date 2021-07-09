<template>
	<div class="root">
		<el-form :inline="true" :model="formInline">
			<el-form-item label="公司名称">
				<el-select v-model="formInline.partnerId" placeholder="请选择" size="small">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in partnerIdMap" :key="item.id" :label="item.partnerName" :value="item.id">
						{{ item.partnerName }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="组合款式编码">
				<el-input v-model="formInline.iId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="组合商品名称">
				<el-input v-model="formInline.name" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="简称">
				<el-input v-model="formInline.shortName" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item>
				<el-form-item>
					<el-button @click="queryData" type="primary" size="mini" icon="el-icon-search">查询</el-button>
					<!-- <el-button @click="goExport" type="primary">导出</el-button> -->
				</el-form-item>
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
			<el-table-column v-if="pidshow" prop="partnerId" label="life_partner的主键" width="0"> </el-table-column>
			<el-table-column label="商品图片" prop="pic" width="100">
				<template slot-scope="scope">
					<img v-if="scope.row.pic" :src="scope.row.pic" style="height: 80px; width: 80px" />
					<img v-if="!scope.row.pic" :src="defaultGoods" style="height: 80px; width: 80px" />
				</template>
			</el-table-column>

			<el-table-column prop="partnerName" label="公司名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="iId" label="组合款式编码" width="200" align="center"> </el-table-column>
			<el-table-column prop="name" label="组合商品名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="shortName" label="简称" width="200" align="center"> </el-table-column>
			<el-table-column prop="vcName" label="虚拟分类" width="200" align="center"> </el-table-column>
			<el-table-column prop="propertiesValue" label="组合颜色及规格" width="200" align="center"> </el-table-column>
			<el-table-column prop="salePrice" label="组合售价" width="100" align="center"> </el-table-column>
			<el-table-column prop="weight" label="组合重量" width="100" align="center"> </el-table-column>
			<el-table-column prop="skuId" label="组合装编码" width="100" align="center"> </el-table-column>
			<el-table-column prop="modified" label="修改时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
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
		<el-dialog title="组合商品明细" :visible.sync="skuItemVisible" width="60%">
			<el-table
				:data="skuItemTableData"
				stripe
				style="width: 100%"
				height="400"
				:cell-style="{ 'text-align': 'center' }"
				:header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
				border
			>
				<el-table-column v-if="itemIdshow" prop="id" label="主键" width="0"> </el-table-column>
				<el-table-column v-if="parIdshow" prop="partnerId" label="life_partner的主键" width="0"> </el-table-column>
				<el-table-column v-if="cSkuIdshow" prop="cSkuId" label="主表id" width="0"> </el-table-column>
				<el-table-column prop="partnerName" label="公司名称" width="200" align="center"> </el-table-column>
				<el-table-column prop="combineSkuId" label="如实记录" width="200" align="center"> </el-table-column>
				<el-table-column prop="srcSkuId" label="子商品编码" width="200" align="center"> </el-table-column>
				<el-table-column prop="qty" label="子商品数量" width="150" align="center"> </el-table-column>
				<el-table-column prop="salePrice" label="售价" width="150" align="center"> </el-table-column>
				<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<style scoped></style>

<script>
import { getPartnerList } from '@/api/system.js'
export default {
	data() {
		return {
			defaultGoods: require('@/icons/default-sku.jpg'),
			formInline: {
				partnerId: '',
				iId: '',
				name: '',
				shortName: '',
				pageInfo: {
					pageNum: 1,
					pageSize: 10,
					sort: true
				}
			},
			partnerIdMap: [],
			idshow: false,
			pidshow: false,
			tableData: [],
			currentPage: 1,
			total: 0,
			skuItemVisible: false,
			skuItemTableData: [],
			itemIdshow: false,
			parIdshow: false,
			tableLoading: false,
			cSkuIdshow: false
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
			console.log('获取商品组合数据')
			const that = this
			this.tableLoading = true
			this.req({
				url: `life/portal/combineSku`,
				data: {
					partnerId: this.formInline.partnerId,
					iId: this.formInline.iId,
					name: this.formInline.name,
					shortName: this.formInline.shortName,
					pageInfo: {
						pageNum: this.formInline.pageInfo.pageNum,
						pageSize: this.formInline.pageInfo.pageSize
					}
				},
				method: 'POST'
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.partnerCombineSkuQueryListDtoList
					that.total = res.result.total
					this.tableLoading = false
				},
				err => {
					console.log('err :', err)
					this.tableLoading = false
				}
			)
		},
		handledbClick(row, event, column) {
			this.skuItemVisible = true
			console.log('获取组合商品~ID：' + row.id)
			const that = this
			this.req({
				url: `/combineSkuItem`,
				data: {
					cSkuId: row.id
				},
				method: 'POST'
			}).then(
				res => {
					console.log('res :', res)
					that.skuItemTableData = res.result.partnerCombineSkuItemQueryListDtoList
				},
				err => {
					console.log('err :', err)
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
