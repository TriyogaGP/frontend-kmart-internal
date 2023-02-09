<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Customer By Area</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<h5 id="title" class="mb-2 text-center"></h5>
			<svg-map
				:map="indonesia"
				@click="ViewMap($event)"
				@focus="(e) => { e.target.style.fill = 'green' }"
				@mouseover="(e) => { e.target.style.fill = 'red'; pointLocation(e); }"
				@mouseleave="(e) => { e.target.style.fill = '' }"
				@mouseout="unpointLocation($event)"
				@mousemove="moveOnLocation($event)"
			/>
			{{ pointedLocation }}
		</v-card>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg6>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Orders</div>
                <v-list-item-title class="headline mb-1 text-right">{{ DataJumCustomer ? DataJumCustomer.orders : 0 }}</v-list-item-title>
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
						:loading="loadingButtonDataCustomer"
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
						@click="() => { tanggal = []; DataJumCustomer = ''; DataCustomer = []; }"
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
					:headers="headersDataCustomer"
					:loading="isLoadingDataCustomer"
					:items="DataCustomer"
					item-key="orderNumber"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataCustomer.indexOf(item) + 1 }}
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataCustomer.length > 0"
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
import { SvgMap } from "vue-svg-map";
import indonesia from "../../../core/plugins/indonesia.js";
export default {
	name: 'DataCustomerByArea',
  components: {
    PopUpNotifikasiVue,
		SvgMap
  },
	data: () => ({
		indonesia,
		pointedLocation: null,
		tooltipStyle: null,
		tanggal: [],
		DataCustomer: [],
		DataJumCustomer: '',
    loadingButtonDataCustomer: false,
    isLoadingDataCustomer: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		headersDataCustomer: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Provinsi", value: "province_name", sortable: false },
      { text: "Kabupaten / Kota", value: "kabupaten_name", sortable: false },
      { text: "Total Orders", value: "tot_rec", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Data Customer By Area - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	mounted() {
		document.getElementById('title').innerHTML = `DNM Mobile Sales on Indonesia`
	},
	methods: {
		...mapActions(["fetchData"]),
		getData(provinsi = '') {
			this.DataCustomer = []
			this.loadingButtonDataCustomer = true
			this.isLoadingDataCustomer = true
      let payload = {
				method: "get",
				url: `kmart/getdataKmart?kode=Customer By Area&startdate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[0]) : ''}&enddate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[1]) : ''}&Provinsi=${provinsi}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataCustomer = false
				this.isLoadingDataCustomer = false
				this.DataCustomer = res.data.result.dataCustomerSales
				this.DataJumCustomer = res.data.result.dataJumlah
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataCustomer = []
				this.loadingButtonDataCustomer = false
				this.isLoadingDataCustomer = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		ViewMap(e) {
			document.getElementById('title').innerHTML = `Provinsi : ${e.target.ariaLabel}`
			this.getData(e.target.ariaLabel)
		},
		pointLocation(e) {
			this.pointedLocation = `Provinsi : ${e.target.ariaLabel}`
		},
		unpointLocation(e) {
			this.pointedLocation = null
			this.tooltipStyle = { display: 'none' }
		},
		moveOnLocation(e) {
			this.tooltipStyle = {
				display: 'block',
				top: `${e.clientY + 10}px`,
				left: `${e.clientX - 100}px`,
			}
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
.v-pagination {
  justify-content: flex-end !important;
}
.v-input .v-label {
  font-size: 11pt !important;
}
.v-text-field.v-input--dense {
  font-size: 13px !important;
}
</style>