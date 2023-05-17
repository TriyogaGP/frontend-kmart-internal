<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Survey DNM</h1>
		<v-container>
      <v-layout row wrap>
        <v-flex sm12 xs12 md12 lg12>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Record</div>
                <v-list-item-title class="headline mb-1 text-right">{{ pageSummary.total !== 0 ? pageSummary.total : 0 }}</v-list-item-title>
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
				<v-col cols="12" md="2" class="d-flex justify-start align-center">
					<v-autocomplete
						v-model="page"
						:items="pageOptions"
						item-text="value"
						item-value="value"
						label="Page"
						outlined
						dense
						hide-details
						:disabled="DataSurveyDNM.length ? false : true"
					/>
				</v-col>
				<v-col cols="12" md="2" class="pl-2 d-flex justify-start align-center">
					<v-autocomplete
						v-model="rating"
						:items="optionsRating"
						item-text="value"
						item-value="value"
						label="Rating"
						outlined
						dense
						hide-details
					/>
				</v-col>
				<v-col cols="12" md="3" class="pl-2 d-flex align-center">
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
				<v-col cols="12" md="3" class="pl-2">
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
				<v-col cols="12" md="2" class="pl-4 d-flex justify-end align-center">
					<v-btn
						color="light-blue darken-3"
						class="white--text text--darken-2 mr-2"
						small
						dense
						depressed
						:loading="loadingButtonDataSurveyDNM"
						@click="getData(1, limit, searchData, rating)"
					>
						Cari
					</v-btn>
					<v-btn
						color="light-blue darken-3"
						class="white--text text--darken-2"
						small
						dense
						depressed
						@click="() => { tanggal = []; DataSurveyDNM = []; sortBy = []; sortDesc = []; rating = ''; searchData = ''; }"
					>
						Reset
					</v-btn>
				</v-col>
			</v-row>
			<v-btn
				color="light-blue darken-3"
				class="ma-2 white--text text--darken-2"
				small
				dense
				depressed
				@click="exportExcelSurveyDNM()"
			>
				<v-icon style="cursor: pointer;" small>fas fa-file-excel</v-icon>&nbsp;Export Excel
			</v-btn>
			<div class="px-1">
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:headers="headersDataSurveyDNM"
					:loading="isLoadingDataSurveyDNM"
					:items="DataSurveyDNM"
					:single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
					item-key="idUser"
					:sort-by="sortBy"
					:sort-desc="sortDesc"
					multi-sort
					hide-default-footer
					class="elevation-1"
					:header-props="{
						'sort-icon': 'mdi-navigation'
					}"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
					@update:sort-by="updateSort('By', $event)"
					@update:sort-desc="updateSort('Desc', $event)"
				>
					<template #[`item.number`]="{ item }">
						{{ DataSurveyDNM.indexOf(item) + 1 }}
					</template>
					<template #[`item.name`]="{ item }">
						<span v-html="item.fullname" /> 
					</template>
					<template #[`item.createdAt`]="{ item }">
						<span v-html="convertDateTime(item.createdAt)" /> 
					</template>
					<template #expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="white"> 
              <v-btn
                :value="item.idUser"
                color="#04f7f7"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
								@click="openDialog(item)"
              >
                <v-icon small>info</v-icon>	Detail
              </v-btn> 
              <v-divider />
            </td>
          </template>
				</v-data-table>
			</div>
			<v-row>
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
							label="Limit"
							outlined
							dense
							hide-details
							:disabled="DataSurveyDNM.length ? false : true"
						/>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataSurveyDNM.length ? pageSummary.page != 1 ? false : true : true"
							@click="() => { page = pageSummary.page - 1 }"
						>
							keyboard_arrow_left
						</v-icon>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataSurveyDNM.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
							@click="() => { page = pageSummary.page + 1 }"
						>
							keyboard_arrow_right
						</v-icon>
					</div>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogDetail"
			scrollable
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Detail Survey DNM</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogDetail = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
				<v-card-text class="pt-4">
					<v-row no-gutters class="py-2">
						<v-col
							cols="12"
							md="6"
						>
							<strong>Nama Lengkap</strong><br>
							{{ this.detailSurvei.fullname }}
						</v-col>
						<v-col
							cols="12"
							md="6"
						>
							<strong>No. Telepon</strong><br>
							{{ this.detailSurvei.deviceNumber }}
						</v-col>
					</v-row>
					<v-row no-gutters class="py-2">
						<v-col
							cols="12"
							md="6"
						>
							<strong>User Type</strong><br>
							{{ this.detailSurvei.consumerType }}
						</v-col>
						<v-col
							cols="12"
							md="6"
						>
							<strong>Email</strong><br>
							{{ this.detailSurvei.email ? this.detailSurvei.email : '-' }}
						</v-col>
					</v-row>
					<v-row no-gutters class="py-2">
						<v-col
							cols="12"
							md="6"
						>
							<strong>ID Member</strong><br>
							{{ this.detailSurvei.consumerType === 'MEMBER' ? this.detailSurvei.idMember : '-' }}
						</v-col>
						<v-col
							cols="12"
							md="6"
						/>
					</v-row>
					<v-divider />
					<v-row no-gutters class="py-2">
						<v-col cols="12">
							<strong>Tanggal Survei</strong><br>
							{{ convertDateTime(this.detailSurvei.createdAt) }}
						</v-col>
					</v-row>
					<v-row no-gutters class="py-2">
						<v-col cols="12">
							<strong>Rating (1 - 5)</strong><br>
							{{ this.detailSurvei.rating }}
						</v-col>
					</v-row>
					<v-row no-gutters class="py-2">
						<v-col cols="12">
							<strong>Apa yang anda sukai dari DNM Mobile App ?</strong><br>
							<div v-if="this.detailSurvei.dataQuesioner">
								<span v-if="typeof this.detailSurvei.dataQuesioner[1].jawaban === 'string'">{{ this.detailSurvei.dataQuesioner[1].jawaban }}</span>	
								<ol v-else style="padding-left: 15px !important;">
									<li v-for="(item, i) in this.detailSurvei.dataQuesioner[1].jawaban" :key="i">
										{{ item }}
									</li>
								</ol>
							</div>
						</v-col>
					</v-row>
					<v-row no-gutters class="py-2">
						<v-col cols="12">
							<strong>Apakah anda akan merekomendasikan DNM Mobile App kepada Keluarga/Teman anda ?</strong><br>
							<div v-if="this.detailSurvei.dataQuesioner">
								<span>{{ this.detailSurvei.dataQuesioner[2].jawaban }}</span>	
							</div>
						</v-col>
					</v-row>
					<v-row no-gutters class="pt-2">
						<v-col cols="12">
							<strong>Saran dan Masukan</strong><br>
							<div v-if="this.detailSurvei.dataQuesioner">
								<span>{{ this.detailSurvei.dataQuesioner[3].jawaban }}</span>	
							</div>
						</v-col>
					</v-row>
				</v-card-text>
        <v-divider />
				<v-card-actions />
      </v-card>
    </v-dialog>
		<v-dialog
			v-model="isLoadingExport"
			transition="dialog-bottom-transition"
			persistent
			width="500px"
		>
			<v-progress-linear
				class="pa-3"
				indeterminate
				color="light-blue darken-3"
			/>
			<h4 style="color: #000; text-align: center; background-color: #FFF;">Sedang proses export data, harap menunggu ...</h4>
		</v-dialog>
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
	name: 'DataSurveyDNM',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		searchData: '',
		tanggal: [],
		DataSurveyDNM: [],
    loadingButtonDataSurveyDNM: false,
    isLoadingDataSurveyDNM: false,
    isLoadingExport: false,
    DialogDetail: false,
		expanded: [],
    singleExpand: true,
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
		headersDataSurveyDNM: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "#", value: "data-table-expand", sortable: false, width: "5%" },
      { text: "Nama", value: "name", sortable: true },
      { text: "Survey Date", value: "createdAt", sortable: true },
      { text: "Rating (1 - 5)", value: "rating", sortable: true, width: "12%" },
      { text: "Feedback", value: "feedback", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		sortBy: [],
		sortDesc: [],
		kumpulSort: '',
		rating: '',
		detailSurvei: '',
		optionsRating: [
      { value: 1 },
			{ value: 2 },
			{ value: 3 },
			{ value: 4 },
			{ value: 5 },
		],

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
		page: {
			deep: true,
			handler(value) {
				this.getData(value, this.limit, this.searchData, this.rating)
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.getData(1, value, this.searchData, this.rating)
			}
		},
		sortDesc: {
			deep: true,
			handler(value) {
				this.getData(1, this.limit, this.searchData, this.rating);
			}
		},
	},
	mounted() {
		this.getData(1, this.limit, this.searchData, this.rating)
	},
	methods: {
		...mapActions(["fetchData"]),
		getData(page = 1, limit, keyword, rating) {
			this.itemsPerPage = limit
      this.page = page
      this.pageOptions = [{ value: 1 }]
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
			this.DataSurveyDNM = []
			this.loadingButtonDataSurveyDNM = true
			this.isLoadingDataSurveyDNM = true
      let payload = {
				method: "get",
				url: `kmart/getSurveyDNM?page=${page}&limit=${limit}${keyword ? `&keyword=${keyword}` : ''}${rating ? `&rating=${rating}` : ''}${this.tanggal.length ? `&dateRange=${this.convertDateToPicker2(this.tanggal[0])},${this.convertDateToPicker2(this.tanggal[1])}` : ''}&sort=${this.kumpulSort}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result
				this.DataSurveyDNM = resdata.records
				this.pageSummary = {
					page: this.DataSurveyDNM.length ? resdata.pageSummary.page : 0,
					limit: this.DataSurveyDNM.length ? resdata.pageSummary.limit : 0,
					total: this.DataSurveyDNM.length ? resdata.pageSummary.total : 0,
					totalPages: this.DataSurveyDNM.length ? resdata.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push({ value: index })
        }
				this.loadingButtonDataSurveyDNM = false
				this.isLoadingDataSurveyDNM = false
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.itemsPerPage = limit
				this.page = page
				this.pageOptions = [{ value: 1 }]
				this.pageSummary = {
					page: '',
					limit: '',
					total: '',
					totalPages: ''
				}
				this.DataSurveyDNM = []
				this.loadingButtonDataSurveyDNM = false
				this.isLoadingDataSurveyDNM = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		exportExcelSurveyDNM() {
			if(!this.DataSurveyDNM.length) return this.notifikasi("warning", 'Gagal Export Excel, Data belum tersedia !', "1")
			const totalPages = Math.ceil(this.pageSummary.total / 100)
			let link = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_PROD_API_URL : process.env.VUE_APP_DEV_API_URL
			this.isLoadingExport = true
			fetch(`${link}kmart/exportExcelSurveyDNM?${this.rating ? `&rating=${this.rating}` : ''}${this.tanggal.length ? `&dateRange=${this.convertDateToPicker2(this.tanggal[0])},${this.convertDateToPicker2(this.tanggal[1])}` : ''}&sort=${this.kumpulSort}&totalPages=${totalPages}&limit=100`, {
				method: 'GET',
				dataType: "xml",
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
				// console.log(response)
				this.isLoadingExport = false
				let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
				this.downloadBlob(blob,`Data Survey ${this.convertDateToPicker2(new Date())}.xlsx`)
				this.notifikasi("success", 'Sukses Export Excel', "1")
			})
		},
		downloadBlob(blob, name = '') {
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = name;
			document.body.appendChild(link);
			link.dispatchEvent(
				new MouseEvent('click', { 
					bubbles: true, 
					cancelable: true, 
					view: window 
				})
			);
			document.body.removeChild(link);
		},
		openDialog(item){
			this.detailSurvei = item
			this.DialogDetail = true
		},
		updateSort(kondisi, data) {
			if(kondisi == 'By'){
				this.sortBy = data
			}else if(kondisi == 'Desc'){
				this.sortDesc = data
			}
			this.kumpulSort = this.sortBy.map((val, i) => {
        return `${val}-${this.sortDesc[i] === false ? 'ASC' : 'DESC'}`
      }).join(',')
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
.v-data-table-header__icon {
  opacity: 10;
}
.v-input .v-label {
  font-size: 11pt !important;
}
.v-text-field.v-input--dense {
  font-size: 13px !important;
}
.v-calendar .input-field input {
	width: 275px !important;
}
</style>