<template>
	<div>
		<Bar
			:chart-options="options"
			:chart-data="record"
			:plugins="plugins"
			chart-id="bar-chart"
			:height="300"
		/>
	</div>
</template>

<script>
import { Bar } from 'vue-chartjs/legacy'
import {
  Chart as ChartJSBar,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
ChartJSBar.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
	name: "ChartBar",
  components: { Bar },
	props: {
		record: {
			type: Object,
      default: () => {}
    },
		options: {
			type: Object,
			default: () => {}
		},
		plugins: {
      type: Array,
      default: () => []
    },
  },
}
</script>

<style>

</style>