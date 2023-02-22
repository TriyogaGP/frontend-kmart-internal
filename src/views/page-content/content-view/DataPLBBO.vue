<template>
	<div>
		<h1 class="subheading grey--text">Panel Data PLBBO</h1>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg6>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Record</div>
                <v-list-item-title class="headline mb-1 text-right">{{ pageSummary.total }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg6>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Omzet</div>
                <v-list-item-title class="headline mb-1 text-right">Rp. {{ currencyDotFormatNumber(Omzet) }}</v-list-item-title>
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
			<span style="font-size: 12px;">Filter range date maksimal 1 bulan</span>
    </v-alert>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-row no-gutters class="pa-2">
				<v-col cols="12" md="6">
					<v-row no-gutters>
						<v-col cols="12" md="9" class="d-flex justify-center align-center">
							<v-text-field
								v-model="searchData"
								append-icon="mdi-magnify"
								label="Pencarian..."
								single-line
								hide-details
								solo
								color="light-blue darken-3"
							/>
						</v-col>
						<v-col cols="12" md="3" class="pl-2 d-flex justify-center align-center">
							<v-autocomplete
									v-model="page"
									:items="pageOptions"
									item-text="value"
									item-value="value"
									label="Page"
									outlined
									dense
									hide-details
									:disabled="DataPLBBO.length ? false : true"
								/>
						</v-col>
					</v-row>
				</v-col>
				<v-col cols="12" md="4" class="d-flex justify-center">
					<DatePicker
						v-model="tanggal" 
						range
						circle
						lang="id"
						position="bottom right"
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
						:loading="loadingButtonDataPLBBO"
						@click="getData(1, limit, searchData, tanggal)"
					>
						Cari
					</v-btn>
					<v-btn
						color="light-blue darken-3"
						class="white--text text--darken-2"
						small
						dense
						depressed
						@click="() => { limit = 20; searchData = ''; tanggal = []; getData(1, limit, searchData, tanggal) }"
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
					:headers="headersDataPLBBO"
					:loading="isLoadingDataPLBBO"
					:items="DataPLBBO"
					item-key="orderNumber"
					hide-default-footer
					class="elevation-1"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ page > 1 ? ((page - 1)*limit) + DataPLBBO.indexOf(item) + 1 : DataPLBBO.indexOf(item) + 1 }}
					</template>
				</v-data-table>
			</div>
			<v-row>
				<!-- <v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataPLBBO.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="7"
					/>
				</v-col> -->
				<v-col cols="10" class="mt-2 d-flex justify-start align-center">
					<span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
				</v-col>
				<v-col cols="2" class="mt-2 text-right">
					<div class="d-flex justify-end">
						<v-autocomplete
							v-model="limit"
							:items="limitPage"
							item-text="value"
							item-value="value"
							outlined
							dense
							hide-details
							:disabled="DataPLBBO.length ? false : true"
						/>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataPLBBO.length ? pageSummary.page != 1 ? false : true : true"
							@click="() => { page = pageSummary.page - 1 }"
						>
							keyboard_arrow_left
						</v-icon>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataPLBBO.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
							@click="() => { page = pageSummary.page + 1 }"
						>
							keyboard_arrow_right
						</v-icon>
					</div>
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
	name: 'DataPLBBO',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		tanggal: [],
		searchData: '',
		DataPLBBO: [],
    loadingButtonDataPLBBO: false,
    isLoadingDataPLBBO: false,
    isLoadingDataDPBV: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 100,
    limit: 20,
		limitPage: [
			{ value: 5 },
			{ value: 10 },
			{ value: 20 },
			{ value: 50 },
			{ value: 100 },
		],
		pageOptions: [
			{ value: 1 },
		],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		Omzet: 0,
		headersDataPLBBO: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Order ID", value: "order_id", sortable: false },
      { text: "IDRecruiter", value: "nama_referensi", sortable: false },
      { text: "IDMember", value: "id_member", sortable: false },
      { text: "Nama", value: "nama_lengkap", sortable: false },
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
		title: "Data PLBBO - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch: {
		input: {
			deep: true,
			handler(value) {
				if(value.StartDate == null || value.EndDate == null){
					this.getData(1, this.limit, this.searchData, this.tanggal)
					this.DataPLBBO = []
					this.keyword = ''
					this.input = {
						StartDate: '',
						EndDate: ''
					}
					this.pageSummary = {
						page: '',
						limit: '',
						total: '',
						totalPages: ''
					}
				}
			}
		},
		page: {
			deep: true,
			handler(value) {
				this.getData(value, this.limit, this.searchData, this.tanggal)
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.getData(1, value, this.searchData, this.tanggal)
			}
		},
	},
	mounted() {
		this.getData(1, this.limit, this.searchData, this.tanggal)
	},
	methods: {
		...mapActions(["fetchData"]),
		getData(page = 1, limit, keyword, range) {
			if(keyword === null) { keyword = '' }
			this.itemsPerPage = limit
			this.page = page
			this.pageOptions = [{ value: 1 }]
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
			this.Omzet = 0
			this.DataPLBBO = []
			this.loadingButtonDataPLBBO = true
			this.isLoadingDataPLBBO = true
      let payload = {
				method: "get",
				url: `kmart/getBiodata?page=${page}&limit=${limit}${keyword !== '' ? `&keyword=${keyword}` : ''}${range.length ? `&startdate=${this.convertDateToPicker2(range[0])}` : ''}${range.length ? `&enddate=${this.convertDateToPicker2(range[1])}` : ''}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result
				this.loadingButtonDataPLBBO = false
				this.isLoadingDataPLBBO = false
				this.DataPLBBO = resdata.records
				this.DataPLBBO.map(val => {
					this.Omzet += parseInt(val.nominal) + parseInt(val.admin_fee)
				})
				this.pageSummary = {
					page: this.DataPLBBO.length ? resdata.pageSummary.page : 0,
					limit: this.DataPLBBO.length ? resdata.pageSummary.limit : 0,
					total: this.DataPLBBO.length ? resdata.pageSummary.totalRecords : 0,
					totalPages: this.DataPLBBO.length ? resdata.pageSummary.totalPages : 0
				}
				for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push({ value: index })
        }
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.Omzet = 0
				this.pageOptions = [{ value: 1 }]
				this.DataPLBBO = []
				this.pageSummary = {
					page: '',
					limit: '',
					total: '',
					totalPages: ''
				}
				this.loadingButtonDataPLBBO = false
				this.isLoadingDataPLBBO = false
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