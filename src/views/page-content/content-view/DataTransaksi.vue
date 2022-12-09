<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Transaksi Detail</h1>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg6>
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
        <v-flex sm6 xs12 md6 lg6>
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
			</v-layout>
		</v-container>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						Start Date
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-menu
							v-model="menu1"
							:close-on-content-click="false"
							:nudge-right="40"
							transition="scale-transition"
							offset-y
							min-width="290px"
							outlined
						>
							<template #activator="{ on, attrs }">
								<v-text-field
									v-model="input.StartDate"
									:value="input.StartDate"
									placeholder="Start Date (YYYY-MM-DD)"
									v-bind="attrs"
									v-on="on"
									outlined
									dense
									label="Start Date (YYYY-MM-DD)"
									color="light-blue darken-3"
									hide-details
									clearable
								/>
							</template>
							<v-date-picker v-model="input.StartDate" :max="GetEndDate" @input="menu1 = false" />
						</v-menu>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						End Date
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-menu
							v-model="menu2"
							:close-on-content-click="false"
							:nudge-right="40"
							transition="scale-transition"
							offset-y
							min-width="290px"
							outlined
						>
							<template #activator="{ on, attrs }">
								<v-text-field
									v-model="input.EndDate"
									:value="input.EndDate"
									placeholder="End Date (YYYY-MM-DD)"
									v-bind="attrs"
									v-on="on"
									outlined
									dense
									label="End Date (YYYY-MM-DD)"
									color="light-blue darken-3"
									hide-details
									clearable
								/>
							</template>
							<v-date-picker v-model="input.EndDate" :min="GetMinDate" :max="nowDate" @input="menu2 = false" />
						</v-menu>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-row 
					no-gutters
					class="mt-1 mr-3"
				>
					<v-col
						cols="6"
					>
						<b style="font-size: 12px;">Info: - StartDate dan EndData jika kosong default h-7 dari tanggal hari ini.</b>
					</v-col>
					<v-col
						class="text-end"
						cols="6"
					>
						<v-btn
							color="light-blue darken-3"
							class="white--text text--darken-2"
							small
							dense
							depressed
							:loading="loadingButtonDataTransaksiDetail"
							@click="getData()"
						>
							Get Data
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>

			<div class="px-1">
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:options.sync="query"
					:headers="headersDataTransaksiDetail"
					:loading="isLoadingDataTransaksiDetail"
					:items="DataTransaksiDetail"
					item-key="orderNumber"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataTransaksiDetail.indexOf(item) + 1 }}
					</template>
					<template #[`item.date`]="{ item }">
						<span v-html="item.transaksi.date" /> 
					</template>
					<template #[`item.period`]="{ item }">
						<span v-html="item.transaksi.period" /> 
					</template>
					<template #[`item.idec`]="{ item }">
						<span v-html="item.transaksi.order_no" /> 
					</template>
					<template #[`item.idmember`]="{ item }">
						<span v-html="item.distributor.code" /> 
					</template>
					<template #[`item.nama`]="{ item }">
						<span v-html="item.distributor.name" /> 
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
	name: 'DataTransaksiDetail',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		input: {
			StartDate: '',
			EndDate: ''
		},
		menu1: false,
		menu2: false,
		nowDate: new Date().toISOString().slice(0,10),
		Hariini: new Date(),
		DataTransaksiDetail: [],
		DataJumTransaksiDetail: '',
    loadingButtonDataTransaksiDetail: false,
    isLoadingDataTransaksiDetail: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
    },
		headersDataTransaksiDetail: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Tanggal Order", value: "date", sortable: false },
      { text: "Period", value: "period", sortable: false },
      { text: "Order IDEC", value: "idec", sortable: false },
      { text: "Invoice", value: "orderNumber", sortable: false },
      { text: "IDMember", value: "idmember", sortable: false },
      { text: "Nama Member", value: "nama", sortable: false },
      { text: "DP", value: "dp", sortable: false },
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
		title: "Data Transaksi Detail - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	computed: {
    GetMinDate() {
      var awal = this.input.StartDate
      return awal
    },
    GetEndDate() {
      var endDate = new Date(this.Hariini.getFullYear(), this.Hariini.getMonth() + 1, null);
      return endDate.toISOString().slice(0,null)
    },
  },
	watch: {
		input: {
			deep: true,
			handler(value) {
				if(value.StartDate == null || value.EndDate == null){
					this.DataJumTransaksiDetail = ''
					this.DataTransaksiDetail = []
					this.input = {
						StartDate: '',
						EndDate: ''
					}
				}
			}
		}
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
				url: `kmart/getdataKmart?kode=Transaksi Detail&startdate=${this.input.StartDate}&enddate=${this.input.EndDate}`,
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