<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Customer Sales By Area</h1>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total DP</div>
                <v-list-item-title class="headline mb-1 text-right">Rp.{{ DataJumCustomerSales ? currencyDotFormatNumber(DataJumCustomerSales.dp) : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total CP</div>
                <v-list-item-title class="headline mb-1 text-right">Rp.{{ DataJumCustomerSales ? currencyDotFormatNumber(DataJumCustomerSales.cp) : 0 }}</v-list-item-title>
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
                <v-list-item-title class="headline mb-1 text-right">{{ DataJumCustomerSales ? DataJumCustomerSales.bv : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Orders</div>
                <v-list-item-title class="headline mb-1 text-right">{{ DataJumCustomerSales ? DataJumCustomerSales.orders : 0 }}</v-list-item-title>
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
						:loading="loadingButtonDataCustomerSales"
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
						@click="() => { tanggal = []; DataJumCustomerSales = ''; DataCustomerSales = []; }"
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
					:headers="headersDataCustomerSales"
					:loading="isLoadingDataCustomerSales"
					:items="DataCustomerSales"
					item-key="orderNumber"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataCustomerSales.indexOf(item) + 1 }}
					</template>
					<template #[`item.dp`]="{ item }">
						Rp.<span v-html="currencyDotFormatNumber(item.totDP)" /> 
					</template>
					<template #[`item.cp`]="{ item }">
						Rp.<span v-html="currencyDotFormatNumber(item.totCP)" /> 
					</template>
					<template #[`item.bv`]="{ item }">
						<span v-html="item.totBV" /> 
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataCustomerSales.length > 0"
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
	name: 'DataCustomerSalesByArea',
  components: {
    PopUpNotifikasiVue,
  },
	data: () => ({
		tanggal: [],
		DataCustomerSales: [],
		DataJumCustomerSales: '',
    loadingButtonDataCustomerSales: false,
    isLoadingDataCustomerSales: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		headersDataCustomerSales: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Provinsi", value: "province_name", sortable: false },
      { text: "Jumlah Order", value: "tot_rec", sortable: false },
      { text: "DP", value: "dp", sortable: false },
      { text: "CP", value: "cp", sortable: false },
      { text: "BV", value: "bv", sortable: false },
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
		title: "Data Customer Sales By Area - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	mounted() {
	},
	methods: {
		...mapActions(["fetchData"]),
		getData() {
			this.DataCustomerSales = []
			this.loadingButtonDataCustomerSales = true
			this.isLoadingDataCustomerSales = true
      let payload = {
				method: "get",
				url: `kmart/getdataKmart?kode=Customer Sales By Area&startdate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[0]) : ''}&enddate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[1]) : ''}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataCustomerSales = false
				this.isLoadingDataCustomerSales = false
				this.DataCustomerSales = res.data.result.dataCustomerSales
				this.DataJumCustomerSales = res.data.result.dataJumlah
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataCustomerSales = []
				this.loadingButtonDataCustomerSales = false
				this.isLoadingDataCustomerSales = false
				this.notifikasi("error", err.response.data.message, "1")
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