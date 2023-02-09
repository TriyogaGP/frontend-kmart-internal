<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Transaksi Detail</h1>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg6>
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
        <v-flex sm6 xs12 md6 lg6>
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
        <v-flex sm6 xs12 md3 lg3>
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
        <v-flex sm6 xs12 md3 lg3>
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
						@click="() => { getData(); getData2(); }"
					>
						Cari
					</v-btn>
					<v-btn
						color="light-blue darken-3"
						class="white--text text--darken-2"
						small
						dense
						depressed
						@click="() => { tanggal = []; Member = { Transaksi: [], dp: 0, bv: 0 }; NonMember = { Transaksi: [], dp: 0, bv: 0 }; DataTransaksiDetail = []; DataJumTransaksiDetail = ''; }"
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
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataTransaksiDetail.indexOf(item) + 1 }}
					</template>
					<template #[`item.date`]="{ item }">
						<span v-html="item.transaksi.date" /> 
					</template>
					<template #[`item.period`]="{ item }">
						<span v-html="item.transaksi.period" /> 
					</template>
					<template #[`item.idec`]="{ item }">
						<span v-html="item.transaksi.order_no" /> 
					</template>
					<template #[`item.idmember`]="{ item }">
						<span v-html="item.distributor.code" /> 
					</template>
					<template #[`item.nama`]="{ item }">
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
		DataJumTransaksiDetail: '',
    loadingButtonDataTransaksiDetail: false,
    isLoadingDataTransaksiDetail: false,
    isLoadingDataDPBV: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		headersDataTransaksiDetail: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Tanggal Order", value: "date", sortable: false },
      { text: "Period", value: "period", sortable: false },
      { text: "Order IDEC", value: "idec", sortable: false },
      { text: "Invoice", value: "orderNumber", sortable: false },
      { text: "IDMember", value: "idmember", sortable: false },
      { text: "Nama Member", value: "nama", sortable: false },
      { text: "DP", value: "dp", sortable: false },
      { text: "BV", value: "bv", sortable: false },
    ],
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
				url: `kmart/getdataKmart?kode=Transaksi Detail&startdate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[0]) : ''}&enddate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[1]) : ''}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataTransaksiDetail = false
				this.isLoadingDataTransaksiDetail = false
				this.DataTransaksiDetail = res.data.result.dataTransaksi
				this.DataJumTransaksiDetail = res.data.result.dataJumlah
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