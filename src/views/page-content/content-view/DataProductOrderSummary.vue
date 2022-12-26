<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Product Order Summary</h1>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg6>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Quantity</div>
								<v-list-item-title class="headline mb-1 text-right">{{ DataJumTransaksiDetail ? DataJumTransaksiDetail.quantity : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg6>
					<v-card class="ma-3">
						<v-list-item>
							<v-list-item-content>
								<div class="overline text-right">Total Harga</div>
								<v-list-item-title class="headline mb-1 text-right">Rp.{{ DataJumTransaksiDetail ? currencyDotFormatNumber(DataJumTransaksiDetail.total) : 0 }}</v-list-item-title>
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
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						ID Product
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
					<v-textarea
						v-model="input.idProductName"
						placeholder="ID Product (PPKG1;PPKG2;PPKG3;...)"
						outlined
						dense
						rows="4"
						label="ID Product (PPKG1;PPKG2;PPKG3;...)"
						color="light-blue darken-3"
						hide-details
						clearable
						no-resize
					/>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						Payment
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-autocomplete
							v-model="input.payment"
							:items="paymentOptions"
							placeholder="Pilih Payment"
							label="Pilih Payment"
							item-text="value"
							item-value="value"
							outlined
							hide-details
							dense
							clearable
						/>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						Shipping Type
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-autocomplete
							v-model="input.shippingType"
							:items="courierOptions"
							placeholder="Pilih Shipping Type"
							label="Pilih Shipping Type"
							item-text="value"
							item-value="value"
							multiple
							outlined
							hide-details
							dense
							clearable
						>
							<template #selection="data">
								<v-chip
									v-bind="data.attrs"
									:input-value="data.selected"
									close
									small
									outlined
									color="light-blue darken-3"
									@click="data.select"
									@click:close="remove(data.item)"
								>
									{{ data.item.value }}
								</v-chip>
							</template>
						</v-autocomplete>
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
							:loading="loadingButtonDataProductOrderSummary"
							@click="getData()"
						>
							Get Data
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>

			<div class="px-1">
				<!-- <v-icon style="cursor: pointer;" large @click="exportexcel()">fas fa-file-excel</v-icon> -->
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:options.sync="query"
					:headers="headersDataProductOrderSummary"
					:loading="isLoadingDataProductOrderSummary"
					:items="DataProductOrderSummary"
					item-key="orderNumber"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataProductOrderSummary.indexOf(item) + 1 }}
					</template>
					<template #[`item.totalPrice`]="{ item }">
						Rp.<span v-html="currencyDotFormatNumber(item.totalPrice)" />
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataProductOrderSummary.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="7"
					/>
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
	name: 'DataProductOrderSummary',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		input: {
			StartDate: '',
			EndDate: '',
			idProductName: '',
			shippingType: '',
			payment: '',
		},
		DataJumTransaksiDetail: {
			quantity: 0,
			total: 0
		},
		menu1: false,
		menu2: false,
		nowDate: new Date().toISOString().slice(0,10),
		Hariini: new Date(),
		DataProductOrderSummary: [],
    loadingButtonDataProductOrderSummary: false,
    isLoadingDataProductOrderSummary: false,
    isLoadingExport: false,
		paymentOptions: [
			{ value: "PAID" },
			{ value: "UNPAID" },
			{ value: "ALL" },
		],
		paymentOptions: [
			{ value: "PAID" },
			{ value: "UNPAID" },
			{ value: "ALL" },
		],
		courierOptions: [
			{ value: "DELIVERY_COD" },
			{ value: "DELIVERY_NON_COD" },
			{ value: "DELIVERY_NON_COD_SAMEDAY" },
			{ value: "PICKUP" },
		],
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
    },
		headersDataProductOrderSummary: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "ID Product", value: "idProductSync", sortable: false },
      { text: "Product Name", value: "productName", sortable: false },
      { text: "Quantity", value: "quantity", sortable: false },
      { text: "Total", value: "totalPrice", sortable: false },
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
		title: "Data Product Order Summary - DNM Mobile",
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
				if(value.StartDate == null || value.EndDate == null || value.idProductName == null || value.shippingType == null || value.payment == null){
					this.DataProductOrderSummary = []
					this.DataJumTransaksiDetail = {
						quantity: 0,
						total: 0
					}
					this.input = {
						StartDate: '',
						EndDate: '',
						idProductName: '',
						shippingType: '',
						payment: '',
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
			var url = ''
			if(this.input.StartDate && this.input.EndDate){ url += `startdate=${this.input.StartDate}&enddate=${this.input.EndDate}&` }
			if(this.input.idProductName){ url += `idProductName=${this.input.idProductName}&` }
			if(this.input.payment){ url += `payment=${this.input.payment}&` }
			if(this.input.shippingType){
				let shipping = this.input.shippingType.join(',')
				url += `shippingType=${shipping}&`
			}
			// console.log(url);
			this.DataProductOrderSummary = []
			this.loadingButtonDataProductOrderSummary = true
			this.isLoadingDataProductOrderSummary = true
      let payload = {
				method: "get",
				url: `kmart/getdataProductOrderSummary?${url}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataProductOrderSummary = false
				this.isLoadingDataProductOrderSummary = false
				let resdata = res.data.result
				this.DataProductOrderSummary = resdata.listData
				this.DataJumTransaksiDetail = {
					quantity: resdata.totalQty,
					total: resdata.grandTotal
				}
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataProductOrderSummary = []
				this.loadingButtonDataProductOrderSummary = false
				this.isLoadingDataProductOrderSummary = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		exportexcel() {
			if(!this.DataProductOrderSummary.length) return this.notifikasi("warning", 'Gagal Export Excel, Data belum tersedia !', "1")
			let link = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_PROD_API_URL : process.env.VUE_APP_DEV_API_URL
			this.isLoadingExport = true
			fetch(`${link}kmart/exportExcel?startdate=${this.input.StartDate}&enddate=${this.input.EndDate}`, {
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
		remove(item) {
      this.input.shippingType.splice(this.input.shippingType.indexOf(item.value), 1);
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