<template>
	<div>
		<Doughnut
			:chart-options="options"
			:chart-data="record"
			chart-id="doughnut-chart"
			:height="200"
		/>
	</div>
</template>

<script>
import { Doughnut } from 'vue-chartjs/legacy'
import {
  Chart as Donut,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'
Donut.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
	name: "ChartDonut",
  components: { Doughnut },
	props: {
		record: {
			type: Object,
      default: () => {}
    },
		options: {
			type: Object,
			default: () => {}
		},
  },
}
</script>

<style>

</style>