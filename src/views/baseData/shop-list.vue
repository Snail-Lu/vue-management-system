<template>
	<div class="root">
		<el-form :inline="true" :model="formInline">
			<el-form-item label="公司">
				<el-select v-model="formInline.partnerId" placeholder="请选择" @change="changeCompany" size="small">
					<el-option label="全部" value=""></el-option>
					<el-option v-for="item in partnerIdMap" :key="item.id" :label="item.partnerName" :value="item.id">
						{{ item.partnerName }}
					</el-option>
				</el-select>
			</el-form-item>
			<!-- <el-col :span="6">
            <el-form-item label="昵称">
           <el-select v-model="formInline.nick" placeholder="请选择">
              <el-option
                v-for="item in nickMap"
                :key="item.id"
                :label="item.nick"
                :value="item.nick"
              >
                {{ item.nick }}
              </el-option>
            </el-select> 
            <el-input v-model="formInline.nick" clearable></el-input>
          </el-form-item>
        </el-col> -->
			<el-form-item label="店铺名称">
				<el-select v-model="formInline.shopId" placeholder="请选择" size="small">
					<el-option v-for="item in storeList" :key="item.shopId" :label="item.shopName" :value="item.shopId">
						{{ item.shopName }}
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否拉取">
				<el-select v-model="formInline.needPull" placeholder="请选择" size="small">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						{{ item.label }}
					</el-option>
				</el-select>
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
			<el-table-column prop="partnerName" label="合作方名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="lastPullTime" label="最后拉取时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopId" label="店铺编号" width="200" align="center"> </el-table-column>
			<el-table-column prop="created" label="创建时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopName" label="店铺名称" width="200" align="center"> </el-table-column>
			<el-table-column prop="shopSite" label="站点" width="200" align="center"> </el-table-column>
			<el-table-column prop="sessionExpired" label="授权过期时间" width="200" align="center"> </el-table-column>
			<el-table-column prop="nick" label="昵称" width="200" align="center"> </el-table-column>
			<el-table-column prop="organization" label="组织" width="200" align="center"> </el-table-column>
			<el-table-column prop="needPull" label="是否拉取" width="100" align="center">
				<template slot-scope="scope">{{ scope.row.needPull == '0' ? '否' : '是' }}</template>
			</el-table-column>
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

<style scoped></style>

<script>
import { getPartnerList, getStoreList } from '@/api/system.js'
export default {
	data() {
		return {
			formInline: {
				partnerId: '',
				shopId: '',
				shopName: '',
				needPull: '1',
				pageInfo: {
					pageNum: 1,
					pageSize: 10,
					sort: true
				}
			},
			partnerIdMap: [],
			options: [
				{
					value: '',
					label: '全部'
				},
				{
					value: '1',
					label: '是'
				},
				{
					value: '0',
					label: '否'
				}
			],
			// nickMap:[],
			idshow: false,
			partnerIdshow: false,
			tableLoading: false,
			tableData: [],
			storeList: [],
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
			console.log('获取店铺数据')
			const that = this
			this.tableLoading = true
			this.req({
				url: `life/portal/pullShop`,
				data: {
					partnerId: this.formInline.partnerId,
					shopId: this.formInline.shopId,
					shopName: this.formInline.shopName,
					needPull: this.formInline.needPull,
					pageInfo: {
						pageNum: this.formInline.pageInfo.pageNum,
						pageSize: this.formInline.pageInfo.pageSize
					}
				},
				method: 'POST'
			}).then(
				res => {
					console.log('res :', res)
					that.tableData = res.result.shopQueryDtoLists
					that.total = res.result.total
					this.tableLoading = false
				},
				err => {
					console.log('err :', err)
					this.tableLoading = false
				}
			)
		},
		// changeSelect() {
		//   console.log("合作方下拉变化");
		//   this.formInline.nick = "";
		//   const partnerId = this.formInline.partnerId;
		//   //根据合作方id查询昵称列表
		//   //  this.getNickList(partnerId);
		// },
		getNickList(partnerId) {
			console.log('根据合作方ID:' + partnerId + '查询昵称列表')
			const that = this
			this.req({
				url: `life/portal/queryPartnerNickByPartnerId`,
				data: {
					partnerId: this.formInline.partnerId
				},
				method: 'POST'
			}).then(
				res => {
					console.log('res :', res)
					that.nickMap = res.result.partnerNickQueryDtos
				},
				err => {
					console.log('err :', err)
				}
			)
		},
		changeCompany(e) {
			console.log(e)
			this.formInline.partnerId = e
			this.formInline.shopId = ''
			this.getStoreList()
		},
		getStoreList() {
			this.storeList = []
			getStoreList({
				partnerId: this.formInline.partnerId,
				pageInfo: {
					pageNum: 1,
					pageSize: 1000000,
					sort: true
				}
			}).then(res => {
				console.log(res)
				this.storeList = res.result.shopQueryDtoLists
				console.log(this.storeList, '222')
				this.storeList.unshift({ shopId: '', shopName: '全部' })
			})
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
		this.getStoreList()
		this.goSearch()
	}
}</script
>>
