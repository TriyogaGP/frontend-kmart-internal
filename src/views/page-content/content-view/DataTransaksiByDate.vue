<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Transaksi Detail Summary</h1>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total DP</div>
                <v-list-item-title class="headline mb-1 text-right">Rp.{{ DataJumTransaksiDetail ? currencyDotFormatNumber(DataJumTransaksiDetail.dp) : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total BV</div>
                <v-list-item-title class="headline mb-1 text-right">{{ DataJumTransaksiDetail ? DataJumTransaksiDetail.bv : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Records</div>
                <v-list-item-title class="headline mb-1 text-right">{{ DataJumTransaksiDetail ? DataJumTransaksiDetail.records : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
			</v-layout>
		</v-container>
		<v-divider />
		<v-alert
			class="mt-2"
			icon="info"
			border="left"
			color="light-blue darken-3"
			text
			dense
		>
			<span style="font-size: 12px;">
				Range Date jika kosong default h-7 dari tanggal hari ini<br>
				Filter range date maksimal 1 minggu
			</span>
		</v-alert>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-row no-gutters class="pa-2">
				<v-col cols="12" md="6" />
				<v-col cols="12" md="4" class="d-flex justify-center">
					<DatePicker
						v-model="tanggal" 
						range
						circle
						lang="id"
						position="top right"
						:date-format="{
							day: '2-digit',
							month: '2-digit',
							year: 'numeric'
						}"
						placeholder="Start Date ~ End Date"
					/>
						<!-- :show-clear-button="tanggal.length ? true : false" -->
				</v-col>
				<v-col cols="12" md="2" class="d-flex justify-center align-center">
					<v-btn
						color="light-blue darken-3"
						class="white--text text--darken-2 mr-2"
						small
						dense
						depressed
						:loading="loadingButtonDataTransaksiDetail"
						@click="getData()"
					>
						Cari
					</v-btn>
					<v-btn
						color="light-blue darken-3"
						class="white--text text--darken-2"
						small
						dense
						depressed
						@click="() => { tanggal = []; DataTransaksiDetail = []; DataJumTransaksiDetail = ''; sortBy = []; sortDesc = []; }"
					>
						Reset
					</v-btn>
				</v-col>
			</v-row>
			<div class="px-1">
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:headers="headersDataTransaksiDetail"
					:loading="isLoadingDataTransaksiDetail"
					:items="DataTransaksiDetail"
					item-key="orderNumber"
					:sort-by="sortBy"
					:sort-desc="sortDesc"
					hide-default-footer
					class="elevation-1"
					:header-props="{
						'sort-icon': 'mdi-navigation'
					}"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
					@update:sort-by="updateSort('By', $event)"
					@update:sort-desc="updateSort('Desc', $event)"
				>
					<template #[`item.number`]="{ item }">
						{{ DataTransaksiDetail.indexOf(item) + 1 }}
					</template>
					<template #[`item.date`]="{ item }">
						<span v-html="item.transaksi.date" /> 
					</template>
					<template #[`item.records`]="{ item }">
						<span v-html="item.transaksi.records" /> 
					</template>
					<template #[`item.dp`]="{ item }">
						Rp.<span v-html="currencyDotFormatNumber(item.total.dp)" /> 
					</template>
					<template #[`item.bv`]="{ item }">
						<span v-html="item.total.bv" /> 
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataTransaksiDetail.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="7"
					/>
				</v-col>
			</v-row>
		</v-card>
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
import PopUpNotifikasiVue from "../../Layout/PopUpNotifikasi.vue";
export default {
	name: 'DataTransaksiDetailSummary',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		tanggal: [],
		DataTransaksiDetail: [],
		DataJumTransaksiDetail: '',
    loadingButtonDataTransaksiDetail: false,
    isLoadingDataTransaksiDetail: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		headersDataTransaksiDetail: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Tanggal Order", value: "date"},
      { text: "Record", value: "records"},
      { text: "DP", value: "dp"},
      { text: "BV", value: "bv"},
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		sortBy: [],
		sortDesc: [],

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Data Transaksi Detail Summary - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch: {
		sortDesc: {
			deep: true,
			handler(value) {
				if(this.tanggal.length){
					this.getData();
				}
			}
		},
	},
	mounted() {
	},
	methods: {
		...mapActions(["fetchData"]),
		getData() {
			this.DataTransaksiDetail = []
			this.loadingButtonDataTransaksiDetail = true
			this.isLoadingDataTransaksiDetail = true
      let payload = {
				method: "get",
				url: `kmart/getdataKmart?kode=Transaksi Summary Detail&startdate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[0]) : ''}&enddate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[1]) : ''}&sort=${JSON.stringify({sortBy: this.sortBy, sortDesc: this.sortDesc})}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataTransaksiDetail = false
				this.isLoadingDataTransaksiDetail = false
				this.DataTransaksiDetail = res.data.result.dataTransaksi
				this.DataJumTransaksiDetail = res.data.result.dataJumlah
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataTransaksiDetail = []
				this.loadingButtonDataTransaksiDetail = false
				this.isLoadingDataTransaksiDetail = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
		updateSort(kondisi, data) {
			if(kondisi == 'By'){
				this.sortBy = data
			}else if(kondisi == 'Desc'){
				this.sortDesc = data
			}
		},
	}
}
</script>

<style>
.v-pagination {
  justify-content: flex-end !important;
}
.v-data-table-header__icon {
  opacity: 10;
}
.v-input .v-label {
  font-size: 11pt !important;
}
.v-text-field.v-input--dense {
  font-size: 13px !important;
}
</style>