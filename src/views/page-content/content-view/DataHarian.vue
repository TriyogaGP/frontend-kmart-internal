<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Harian</h1>
		<v-alert
      icon="info"
			border="left"
			color="light-blue darken-3"
      text
			dense
    >
			<span style="font-size: 12px;">Filter range date maksimal 1 minggu</span>
    </v-alert>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<div class="px-1">
				<v-row no-gutters class="pa-2">
					<v-col cols="12" md="6" class="d-flex align-center">
						<v-row no-gutters>
							<v-col cols="12" md="4" class="d-flex justify-start align-center">
								<v-btn
									color="light-blue darken-3"
									class="white--text text--darken-2"
									small
									dense
									depressed
									@click="exportexcel()"
								>
									<v-icon style="cursor: pointer;" small>fas fa-file-excel</v-icon>&nbsp;Export Excel
								</v-btn>
							</v-col>
							<v-col cols="12" md="3" class="pl-2 d-flex justify-start align-center">
								<v-autocomplete
									v-model="page"
									:items="pageOptions"
									item-text="value"
									item-value="value"
									label="Page"
									outlined
									dense
									hide-details
									:disabled="DataHarian.length ? false : true"
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
					</v-col>
					<v-col cols="12" md="2" class="d-flex justify-center align-center">
						<v-btn
							color="light-blue darken-3"
							class="white--text text--darken-2 mr-2"
							small
							dense
							depressed
							:loading="loadingButtonDataHarian"
							@click="getData(1, limit)"
						>
							Cari
						</v-btn>
						<v-btn
							color="light-blue darken-3"
							class="white--text text--darken-2"
							small
							dense
							depressed
							@click="() => {
								page = 1
								limit = 20;
								tanggal = [];
								DataHarian = [];
								pageSummary = { page: '', limit: '', total: '', totalPages: ''};
							}"
						>
							Reset
						</v-btn>
					</v-col>
				</v-row>
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:headers="headersDataHarian"
					:loading="isLoadingDataHarian"
					:items="DataHarian"
					item-key="orderNumber"
					hide-default-footer
					class="elevation-1"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ page > 1 ? ((page - 1)*limit) + DataHarian.indexOf(item) + 1 : DataHarian.indexOf(item) + 1 }}
					</template>
					<template #[`item.createdAt`]="{ item }">
						<span v-html="convertDateTime(item.createdAt)" /> 
					</template>
					<template #[`item.product`]="{ item }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on">info</v-icon>
							</template>
							<div v-for="(data, i) in item.productDetails" :key="i">
								<span v-html="data.name" /> (<span v-html="data.quantity" />)<br>
							</div>
						</v-tooltip>
					</template>
					<template #[`item.user`]="{ item }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on">info</v-icon>
							</template>
							<div>
								Data User<br>
								fullname / devicenumber : <span v-html="item.dataUser.fullname" /> / <span v-html="item.dataUser.devicenumber" /><br>
								Member / Non Member : <span v-html="item.dataUser.consumerType" /><br>
								Customer Ref Code : <span v-html="item.dataUser.customerRegRefcode" /><br><br>
								Data Member<br>
								fullname / devicenumber : <span v-html="item.dataUser.consumerType != 'MEMBER' ? item.dataMember.fullname : item.dataUser.fullname" /> / <span v-html="item.dataUser.consumerType != 'MEMBER' ? item.dataMember.devicenumber : item.dataUser.devicenumber" /><br>
							</div>
						</v-tooltip>
					</template>
				</v-data-table>
			</div>
			<v-row>
				<!-- <v-pagination
					v-if="DataHarian.length > 0"
					v-model="page"
					:length="pageCount"
					:total-visible="7"
				/> -->
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
							:disabled="DataHarian.length ? false : true"
						/>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataHarian.length ? pageSummary.page != 1 ? false : true : true"
							@click="() => { page = pageSummary.page - 1 }"
						>
							keyboard_arrow_left
						</v-icon>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataHarian.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
							@click="() => { page = pageSummary.page + 1 }"
						>
							keyboard_arrow_right
						</v-icon>
					</div>
				</v-col>
			</v-row>
		</v-card>
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
	name: 'DataHarian',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		tanggal: [],
		DataHarian: [],
    loadingButtonDataHarian: false,
    isLoadingDataHarian: false,
    isLoadingExport: false,
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
		headersDataHarian: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Invoice", value: "orderNumber", sortable: false },
      { text: "Tanggal Order", value: "createdAt", sortable: false },
      { text: "No.Resi", value: "shippingReceiptNumber", sortable: false },
      { text: "Kurir", value: "carrierName", sortable: false },
      { text: "Product", value: "product", sortable: false },
      { text: "Data User", value: "user", sortable: false },
      { text: "Order Type", value: "shippingType", sortable: false },
      { text: "Order Status", value: "orderStatusLatest", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50, 100] },
    totalItems: 0,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Data Harian - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch: {
		page: {
			deep: true,
			handler(value) {
				this.getData(value, this.limit)
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.getData(1, value)
			}
		}
	},
	mounted() {
	},
	methods: {
		...mapActions(["fetchData"]),
		getData(page = 1, limit) {
			this.itemsPerPage = limit
			this.page = page
			this.DataHarian = []
      this.pageOptions = [{ value: 1 }]
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
			this.loadingButtonDataHarian = true
			this.isLoadingDataHarian = true
      let payload = {
				method: "get",
				url: `kmart/getdataHarian?startdate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[0]) : ''}&enddate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[1]) : ''}&page=${page}&limit=${limit}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataHarian = false
				this.isLoadingDataHarian = false
				let resdata = res.data.result
				this.DataHarian = resdata.data
				this.pageSummary = {
					page: this.DataHarian.length ? resdata.pageSummary.page : 0,
					limit: this.DataHarian.length ? resdata.pageSummary.limit : 0,
					total: this.DataHarian.length ? resdata.pageSummary.total : 0,
					totalPages: this.DataHarian.length ? resdata.pageSummary.totalPages : 0
				}
				for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push({ value: index })
        }
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.itemsPerPage = limit
				this.page = page
				this.DataHarian = []
      	this.pageOptions = [{ value: 1 }]
				this.pageSummary = {
					page: '',
					limit: '',
					total: '',
					totalPages: ''
				}
				this.loadingButtonDataHarian = false
				this.isLoadingDataHarian = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		exportexcel() {
			if(!this.DataHarian.length) return this.notifikasi("warning", 'Gagal Export Excel, Data belum tersedia !', "1")
			const totalPages = Math.ceil(this.pageSummary.total / 50)
			let link = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_PROD_API_URL : process.env.VUE_APP_DEV_API_URL
			this.isLoadingExport = true
			fetch(`${link}kmart/exportExcel?startdate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[0]) : ''}&enddate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[1]) : ''}&totalPages=${totalPages}&limit=50`, {
				method: 'GET',
				dataType: "xml",
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
				// console.log(response)
				this.isLoadingExport = false
				let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
				this.downloadBlob(blob,`DataOrder_${this.convertDateToPicker2(new Date())}.xlsx`)
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