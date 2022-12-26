<template>
  <div>
		<span hidden>{{ records }}</span>
		<div :style="stylePodium">
      <div v-for="(data, i) in records" :key="i">
        <PodiumStep :podium.sync="records" :winner="data" :kategori.sync="kategori" />
			</div>
    </div>
		<!-- <v-container>
			<v-layout row wrap>
			<PodiumStep :podium.sync="records" :winner="data" />
				<v-flex class="text-center" v-for="(winner, i) in records" :key="i">
					<span class="text-right mr-2" style="font-weight: bold;">
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-icon middle v-bind="attrs" v-on="on">info</v-icon>
							</template>
							<div>
								{{ `${winner.fullname} (${winner.idMember})` }}
							</div>
						</v-tooltip><br>
						total : {{ winner.jmlData }}
					</span>
					<div
						class="tampil d-flex justify-center align-end"
						:style="{
							height: `${100 * (((records.length - winner.position) + 5) / records.length)}px`,
							opacity: `${0.1 + (records.length - winner.position) / records.length}`,
						}"
					>
						{{ `Peringkat ${winner.position + 1}` }}
					</div>
				</v-flex>
			</v-layout>
		</v-container> -->
	</div>
</template>

<script>
import PodiumStep from "./PodiumStep.vue";
export default {
  name: "Podium",
  components: { PodiumStep },
	props: {
		records: {
      type: Array,
      default: () => []
		},
		kategori: {
      type: String,
      default: ''
    },
	},
	data: () => ({
		dataPodium: [],
	}),
	updated(){
		return this.records
	},
	computed: {
    igCardStyle() {
      return {
				height: `${350 * ((this.offset + 5) / this.records.length)}px`,
        opacity: `${0.1 + this.offset / this.records.length}`,
      };
    },
		stylePodium() {
			return {
				display: 'grid',
				gridAutoFlow: 'column dense',
				gap: '.4rem',
				marginTop: '.2rem',
				justifyContent: 'center',
				justifyItems: 'center',
				alignContent: 'flex-end',
				alignItems: 'flex-end',
				borderBottom: '1px solid #e5e7eb',
				height: 250,
			};	
		}
  },
	mounted(){
		// this.offset = this.records.length - this.winner.position
	},
}
</script>

<style scoped>
/* .tampil {
  background-color: #03a9f4;
  margin-left: 5px;
  margin-right: 5px;
  padding: 5px;
  color: #000;
  font-size: 13px;
  font-weight: bold;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

i.v-icon.v-icon {
  color: #03a9f4;
}  */
</style>