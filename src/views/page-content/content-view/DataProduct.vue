<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Product</h1>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total DP Price</div>
                <v-list-item-title class="headline mb-1 text-right">Rp.{{ DataJumProduct ? currencyDotFormatNumber(DataJumProduct.price.dp) : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total CP Price</div>
                <v-list-item-title class="headline mb-1 text-right">Rp.{{ DataJumProduct ? currencyDotFormatNumber(DataJumProduct.price.cp) : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total BV Price</div>
                <v-list-item-title class="headline mb-1 text-right">{{ DataJumProduct ? DataJumProduct.price.bv : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total DP Sub Total</div>
                <v-list-item-title class="headline mb-1 text-right">Rp.{{ DataJumProduct ? currencyDotFormatNumber(DataJumProduct.subtotal.dp) : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total CP Sub Total</div>
                <v-list-item-title class="headline mb-1 text-right">Rp.{{ DataJumProduct ? currencyDotFormatNumber(DataJumProduct.subtotal.cp) : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total BV Sub Total</div>
                <v-list-item-title class="headline mb-1 text-right">{{ DataJumProduct ? DataJumProduct.subtotal.bv : 0 }}</v-list-item-title>
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
				<v-col cols="12" md="6" class="d-flex justify-center align-center">
					<v-autocomplete
						v-model="kategori"
						:items="kategoriOptions"
						item-text="value"
						item-value="value"
						placeholder="Kategori Product"
						label="Kategori Product"
						outlined
						dense
						hide-details
						clearable
					/>
				</v-col>
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
						:loading="loadingButtonDataProduct"
						@click="getData(kategori)"
					>
						Cari
					</v-btn>
					<v-btn
						color="light-blue darken-3"
						class="white--text text--darken-2"
						small
						dense
						depressed
						@click="() => { tanggal = []; DataJumProduct = ''; DataProduct = []; kategori = ''; }"
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
					:headers="headersDataProduct"
					:loading="isLoadingDataProduct"
					:items="DataProduct"
					item-key="orderNumber"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataProduct.indexOf(item) + 1 }}
					</template>
					<template #[`item.date`]="{ item }">
						<span v-html="item.transaksi.date" /> 
					</template>
					<template #[`item.period`]="{ item }">
						<span v-html="item.transaksi.period" /> 
					</template>
					<template #[`item.code`]="{ item }">
						<span v-html="item.product.code" /> 
					</template>
					<template #[`item.nama`]="{ item }">
						<span v-html="item.product.desc" /> 
					</template>
					<template #[`item.kategori`]="{ item }">
						<span v-html="item.product.category" /> 
					</template>
					<template #[`item.dpPrice`]="{ item }">
						Rp.<span v-html="currencyDotFormatNumber(item.price.dp)" /> 
					</template>
					<template #[`item.cpPrice`]="{ item }">
						Rp.<span v-html="currencyDotFormatNumber(item.price.cp)" /> 
					</template>
					<template #[`item.bvPrice`]="{ item }">
						<span v-html="item.price.bv" /> 
					</template>
					<template #[`item.dpsubtotal`]="{ item }">
						Rp.<span v-html="currencyDotFormatNumber(item.sub_total.dp)" /> 
					</template>
					<template #[`item.cpsubtotal`]="{ item }">
						Rp.<span v-html="currencyDotFormatNumber(item.sub_total.cp)" /> 
					</template>
					<template #[`item.bvsubtotal`]="{ item }">
						<span v-html="item.sub_total.bv" /> 
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataProduct.length > 0"
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
	name: 'DataProduct',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		tanggal: [],
		kategori: '',
		kategoriOptions: [
			{ value: 'Ayuverda Series' },
			{ value: 'Beauty Care' },
			{ value: 'Bodywear' },
			{ value: 'Dietary & Herbal Supplements' },
			{ value: 'Health Accessories' },
			{ value: 'Health Care' },
			{ value: 'Health Drinks' },
			{ value: 'Household' },
			{ value: 'Other' },
			{ value: 'Paket Promo & Bundling' },
			{ value: 'Personal Care' },
		],
		DataProduct: [],
		DataJumProduct: '',
    loadingButtonDataProduct: false,
    isLoadingDataProduct: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		headersDataProduct: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Tanggal Order", value: "date", sortable: false },
      { text: "Period", value: "period", sortable: false },
      { text: "Code Product", value: "code", sortable: false },
      { text: "Nama Product", value: "nama", sortable: false },
      { text: "Kategori", value: "kategori", sortable: false },
      { text: "Qty", value: "qty", sortable: false },
      { text: "DP Price", value: "dpPrice", sortable: false },
      { text: "CP Price", value: "cpPrice", sortable: false },
      { text: "BV Price", value: "bvPrice", sortable: false },
      { text: "DP SubTotal", value: "dpsubtotal", sortable: false },
      { text: "CP SubTotal", value: "cpsubtotal", sortable: false },
      { text: "BV SubTotal", value: "bvsubtotal", sortable: false },
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
		title: "Data Product - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	mounted() {
	},
	methods: {
		...mapActions(["fetchData"]),
		getData(kategori = '') {
			this.DataProduct = []
			this.loadingButtonDataProduct = true
			this.isLoadingDataProduct = true
      let payload = {
				method: "get",
				url: `kmart/getdataKmart?kode=Transaksi Detail By Product&startdate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[0]) : ''}&enddate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[1]) : ''}&kategoriProduct=${kategori}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataProduct = false
				this.isLoadingDataProduct = false
				this.DataProduct = res.data.result.dataTransaksiProduct
				this.DataJumProduct = res.data.result.dataJumlah
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataProduct = []
				this.loadingButtonDataProduct = false
				this.isLoadingDataProduct = false
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