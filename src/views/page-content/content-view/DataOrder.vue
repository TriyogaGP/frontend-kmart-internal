<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Order</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						Invoice
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
					<v-textarea
						v-model="invoice"
						placeholder="Invoice (INV-1INV-2INV-3...)"
						outlined
						dense
						rows="4"
						label="Invoice (INV-1INV-2INV-3...)"
						color="light-blue darken-3"
						hide-details
						clearable
						no-resize
					/>
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
							:loading="loadingButtonDataOrder"
							@click="getData(1, limit, invoice)"
						>
							Cari Data
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>

			<div class="px-1">
				<v-data-table
					loading-text="Sedang memuat... Harap tunggu"
					no-data-text="Tidak ada data yang tersedia"
					no-results-text="Tidak ada catatan yang cocok ditemukan"
					:headers="headersDataOrder"
					:loading="isLoadingDataOrder"
					:items="DataOrder"
					:single-expand="singleExpand"
					:expanded.sync="expanded"
					show-expand
					item-key="orderNumber"
					hide-default-footer
					class="elevation-1"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<!-- <template #[`item.number`]="{ item }">
						{{ DataOrder.indexOf(item) + 1 }}
					</template> -->
					<template #[`item.createdAt`]="{ item }">
						<span v-html="convertDateTime(item.createdAt)" /> 
					</template>
					<template #[`item.receipt`]="{ item }">
						<span v-html="item.rcptName" /><br> 
						<span v-html="item.rcptPhno" /> 
					</template>
					<template #[`item.total`]="{ item }">
						Rp.<span v-html="currencyDotFormatNumber(item.totalPricePlain/1)" />
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
					<template #[`item.shippingType`]="{ item }">
						<v-tooltip v-if="item.shippingType == 'PICKUP'" bottom>
							<template v-slot:activator="{ on, attrs }">
                <span v-html="item.shippingType" /> <v-icon small v-bind="attrs" v-on="on">info</v-icon>
              </template>
							Code Pickup : <span v-html="item.codePickup" />
            </v-tooltip>
						<span v-else v-html="item.shippingType" />
					</template>
					<template #expanded-item="{ headers, item }">
					<td :colspan="headers.length" class="white">
						<v-btn
							:value="item.idRole"
							color="#0bd369"
							small
							dark
							dense
							class="ma-2"
							@click="lookDialog(item)"
						>
						<v-icon>edit</v-icon>	Ubah Status
						</v-btn> 
						<v-divider class="mb-2" />
						<table class="table" border="2" cellspacing="0" cellpadding="0">
							<thead>
								<tr>
									<th>Status Order</th>
									<th>Remark</th>
									<th>Tanggal</th>
								</tr>
							</thead>
							<tbody>
								<tr
								v-for="(data, index) in item.dataTrack"
								:key="index"
								>
									<td>{{ data.orderStatus }}</td>
									<td>{{ data.remarks }}</td>
									<td>{{ convertDateTime(data.createdAt) }}</td>
								</tr>
							</tbody>
						</table>
						<v-divider class="mt-2" />
					</td>
				</template>
				</v-data-table>
			</div>
			<v-row>
				<!-- <v-pagination
					v-if="DataOrder.length > 0"
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
							outlined
							dense
							hide-details
							:disabled="DataOrder.length ? false : true"
						/>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataOrder.length ? pageSummary.page != 1 ? false : true : true"
							@click="getData(pageSummary.page - 1, limit, invoice)"
						>
							keyboard_arrow_left
						</v-icon>
						<v-icon
							style="cursor: pointer;"
							large
							:disabled="DataOrder.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
							@click="getData(pageSummary.page + 1, limit, invoice)"
						>
							keyboard_arrow_right
						</v-icon>
					</div>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogUbahStatus"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Ubah Status</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="tutupDialog"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card>
					<v-card-text>
						<v-row no-gutters>
							<v-col
								cols="12"
								md="4"
								class="pt-2 d-flex align-center font-weight-bold"
							>
								ID Order
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-text-field
									v-model="input.idOrder"
									placeholder="ID Order"
									outlined
									dense
									label="ID Order"
									color="light-blue darken-3"
									hide-details
									readonly
								/>
							</v-col>
						</v-row>
						<v-row no-gutters>
							<v-col
								cols="12"
								md="4"
								class="pt-2 d-flex align-center font-weight-bold"
							>
								Status
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
								<v-autocomplete
									v-model="input.status"
									:items="statusOptions"
									item-text="value"
									item-value="value"
									placeholder="Status"
									label="Status"
									outlined
									dense
									hide-details
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
								Remarks
							</v-col>
							<v-col
								cols="12"
								md="8"
								class="pt-3"
							>
							<v-textarea
								v-model="input.remarks"
								placeholder="Remarks"
								outlined
								dense
								rows="4"
								label="Remarks"
								color="light-blue darken-3"
								hide-details
								clearable
								no-resize
							/>
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
									@click="hitUpdate()"
								>
									Ubah Status
								</v-btn>
							</v-col>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-card>
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
	name: 'DataOrder',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		invoice: '',
		input: {
			idOrder: '',
			status: '',
			remarks: '',
		},
		statusOptions: [
			{ value: "WAITING_FOR_PAYMENT" },
			{ value: "WAITING_FOR_COD_CONFIRMATION" },
			{ value: "WAITING_FOR_SELLER_CONFIRMATION" },
			{ value: "PROCESSING" },
			{ value: "IN_SHIPPING" },
			{ value: "ARRIVED_AT_DESTINATION" },
			{ value: "ARRIVED_AT_DESTINATION_PICKUP" },
			{ value: "DONE" },
			{ value: "CANCELED" },
			{ value: "PAYMENT_ERROR" },
			{ value: "ORDER_RETURN" }
		],
		expanded: [],
    singleExpand: true,
		DataOrder: [],
    loadingButtonDataOrder: false,
    isLoadingDataOrder: false,
    DialogUbahStatus: false,
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
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headersDataOrder: [
      // { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "", value: "data-table-expand", sortable: false, width: "5%" },
      { text: "Invoice", value: "orderNumber", sortable: false },
      { text: "Tanggal Order", value: "createdAt", sortable: false },
      { text: "Receiptment", value: "receipt", sortable: false },
      { text: "Total", value: "total", sortable: false },
      { text: "Data User", value: "user", sortable: false },
      { text: "Payment Status", value: "paymentStatusFinal", sortable: false },
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
		title: "Data Order - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	watch: {
		invoice: {
			deep: true,
			handler(value) {
				if(value == null){
					this.getData(1, this.limit, '')
					this.pageSummary = {
						page: '',
						limit: '',
						total: '',
						totalPages: ''
					}
					this.DataOrder = []
					this.invoice = ''
				}
			}
		},
		limit: {
			deep: true,
			handler(value) {
				this.getData(1, value, this.invoice)
			}
		}
	},
	mounted() {
		this.getData(1, this.limit, this.invoice)
	},
	methods: {
		...mapActions(["fetchData"]),
		getData(page = 1, limit, inv) {
			this.itemsPerPage = limit
			// if(this.invoice == '' || this.invoice == null) return this.notifikasi("warning", 'Invoice masih kosong !', "1") inv=${this.invoice}
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
			this.DataOrder = []
			this.loadingButtonDataOrder = true
			this.isLoadingDataOrder = true
      let payload = {
				method: "get",
				url: `kmart/getdataOrder?page=${page}&limit=${limit}${inv && `&inv=${inv}`}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataOrder = false
				this.isLoadingDataOrder = false
				let resdata = res.data.result
				this.DataOrder = resdata.data
				this.pageSummary = {
					page: resdata.pageSummary.page,
					limit: resdata.pageSummary.limit,
					total: resdata.pageSummary.total,
					totalPages: resdata.pageSummary.totalPages
				}
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataOrder = []
				this.pageSummary = {
					page: '',
					limit: '',
					total: '',
					totalPages: ''
				}
				this.loadingButtonDataOrder = false
				this.isLoadingDataOrder = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		lookDialog(item) {
			this.input.idOrder = item.idOrder
			this.input.status = item.orderStatusLatest
			this.DialogUbahStatus = true
		},
		tutupDialog() {
      this.input = {
				idOrder: '',
				status: '',
				remarks: '',
			}
      this.DialogUbahStatus = false
    },
		hitUpdate() {
			let payload = {
				method: "get",
				url: `kmart/hitUpdateStatus?idOrder=${this.input.idOrder}&status=${this.input.status}&remarks=${this.input.remarks}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DialogUbahStatus = false
				this.getData(1, this.limit, this.invoice)
				this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
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