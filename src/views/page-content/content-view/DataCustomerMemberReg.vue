<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Member Register in Mobile Apps</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-card>
				<v-row no-gutters class="pa-2">
					<v-col cols="12" md="2" class="d-flex justify-center align-center">
						<v-autocomplete
							v-model="page"
							:items="pageOptions"
							item-text="value"
							item-value="value"
							label="Page"
							outlined
							dense
							hide-details
							:disabled="DataCustomer.length ? false : true"
						/>
					</v-col>
					<v-col cols="12" md="4" class="pl-2 d-flex justify-center align-center">
						<v-text-field
							v-model="searchData"
							append-icon="mdi-magnify"
							label="Pencarian..."
							single-line
							hide-details
							solo
							color="light-blue darken-3"
							clearable
						/>
					</v-col>
					<v-col cols="12" md="4" class="pl-2">
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
					<v-col cols="12" md="1" class="d-flex justify-center align-center">
						<v-btn
							color="light-blue darken-3"
							class="white--text text--darken-2 mr-2"
							small
							dense
							depressed
							:loading="loadingButtonDataCustomer"
							@click="getData(page, limit, searchData, tanggal)"
						>
							Cari
						</v-btn>
						<v-btn
							color="light-blue darken-3"
							class="white--text text--darken-2"
							small
							dense
							depressed
							@click="resetData()"
						>
							Reset
						</v-btn>
					</v-col>
				</v-row>
				<v-tabs
					v-model="tab"
					fixed-tabs
					background-color="light-blue darken-3"
					dark
				>
					<v-tab v-for="(val, i) in itemsTab" :key="i">
						{{ val.text }}
					</v-tab>
					<v-tabs-items v-model="tab">
						<v-tab-item v-for="(val, i) in itemsTab" :key="i">
							<v-card class="pa-3">
								<div class="px-1">
									<v-data-table
										loading-text="Sedang memuat... Harap tunggu"
										no-data-text="Tidak ada data yang tersedia"
										no-results-text="Tidak ada catatan yang cocok ditemukan"
										:headers="headers"
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
										<template #[`item.member_refcode`]="{ item }">
											<span v-html="item.member_refcode ? item.member_refcode : '-'"/>
										</template>
										<template #[`item.member_join_date`]="{ item }">
											<span v-html="convertDate2(item.member_join_date)"/>
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
												:disabled="DataCustomer.length ? false : true"
											/>
											<v-icon
												style="cursor: pointer;"
												large
												:disabled="DataCustomer.length ? pageSummary.page != 1 ? false : true : true"
												@click="() => { page = pageSummary.page - 1 }"
											>
												keyboard_arrow_left
											</v-icon>
											<v-icon
												style="cursor: pointer;"
												large
												:disabled="DataCustomer.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
												@click="() => { page = pageSummary.page + 1 }"
											>
												keyboard_arrow_right
											</v-icon>
										</div>
									</v-col>
								</v-row>
							</v-card>
						</v-tab-item>
					</v-tabs-items>
				</v-tabs>
			</v-card>
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
	name: 'DataRegInMobileApps',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		tanggal: [],
		DataCustomer: [],
    loadingButtonDataCustomer: false,
    isLoadingDataCustomer: false,
		searchData: "",
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
      { value: 1 }
    ],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "ID Member", value: "id_member", sortable: false },
      { text: "Nama", value: "fullname", sortable: false },
      { text: "Email", value: "email", sortable: false },
      { text: "No.Telp", value: "devicenumber", sortable: false },
      { text: "Member Refcode", value: "member_refcode", sortable: false },
      { text: "Member Join Date", value: "member_join_date", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		itemsTab: [
			{code: '1', text: 'New Member'},
			{code: '2', text: 'Upgrade Member'},
		],
		tab: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Data Member Register in Mobile Apps - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch: {
		tab: {
			deep: true,
			handler(value, oldvalue) {
				if(value == '' || value != oldvalue){
					this.DataCustomer = []
					this.tanggal = []
					this.getData(this.page, this.limit, this.searchData, this.tanggal);
				}
			}
		},
		page: {
			deep: true,
			handler(value) {
				this.getData(value, this.limit, this.searchData, this.tanggal);
			}
		},
    limit: {
			deep: true,
			handler(value) {
				this.getData(1, value, this.searchData, this.tanggal);
			}
		},
	},
	mounted() {
		this.getData(this.page, this.limit, this.searchData, this.tanggal);
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
    }),
		getData(page = 1, limit, keyword, tanggal) {
			this.itemsPerPage = limit
      this.page = page
			this.DataCustomer = []
			this.loadingButtonDataCustomer = true
			this.isLoadingDataCustomer = true
			this.pageOptions = [{ value: 1 }]
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
      let payload = {
				method: "get",
				url: `kmart/getMemberNew?kategori=${this.tab == 0 ? 'New' : 'Upgrade'}&page=${page}&limit=${limit}${keyword?`&keyword=${keyword}`:''}${tanggal.length?`&startdate=${this.convertDateToPicker2(tanggal[0])}`:''}${tanggal.length?`&enddate=${this.convertDateToPicker2(tanggal[1])}`:''}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result
				this.DataCustomer = resdata.data
				this.pageSummary = {
					page: this.DataCustomer.length ? resdata.pageSummary.page : 0,
					limit: this.DataCustomer.length ? resdata.pageSummary.limit : 0,
					total: this.DataCustomer.length ? resdata.pageSummary.totalRecord : 0,
					totalPages: this.DataCustomer.length ? resdata.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push({ value: index })
        }
				this.loadingButtonDataCustomer = false
				this.isLoadingDataCustomer = false
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.itemsPerPage = limit
      	this.page = page
				this.DataCustomer = []
				this.loadingButtonDataCustomer = false
				this.isLoadingDataCustomer = false
				this.pageOptions = [{ value: 1 }]
        this.pageSummary = {
          page: '',
          limit: '',
          total: '',
          totalPages: ''
        }
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		resetData(){
			this.DataCustomer = []
			this.tanggal = []
			this.searchData = []
			this.page = 1
			this.pageOptions = [{ value: 1 }]
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
			this.getData(this.page, this.limit, this.searchData, this.tanggal);
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