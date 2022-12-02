<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Harian</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center"
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
						class="pt-2 d-flex align-center"
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
						class="text-end"
						cols="12"
					>
						<v-btn
							color="light-blue darken-3"
							class="white--text text--darken-2"
							small
							dense
							depressed
							:loading="loadingButtonDataHarian"
							@click="getData()"
						>
							Get Data
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>

			<div class="px-1">
				<v-icon style="cursor: pointer;" large @click="exportexcel()">fas fa-file-excel</v-icon>
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:options.sync="query"
					:headers="headersDataHarian"
					:loading="isLoadingDataHarian"
					:items="DataHarian"
					item-key="orderNumber"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataHarian.indexOf(item) + 1 }}
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
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataHarian.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="25"
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
	name: 'DataHarian',
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
		DataHarian: [],
    loadingButtonDataHarian: false,
    isLoadingDataHarian: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
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
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
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
					this.DataHarian = []
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
			this.DataHarian = []
			this.loadingButtonDataHarian = true
			this.isLoadingDataHarian = true
      let payload = {
				method: "get",
				url: `kmart/getdataHarian?startdate=${this.input.StartDate}&enddate=${this.input.EndDate}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataHarian = false
				this.isLoadingDataHarian = false
				let resdata = res.data.result
				this.DataHarian = resdata.data
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataHarian = []
				this.loadingButtonDataHarian = false
				this.isLoadingDataHarian = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		exportexcel() {
			if(!this.DataHarian.length) return this.notifikasi("warning", 'Gagal Export Excel, Data belum tersedia !', "1")
			let link = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_PROD_API_URL : process.env.VUE_APP_DEV_API_URL
			fetch(`${link}kmart/exportExcel?startdate=${this.input.StartDate}&enddate=${this.input.EndDate}`, {
				method: 'GET',
				dataType: "xml",
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
				// console.log(response)
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