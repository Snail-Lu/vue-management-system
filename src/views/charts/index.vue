<template>
	<div>
		<el-row :gutter="20">
			<el-col :xs="24" :sm="24" :lg="12">
				<div class="chart-wrapper">
					<bar-chart />
				</div>
			</el-col>
			<el-col :xs="24" :sm="24" :lg="12">
				<div class="chart-wrapper">
					<line-chart />
				</div>
			</el-col>
		</el-row>
		<el-row style="margin-top: 20px;">
			<div class="chart-wrapper">
				<pie-chart />
			</div>
		</el-row>
		<el-row style="margin-top: 20px;">
			<div class="chart-wrapper">
				<radar-chart />
			</div>
		</el-row>
	</div>
</template>
<script>
import BarChart from './components/BarChart.vue'
import LineChart from './components/LineChart.vue'
import PieChart from './components/PieChart.vue'
import RadarChart from './components/RadarChart.vue'
export default {
	components: {
		BarChart,
		LineChart,
		PieChart,
		RadarChart
	},
	methods: {}
}
</script>
<style lang="scss" scoped>
.chart-wrapper {
	background-color: #fff;
}
</style>
