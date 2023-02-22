<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Transaksi Detail</h1>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md4 lg4>
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
        <v-flex sm6 xs12 md4 lg4>
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
        <v-flex sm6 xs12 md4 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Records</div>
                <v-list-item-title class="headline mb-1 text-right">{{ DataTransaksiDetail ? DataTransaksiDetail.length : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3 @click="(Member.Transaksi.length && NonMember.Transaksi.length) ? openDialog('Member') : ''" style="cursor: pointer;">
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Member DP</div>
                <v-list-item-title class="headline mb-1 text-right">
									<div v-if="isLoadingDataDPBV"><v-progress-circular indeterminate size="20" /></div>
									<div v-else>Rp.{{ Member.dp ? currencyDotFormatNumber(Member.dp) : 0 }}</div>
								</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Member BV</div>
                <v-list-item-title class="headline mb-1 text-right">
									<div v-if="isLoadingDataDPBV"><v-progress-circular indeterminate size="20" /></div>
									<div v-else>{{ Member.bv ? Member.bv : 0 }}</div>
								</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3 @click="(Member.Transaksi.length && NonMember.Transaksi.length) ? openDialog('Customer') : ''" style="cursor: pointer;">
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Non Member DP</div>
                <v-list-item-title class="headline mb-1 text-right">
									<div v-if="isLoadingDataDPBV"><v-progress-circular indeterminate size="20" /></div>
									<div v-else>Rp.{{ NonMember.dp ? currencyDotFormatNumber(NonMember.dp) : 0 }}</div>
								</v-list-item-title>
								<div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Non Member BV</div>
                <v-list-item-title class="headline mb-1 text-right">
									<div v-if="isLoadingDataDPBV"><v-progress-circular indeterminate size="20" /></div>
									<div v-else>{{ NonMember.bv ? NonMember.bv : 0 }}</div>
								</v-list-item-title>
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
						@click="() => { getData(); }"
					>
						Cari
					</v-btn>
					<v-btn
						color="light-blue darken-3"
						class="white--text text--darken-2"
						small
						dense
						depressed
						@click="() => { tanggal = []; Member = { Transaksi: [], dp: 0, bv: 0 }; NonMember = { Transaksi: [], dp: 0, bv: 0 }; DataTransaksiDetail = []; DataJumTransaksiDetail = ''; sortBy = []; sortDesc = [] }"
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
					multi-sort
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
					<!-- <template #[`item.number`]="{ item }">
						{{ DataTransaksiDetail.indexOf(item) + 1 }}
					</template> -->
					<template #[`item.date`]="{ item }">
						<span v-html="item.transaksi.date" /> 
					</template>
					<template #[`item.period`]="{ item }">
						<span v-html="item.transaksi.period" /> 
					</template>
					<template #[`item.order_no`]="{ item }">
						<span v-html="item.transaksi.order_no" /> 
					</template>
					<template #[`item.reff_no`]="{ item }">
						<span v-html="item.transaksi.reff_no" /> 
					</template>
					<template #[`item.code`]="{ item }">
						<span v-html="item.distributor.code" /> 
					</template>
					<template #[`item.name`]="{ item }">
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
      v-model="DialogOrder"
      max-width="1000px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Data Orders Detail {{ kondisi === 'Member' ? 'Member' : 'Customer' }}</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { DialogOrder = false; }"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card>
          <div class="scrollText">
            <div class="px-5">
              <v-divider />
            </div>
            <v-card-text>
							<v-row no-gutters>
								<v-col cols="12" md="10" class="d-flex justify-start align-center">
									<v-btn
										color="light-blue darken-3"
										class="white--text text--darken-2"
										small
										dense
										depressed
										@click="exportExcelTransaksiFix(kondisi)"
									>
										<v-icon style="cursor: pointer;" small>fas fa-file-excel</v-icon>&nbsp;Export Excel
									</v-btn>
								</v-col>
								<v-col cols="12" md="2" class="pl-2 d-flex justify-center align-center">
									<v-autocomplete
											v-model="page1"
											:items="pageOptions"
											item-text="value"
											item-value="value"
											label="Page"
											outlined
											dense
											hide-details
											:disabled="DataTransaksiDetailOrder.length ? false : true"
										/>
								</v-col>
							</v-row>
							<v-data-table
								loading-text="Sedang memuat... Harap tunggu"
								no-data-text="Tidak ada data yang tersedia"
								no-results-text="Tidak ada catatan yang cocok ditemukan"
								:headers="headersTransaksiDetail"
								:loading="isLoadingTransaksiDetail"
								:items="DataTransaksiDetailOrder"
								item-key="orderNumber"
								:sort-by="sortBy2"
								:sort-desc="sortDesc2"
								multi-sort
								hide-default-footer
								class="elevation-1"
								:header-props="{
									'sort-icon': 'mdi-navigation'
								}"
								:items-per-page="itemsPerPage1"
								@page-count="pageCount1 = $event"
								@update:sort-by="updateSort2('By', $event)"
								@update:sort-desc="updateSort2('Desc', $event)"
							>
								<!-- <template #[`item.number`]="{ item }">
									{{ page1 > 1 ? ((page1 - 1)*limit) + DataTransaksiDetailOrder.indexOf(item) + 1 : DataTransaksiDetailOrder.indexOf(item) + 1 }}
								</template> -->
								<template #[`item.date`]="{ item }">
									<span v-html="item.date" /> 
								</template>
								<template #[`item.dp`]="{ item }">
									Rp.<span v-html="currencyDotFormatNumber(item.dp)" /> 
								</template>
								<template #[`item.bv`]="{ item }">
									<span v-html="item.bv" /> 
								</template>
							</v-data-table>
            </v-card-text>
          </div>
					<v-divider />
					<v-card-actions>
						<v-row 
              no-gutters
              class="mr-3"
            >
              <v-col cols="10" class="d-flex justify-start align-center">
                <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
              </v-col>
              <v-col cols="2" class="text-right">
                <div class="d-flex justify-end">
                  <v-autocomplete
                    v-model="limit"
                    :items="limitPage"
                    item-text="value"
                    item-value="value"
                    outlined
                    dense
                    hide-details
                    :disabled="DataTransaksiDetailOrder.length ? false : true"
                  />
                  <v-icon
                    style="cursor: pointer;"
                    large
                    :disabled="DataTransaksiDetailOrder.length ? pageSummary.page != 1 ? false : true : true"
                    @click="() => { page1 = pageSummary.page - 1 }"
                  >
                    keyboard_arrow_left
                  </v-icon>
                  <v-icon
                    style="cursor: pointer;"
                    large
                    :disabled="DataTransaksiDetailOrder.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                    @click="() => { page1 = pageSummary.page + 1 }"
                  >
                    keyboard_arrow_right
                  </v-icon>
                </div>
              </v-col>
            </v-row>
					</v-card-actions>
        </v-card>
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
	name: 'DataTransaksiDetail',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		tanggal: [],
		DataTransaksiDetail: [],
		DataTransaksiDetailOrder: [],
		kondisi: '',
		DataJumTransaksiDetail: '',
    DialogOrder: false,
    loadingButtonDataTransaksiDetail: false,
    isLoadingDataTransaksiDetail: false,
    isLoadingTransaksiDetail: false,
    isLoadingDataDPBV: false,
    isLoadingExport: false,
		page1: 1,
    pageCount1: 0,
    itemsPerPage1: 100,
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
		data_transaksi: [],
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		headersDataTransaksiDetail: [
      // { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Tanggal Order", value: "date" },
      { text: "Period", value: "period", sortable: false },
      { text: "Order IDEC", value: "order_no", sortable: false },
      { text: "Invoice", value: "reff_no" },
      { text: "IDMember", value: "code" },
      { text: "Nama Member", value: "name" },
      { text: "DP", value: "dp" },
      { text: "BV", value: "bv" },
    ],
		headersTransaksiDetail: [
			// { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Invoice", value: "orderNumber", width: "10%" },
      { text: "Tanggal Order", value: "date", width: "10%" },
      { text: "Nama", value: "fullname", width: "15%" },
      { text: "No. telp", value: "devicenumber", sortable: false, width: "10%" },
      { text: "Email", value: "email", sortable: false, width: "10%" },
			{ text: "DP", value: "dp", width: "8%" },
			{ text: "BV", value: "bv", width: "8%" },
    ],
		sortBy: [],
		sortDesc: [],
		sortBy2: [],
		sortDesc2: [],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		Member: {
			Transaksi: [],
			dp: 0,
			bv: 0,
		},
		NonMember: {
			Transaksi: [],
			dp: 0,
			bv: 0,
		},

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
	watch: {
		sortDesc: {
			deep: true,
			handler(value) {
				if(this.tanggal.length){
					this.getData();
				}
			}
		},
		sortDesc2: {
			deep: true,
			handler(value) {
				if(value.length > 1){
					this.postData(1, this.limit, this.data_transaksi)
				}
			}
		},
		page1: {
			deep: true,
			handler(value) {
				this.postData(value, this.limit, this.data_transaksi)
			}
		},
    limit: {
			deep: true,
			handler(value) {
				this.postData(1, value, this.data_transaksi)
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
				url: `kmart/getdataKmart?kode=Transaksi Detail&startdate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[0]) : ''}&enddate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[1]) : ''}&sort=${JSON.stringify({sortBy: this.sortBy, sortDesc: this.sortDesc})}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataTransaksiDetail = false
				this.isLoadingDataTransaksiDetail = false
				this.DataTransaksiDetail = res.data.result.dataTransaksi
				this.DataJumTransaksiDetail = res.data.result.dataJumlah
				this.getData2()
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataTransaksiDetail = []
				this.loadingButtonDataTransaksiDetail = false
				this.isLoadingDataTransaksiDetail = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getData2() {
			this.isLoadingDataDPBV = true
			this.Member = {
				Transaksi: [],
				dp: 0,
				bv: 0,
			}
			this.NonMember = {
				Transaksi: [],
				dp: 0,
				bv: 0,
			}
      let payload = {
				method: "get",
				url: `kmart/getTransaksiDetail?startdate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[0]) : ''}&enddate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[1]) : ''}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.isLoadingDataDPBV = false
				let member_resdata = res.data.result.Member
				let nonmember_resdata = res.data.result.NonMember
				this.Member = {
					Transaksi: member_resdata.dataTransaksi,
					dp: member_resdata.dataJumlah.dp,
					bv: member_resdata.dataJumlah.bv,
				}
				this.NonMember = {
					Transaksi: nonmember_resdata.dataTransaksi,
					dp: nonmember_resdata.dataJumlah.dp,
					bv: nonmember_resdata.dataJumlah.bv,
				}
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.isLoadingDataDPBV = false
				this.Member = {
					Transaksi: [],
					dp: 0,
					bv: 0,
				}
				this.NonMember = {
					Transaksi: [],
					dp: 0,
					bv: 0,
				}
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		openDialog(kondisi) {
			if(!this.Member.Transaksi.length && !this.NonMember.Transaksi.length) return this.notifikasi("warning", 'Proses masih berjalan !', "1")
			this.kondisi = kondisi
			this.data_transaksi = []
			if(kondisi === 'Member') {
				this.Member.Transaksi.map(val => {
					this.data_transaksi.push({
						id_user: val.idUser,
						orderNumber: val.orderNumber,
            date: val.transaksi.date,
            dp: val.total.dp,
            bv: val.total.bv
					})
				})
			}else if(kondisi === 'Customer') {
				this.NonMember.Transaksi.map(val => {
					this.data_transaksi.push({
						id_user: val.idUser,
						orderNumber: val.orderNumber,
            date: val.transaksi.date,
            dp: val.total.dp,
            bv: val.total.bv
					})
				})
			}
			this.sortBy2 = []
			this.sortDesc2 = []
			this.DialogOrder = true
			this.postData(1, this.limit, this.data_transaksi)
		},
		postData(page = 1, limit, bodyData) {
			this.itemsPerPage1 = limit
			this.page1 = page
			this.isLoadingTransaksiDetail = true
			this.pageOptions = [{ value: 1 }]
			this.DataTransaksiDetailOrder = []
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
			let payload = {
				method: "put",
				url: `kmart/detailTransaksiOrder?page=${page}&limit=${limit}&sort=${JSON.stringify({sortBy: this.sortBy2, sortDesc: this.sortDesc2})}`,
        body: { data_transaksi: bodyData },
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.isLoadingTransaksiDetail = false
				this.DataTransaksiDetailOrder = res.data.result.records
        let pageSummary = res.data.result.pageSummary
        this.pageSummary = {
          page: this.DataTransaksiDetailOrder.length ? pageSummary.page : 0,
          limit: this.DataTransaksiDetailOrder.length ? pageSummary.limit : 0,
          total: this.DataTransaksiDetailOrder.length ? pageSummary.total : 0,
          totalPages: this.DataTransaksiDetailOrder.length ? pageSummary.totalPages : 0
        }
				for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push({ value: index })
        }
			})
			.catch((err) => {
				this.itemsPerPage1 = limit
				this.page1 = page
				this.isLoadingTransaksiDetail = false
				this.DialogOrder = false
				this.pageOptions = [{ value: 1 }]
				this.DataTransaksiDetailOrder = []
				this.pageSummary = {
					page: '',
					limit: '',
					total: '',
					totalPages: ''
				}
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		exportExcelTransaksiFix(kondisi) {
			if(!this.DataTransaksiDetailOrder.length) return this.notifikasi("warning", 'Gagal Export Excel, Data belum tersedia !', "1")
			const totalPages = Math.ceil(this.pageSummary.total / 50)
			let link = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_PROD_API_URL : process.env.VUE_APP_DEV_API_URL
			this.isLoadingExport = true
			fetch(`${link}kmart/exportExcelTransaksiFix?totalPages=${totalPages}&limit=50&sort=${JSON.stringify({sortBy: this.sortBy2, sortDesc: this.sortDesc2})}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ data_transaksi: this.data_transaksi }),
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
				// console.log(response)
				this.isLoadingExport = false
				let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
				this.downloadBlob(blob,`Data Transaksi ${kondisi} (${this.convertDateToPicker3(this.tanggal[0])} sampai ${this.convertDateToPicker3(this.tanggal[1])}).xlsx`)
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
		updateSort(kondisi, data) {
			if(kondisi == 'By'){
				this.sortBy = data
			}else if(kondisi == 'Desc'){
				this.sortDesc = data
			}
		},
		updateSort2(kondisi, data) {
			if(kondisi == 'By'){
				this.sortBy2 = data
			}else if(kondisi == 'Desc'){
				this.sortDesc2 = data
			}
		},
	}
}
</script>

<style>
.scrollText{
  max-height: 350px !important;
  overflow-y: auto !important;
}
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