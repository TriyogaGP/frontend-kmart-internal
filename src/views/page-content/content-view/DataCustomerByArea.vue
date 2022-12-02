<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Customer By Area</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<h5 id="title" class="mb-2 text-center"></h5>
			<svg-map
				:map="indonesia"
				@click="ViewMap($event)"
				@focus="(e) => { e.target.style.fill = 'green' }"
				@mouseover="(e) => { e.target.style.fill = 'red'; pointLocation(e); }"
				@mouseleave="(e) => { e.target.style.fill = '' }"
				@mouseout="unpointLocation($event)"
				@mousemove="moveOnLocation($event)"
			/>
			{{ pointedLocation }}
		</v-card>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md6 lg6>
          <v-card class="ma-3">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Total Orders</div>
                <v-list-item-title class="headline mb-1 text-right">{{ DataJumCustomer ? DataJumCustomer.orders : 0 }}</v-list-item-title>
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
						cols="6"
					>
						<b style="font-size: 12px;">Info: - StartDate dan EndData jika kosong default h-7 dari tanggal hari ini.</b>
					</v-col>
					<v-col
						class="text-end"
						cols="6"
					>
						<v-btn
							color="light-blue darken-3"
							class="white--text text--darken-2"
							small
							dense
							depressed
							:loading="loadingButtonDataCustomer"
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
					:headers="headersDataCustomer"
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
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="12" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataCustomer.length > 0"
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
import { SvgMap } from "vue-svg-map";
import indonesia from "../../../core/plugins/indonesia.js";
export default {
	name: 'DataCustomerByArea',
  components: {
    PopUpNotifikasiVue,
		SvgMap
  },
	data: () => ({
		indonesia,
		pointedLocation: null,
		tooltipStyle: null,
		input: {
			StartDate: '',
			EndDate: ''
		},
		menu1: false,
		menu2: false,
		nowDate: new Date().toISOString().slice(0,10),
		Hariini: new Date(),
		DataCustomer: [],
		DataJumCustomer: '',
    loadingButtonDataCustomer: false,
    isLoadingDataCustomer: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
    },
		headersDataCustomer: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Provinsi", value: "province_name", sortable: false },
      { text: "Kabupaten / Kota", value: "kabupaten_name", sortable: false },
      { text: "Total Orders", value: "tot_rec", sortable: false },
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
		title: "Data Customer By Area - DNM Mobile",
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
					this.DataJumCustomer = ''
					this.DataCustomer = []
					this.input = {
						StartDate: '',
						EndDate: ''
					}
				}
			}
		}
	},
	mounted() {
		document.getElementById('title').innerHTML = `DNM Mobile Sales on Indonesia`
	},
	methods: {
		...mapActions(["fetchData"]),
		getData(provinsi = '') {
			this.DataCustomer = []
			this.loadingButtonDataCustomer = true
			this.isLoadingDataCustomer = true
      let payload = {
				method: "get",
				url: `kmart/getdataKmart?kode=Customer By Area&startdate=${this.input.StartDate}&enddate=${this.input.EndDate}&Provinsi=${provinsi}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataCustomer = false
				this.isLoadingDataCustomer = false
				this.DataCustomer = res.data.result.dataCustomerSales
				this.DataJumCustomer = res.data.result.dataJumlah
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataCustomer = []
				this.loadingButtonDataCustomer = false
				this.isLoadingDataCustomer = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		ViewMap(e) {
			document.getElementById('title').innerHTML = `Provinsi : ${e.target.ariaLabel}`
			this.getData(e.target.ariaLabel)
		},
		pointLocation(e) {
			this.pointedLocation = `Provinsi : ${e.target.ariaLabel}`
		},
		unpointLocation(e) {
			this.pointedLocation = null
			this.tooltipStyle = { display: 'none' }
		},
		moveOnLocation(e) {
			this.tooltipStyle = {
				display: 'block',
				top: `${e.clientY + 10}px`,
				left: `${e.clientX - 100}px`,
			}
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