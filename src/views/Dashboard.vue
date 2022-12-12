<template>
  <div>
    <h1 class="subheading grey--text">Dashboard</h1>
    <v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg6>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Grafik DP (TRANSACTION)</div>
                <Bar
                  :chart-options="options"
                  :chart-data="record"
                />
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg6>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Grafik BV (TRANSACTION)</div>
                <Bar
                  :chart-options="options"
                  :chart-data="record2"
                />
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
			</v-layout>
		</v-container>
    <v-dialog
      v-model="dialogNotifikasi"
      transition="dialog-bottom-transition"
      persistent
      width="500px"
    >
      <PopUpNotifikasiVue
        :notifikasi-kode.sync="notifikasiKode"
        :notifikasi-text.sync="notifikasiText"
        :notifikasi-button.sync="notifikasiButton"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "./Layout/PopUpNotifikasi.vue";
import { Bar } from 'vue-chartjs/legacy'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'Dashboard',
  components: { PopUpNotifikasiVue, Bar },
  data: () => ({
    record: {
      labels: [],
      datasets: []
    },
    record2: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    },
    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  metaInfo: {
		title: "Dashboard - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
  mounted() {
    this.getData()
    // this.renderChart(this.record, this.options)
	},
	methods: {
		...mapActions(["fetchData"]),
    getData() {
      let payload = {
				method: "get",
				url: `kmart/getDashboardTransaksi`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result
				let dp = [], bv = []
        resdata.map(val => {
          this.record.labels.push(val.bulan)
          dp.push(val.dp)
        })
        this.record.datasets.push(
          {
            label: "DP",
            backgroundColor: 'green',
            data: dp
          },
        )
        resdata.map(val => {
          this.record2.labels.push(val.bulan)
          bv.push(val.bv)
        })
        this.record2.datasets.push(
          {
            label: "BV",
            backgroundColor: 'red',
            data: bv
          },
        )
			})
			.catch((err) => {
				this.notifikasi("error", err, "1")
			});
		},
    notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  }
}
</script>

<style>
</style>