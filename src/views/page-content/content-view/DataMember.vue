<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Member</h1>
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
				<v-col cols="12" md="6" class="d-flex justify-center align-center">
					<v-row no-gutters>
						<v-col cols="12" md="9" class="d-flex justify-center align-center">
							<v-text-field
								v-model="keyword"
								placeholder="Nama / kode referal"
								label="Nama / kode referal"
								color="light-blue darken-3"
								single-line
								hide-details
								solo
								clearable
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
									:disabled="DataMember.length ? false : true"
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
						:loading="loadingButtonDataMember"
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
						@click="() => { tanggal = []; getData(1, limit); keyword = ''; pageSummary = { page: '', limit: '', totalRecord: '', totalPages: '' }; DataMember = []; }"
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
					:headers="headersDataMember"
					:loading="isLoadingDataMember"
					:items="DataMember"
					item-key="idUser"
					hide-default-footer
					class="elevation-1"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ page > 1 ? ((page - 1)*limit) + DataMember.indexOf(item) + 1 : DataMember.indexOf(item) + 1 }}
					</template>
					<template #[`item.idMember`]="{ item }">
						<input type="hidden" id="testing-code-on" :value="item.idMember">
					 	<span ref="myinputon" v-html="item.idMember ? item.idMember : '-'" /> <v-icon v-if="item.idMember" @click.stop.prevent="copyText(item.idMember, 'ID Member')" small>copy_all</v-icon>
					</template>
					<template #[`item.Refcode`]="{ item }">
						<input type="hidden" id="testing-code-on" :value="item.Refcode">
					 	<span ref="myinputon" v-html="item.Refcode ? item.Refcode : '-'" /> <v-icon v-if="item.Refcode" @click.stop.prevent="copyText(item.Refcode, 'Kode Referal')" small>copy_all</v-icon>
					</template>
					<template #[`item.identitas`]="{ item }">
						<strong>{{ item.fullname }}</strong><br>
						{{ item.email }}<br>
						{{ item.deviceNumber }}<br>
						{{ item.gender }}
					</template>
					<template #[`item.TopicUser`]="{ item }">
						<span v-html="item.TopicUser ? item.TopicUser : '-'"></span>
					</template>
					<template #[`item.productFirst`]="{ item }">
						<v-tooltip v-if="item.productFirst" bottom>
							<template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on">info</v-icon>
              </template>
							<div>
								Invoice: {{ item.productFirst ? item.productFirst.orderNumber : null }}<br>
								Tanggal Order: <span v-html="item.productFirst ? convertDateTime(item.productFirst.createdAt) : null" /> <br>
								Product: <br>
								<span v-html="item.productFirst.product" />
							</div>
            </v-tooltip>
						<span v-else>-</span>
					</template>
					<template #[`item.productLast`]="{ item }">
						<v-tooltip v-if="item.productLast" bottom>
							<template v-slot:activator="{ on, attrs }">
                <v-icon small v-bind="attrs" v-on="on">info</v-icon>
              </template>
							<div>
								Invoice: {{ item.productLast ? item.productLast.orderNumber : null }}<br>
								Tanggal Order: <span v-html="item.productLast ? convertDateTime(item.productLast.createdAt) : null" /> <br>
								Product: <br>
								<span v-html="item.productLast.product" />
							</div>
            </v-tooltip>
						<span v-else>-</span>
					</template>
				</v-data-table>
			</div>
			<v-row>
				<!-- <v-pagination
					v-if="DataMember.length > 0"
					v-model="page"
					:length="pageCount"
					:total-visible="7"
				/> -->
				<v-col cols="10" class="mt-2 d-flex justify-start align-center">
					<span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.totalRecord ? pageSummary.totalRecord : 0 }})</span>
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
							:disabled="DataMember.length ? false : true"
						/>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataMember.length ? pageSummary.page != 1 ? false : true : true"
							@click="getData(pageSummary.page - 1, limit)"
						>
							keyboard_arrow_left
						</v-icon>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataMember.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
							@click="getData(pageSummary.page + 1, limit)"
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
	name: 'DataMember',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		tanggal: [],
		keyword: '',
		DataMember: [],
    loadingButtonDataMember: false,
    isLoadingDataMember: false,
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
			totalRecord: '',
			totalPages: ''
		},
		headersDataMember: [
			{ text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "ID Member", value: "idMember", sortable: false },
      { text: "Identitas", value: "identitas", sortable: false },
      { text: "Kode Referal", value: "Refcode", sortable: false },
      { text: "Topic", value: "TopicUser", sortable: false },
      { text: "First Product", value: "productFirst", sortable: false },
      { text: "Last Product", value: "productLast", sortable: false },
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
		title: "Data Member - DNM Mobile",
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
		},
	},
	mounted() {
		this.getData(1, this.limit)
	},
	methods: {
		...mapActions(["fetchData"]),
		getData(last = 1, limit) {
			var url = ''
			if(this.tanggal.length){ 
				let gabung = `${this.tanggal[0]},${this.tanggal[1]}`
				url += `&dateRange=${gabung}`
			}
			if(this.keyword){ url += `&keyword=${this.keyword}` }
			this.itemsPerPage = limit
			this.page = last
			this.pageOptions = [{ value: 1 }]
			this.pageSummary = {
				page: '',
				limit: '',
				totalRecord: '',
				totalPages: ''
			}
			this.DataMember = []
			this.loadingButtonDataMember = true
			this.isLoadingDataMember = true
      let payload = {
				method: "get",
				url: `kmart/getdataConsumer?isConsumer=1&limit=${limit}&last=${last}${url}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataMember = false
				this.isLoadingDataMember = false
				let resdata = res.data.result
				this.DataMember = resdata.records
				this.pageSummary = {
					page: this.DataMember.length ? resdata.pageSummary.page : 0,
					limit: this.DataMember.length ? resdata.pageSummary.limit : 0,
					totalRecord: this.DataMember.length ? resdata.pageSummary.totalRecord : 0,
					totalPages: this.DataMember.length ? resdata.pageSummary.totalPages : 0
				}
				for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push({ value: index })
        }
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.pageOptions = [{ value: 1 }]
				this.DataMember = []
				this.pageSummary = {
					page: '',
					limit: '',
					total: '',
					totalPages: ''
				}
				this.loadingButtonDataMember = false
				this.isLoadingDataMember = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		copyText(text, nomeklatur) {
      let testingCodeToCopy = document.querySelector('#testing-code-on')
			let code = document.getElementById('testing-code-on').value = text
			testingCodeToCopy.setAttribute('type', 'text') 
			testingCodeToCopy.select()

			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'berhasil' : 'gagal';
				alert(nomeklatur + ' ' + code + ' ' + msg +' disalin');
			} catch (err) {
				alert('Oops, tidak bisa disalin');
			}
			
			testingCodeToCopy.setAttribute('type', 'hidden')
			window.getSelection().removeAllRanges()
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