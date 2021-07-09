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
			<el-form-item label="商品编码">
				<el-input v-model="formInline.skuId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="款式编码">
				<el-input v-model="formInline.iId" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="商品名称">
				<el-input v-model="formInline.name" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="商品简称">
				<el-input v-model="formInline.shortName" clearable size="small"></el-input>
			</el-form-item>
			<el-form-item label="商品属性">
				<el-select v-model="formInline.itemType" placeholder="请选择" size="small">
					<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
						{{ item.label }}
					</el-option>
				</el-select>
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
			<el-table-column label="商品图片" prop="pic" width="100">
				<template slot-scope="scope">
					<el-image
						style="width: 40px; height: 40px"
						v-if="scope.row.pic"
						:src="scope.row.pic"
						:preview-src-list="[scope.row.pic]"
					>
					</el-image>
					<el-image
						style="width: 40px; height: 40px"
						v-if="!scope.row.pic"
						:src="defaultGoods"
						:preview-src-list="[defaultGoods]"
					>
					</el-image>
				</template>
			</el-table-column>

			<el-table-column prop="partnerName" label="公司名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="skuId" label="商品编码" width="200" align="center"> </el-table-column>
			<el-table-column prop="iId" label="款式编码" width="200" align="center"> </el-table-column>
			<el-table-column prop="name" label="商品名称" width="400" align="center"> </el-table-column>
			<el-table-column prop="shortName" label="商品简称" width="200" align="center"> </el-table-column>
			<el-table-column prop="salePrice" label="销售价" width="100" align="center"> </el-table-column>
			<el-table-column prop="costPrice" label="成本价" width="100" align="center"> </el-table-column>
			<el-table-column prop="propertiesValue" label="颜色规格" width="300" align="center"> </el-table-column>
			<el-table-column prop="category" label="分类" width="200" align="center"> </el-table-column>
			<el-table-column prop="enabled" label="是否启用" width="100" align="center">
				<template slot-scope="scope">{{
					scope.row.enabled == '1' ? '启用' : scope.row.enabled == '0' ? '备用' : '禁用'
				}}</template>
			</el-table-column>
			<el-table-column prop="skuType" label="商品类型" width="100" align="center"> </el-table-column>
			<el-table-column prop="propertiesName" label="属性名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="itemType" label="商品属性" width="100" align="center"> </el-table-column>
			<el-table-column prop="unit" label="单位" width="100" align="center"> </el-table-column>
			<el-table-column align="center" fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="querySkuDStl(scope.row.id)">查看详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			background
			layout="total,prev,sizes,pager, next"
			:total="total"
			@size-change="handleSizeChange"
			:pageSize="formInline.pageInfo.pageSize"
			:currentPage="formInline.pageInfo.pageNum"
			@current-change="page"
		>
		</el-pagination>
		<el-dialog title="商品详情" :visible.sync="goodDetailVisible" width="70%">
			<el-form :model="goodsData">
				<el-row>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="商品图片" :label-width="formLabelWidth">
							<img v-if="goodsData.pic" :src="goodsData.pic" style="height: 90px; width: 90px" />
							<img v-if="!goodsData.pic" :src="defaultGoods" style="height: 90px; width: 90px" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="商品状态" :label-width="formLabelWidth">
							<el-input
								v-model="goodsData.enabled == '1' ? '启用' : goodsData.enabled == '0' ? '备用' : '禁用'"
								size="mini"
								disabled
							>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="商品属性" :label-width="formLabelWidth">
							<el-input size="mini" v-model="goodsData.itemType" autocomplete="off" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="公司名称" :label-width="formLabelWidth">
							<el-input size="mini" v-model="goodsData.partnerName" autocomplete="off" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="商品编码" :label-width="formLabelWidth">
							<el-input size="mini" v-model="goodsData.skuId" autocomplete="off" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="款式编码" :label-width="formLabelWidth">
							<el-input size="mini" v-model="goodsData.iId" autocomplete="off" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="商品名称" :label-width="formLabelWidth">
							<el-input size="mini" v-model="goodsData.name" autocomplete="off" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="商品简称" :label-width="formLabelWidth">
							<el-input size="mini" v-model="goodsData.shortName" autocomplete="off" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="销售价" :label-width="formLabelWidth">
							<el-input v-model="goodsData.salePrice" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="成本价" :label-width="formLabelWidth">
							<el-input v-model="goodsData.costPrice" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="颜色规格" :label-width="formLabelWidth">
							<el-input v-model="goodsData.propertiesValue" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="分类" :label-width="formLabelWidth">
							<el-input v-model="goodsData.category" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="重量" :label-width="formLabelWidth">
							<el-input v-model="goodsData.weight" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="市场价" :label-width="formLabelWidth">
							<el-input v-model="goodsData.marketPrice" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="品牌" :label-width="formLabelWidth">
							<el-input v-model="goodsData.brand" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="供应商编号" :label-width="formLabelWidth">
							<el-input v-model="goodsData.supplierId" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="供应商名称" :label-width="formLabelWidth">
							<el-input v-model="goodsData.supplierName" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="国际码" :label-width="formLabelWidth">
							<el-input v-model="goodsData.skuCode" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="颜色" :label-width="formLabelWidth">
							<el-input v-model="goodsData.color" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="属性名称" :label-width="formLabelWidth">
							<el-input v-model="goodsData.propertiesName" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="供应商商品编码" :label-width="formLabelWidth">
							<el-input v-model="goodsData.supplierSkuId" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="供应商商品款号" :label-width="formLabelWidth">
							<el-input v-model="goodsData.supplierIId" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="虚拟分类" :label-width="formLabelWidth">
							<el-input v-model="goodsData.vcName" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item style="width: 310px" label="商品类型" :label-width="formLabelWidth">
							<el-input v-model="goodsData.skuType" autocomplete="off" size="mini" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
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
				skuId: '',
				iId: '',
				name: '',
				shortName: '',
				itemType: '',
				propertiesName: '',
				pageInfo: {
					pageNum: 1,
					pageSize: 10,
					sort: true
				}
			},
			typeList: [
				{
					value: '',
					label: '全部'
				},
				{
					value: '成品',
					label: '成品'
				},
				{
					value: '半成品',
					label: '半成品'
				},
				{
					value: '原材料',
					label: '原材料'
				},
				{
					value: '包材',
					label: '包材'
				}
			],
			partnerIdMap: [],
			idshow: false,
			pidshow: false,
			tableData: [],
			currentPage: 1,
			total: 0,
			goodDetailVisible: false,
			tableLoading: false,
			goodsData: {},
			formLabelWidth: '110px'
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
			console.log('获取普通商品数据')
			const that = this
			this.tableLoading = true
			this.req({
				url: `life/portal/sku`,
				data: {
					partnerId: this.formInline.partnerId,
					skuId: this.formInline.skuId,
					itemType: this.formInline.itemType,
					iId: this.formInline.iId,
					name: this.formInline.name,
					shortName: this.formInline.shortName,
					// propertiesName: this.formInline.propertiesName,
					pageInfo: {
						pageNum: this.formInline.pageInfo.pageNum,
						pageSize: this.formInline.pageInfo.pageSize
					}
				},
				method: 'POST'
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.partnerSkuQueryListDtoList
					that.total = res.result.total
					this.tableLoading = false
				},
				err => {
					console.log('err :', err)
					this.tableLoading = false
				}
			)
		},
		querySkuDStl(id) {
			this.goodDetailVisible = true
			console.log('获取商品详情~ID：' + id)
			const that = this
			this.req({
				url: `life/portal/skuDetail`,
				data: {
					id: id
				},
				method: 'POST'
			}).then(
				res => {
					console.log('res :', res)
					that.goodsData = res.result.partnerSkuQueryDtlDto
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
