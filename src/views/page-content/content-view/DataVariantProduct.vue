<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Variant Product</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						Pilihan
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
					<v-radio-group
						v-model="pilihan"
						mandatory
					>
						<v-radio
							label="Package Product"
							value="1"
						></v-radio>
						<v-radio
							label="Invoice"
							value="2"
						></v-radio>
					</v-radio-group>
					</v-col>
				</v-row>
				<v-row v-if="pilihan == 1" no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						Package Product
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
					<v-text-field
						v-model="productPackage"
						placeholder="Package Product"
						outlined
						dense
						label="Package Product"
						color="light-blue darken-3"
						hide-details
						clearable
					/>
					</v-col>
				</v-row>
				<v-row v-if="pilihan == 2" no-gutters>
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
							:loading="loadingButtonDataVariantProduct"
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
					:headers="pilihan == 1 ?headersDataVariantProductPP : headersDataVariantProductINV"
					:loading="isLoadingDataVariantProduct"
					:items="DataVariantProduct"
					item-key="orderNumber"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataVariantProduct.indexOf(item) + 1 }}
					</template>
					<template #[`item.images`]="{ item }">
						<img class="gambar" :src="item.images" width="150"/>
					</template>
					<template #[`item.OrderDetails`]="{ item }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
                Detail <v-icon small v-bind="attrs" v-on="on">info</v-icon>
              </template>
							<h6 style="font-weight: bold;">Detail Order</h6>
							<div
								class="mb-2"
								v-for="(data, index) in item.OrderDetails"
								:key="index"
							>
								<strong>Package :</strong> {{ data.productName }}
								<ol>
									<li
										v-for="(data1) in data.packages"
										:key="data1.productName"
									>
										{{ data1.productName }} ({{ data1.quantity }})
										<ul>
											<li
												v-for="(data2) in data1.selectedVariants"
												:key="data2.id"
											>
												{{ data2.valueString }} ({{ data2.quantity }})
											</li>
										</ul>
									</li>
								</ol>
							</div>			
            </v-tooltip>
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataVariantProduct.length > 0"
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
	name: 'DataVariantProduct',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		pilihan: 1,
		invoice: '',
		productPackage: '',
		DataVariantProduct: [],
    loadingButtonDataVariantProduct: false,
    isLoadingDataVariantProduct: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
    },
		headersDataVariantProductPP: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Product Package", value: "idPackageCombinationSync", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Attribute", value: "groupInputType", sortable: false },
      { text: "Image", value: "images", sortable: false },
    ],
		headersDataVariantProductINV: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Invoice", value: "orderNumber", sortable: false },
      { text: "Product Detail", value: "OrderDetails", sortable: false },
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
		title: "Data Variant Product - DNM Mobile",
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
					this.DataVariantProduct = []
					this.invoice = ''
				}
			}
		}
	},
	mounted() {
	},
	methods: {
		...mapActions(["fetchData"]),
		getData() {
			let url = this.pilihan == 1 ? `kondisi=${this.pilihan}&productPackage=${this.productPackage}` : `kondisi=${this.pilihan}&inv=${this.invoice}`
			this.DataVariantProduct = []
			this.loadingButtonDataVariantProduct = true
			this.isLoadingDataVariantProduct = true
      let payload = {
				method: "get",
				url: `kmart/getdataVariantProduct?${url}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataVariantProduct = false
				this.isLoadingDataVariantProduct = false
				this.DataVariantProduct = res.data.result
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataVariantProduct = []
				this.loadingButtonDataVariantProduct = false
				this.isLoadingDataVariantProduct = false
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
.gambar {
	border-style: solid !important;
	border-radius: 10px !important;
	padding: 2px !important;
}
</style>