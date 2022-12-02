<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Non Cod Stack</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center"
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
						placeholder="Invoice (INV-1, INV-2, INV-3, ...)"
						outlined
						dense
						rows="4"
						label="Invoice (INV-1, INV-2, INV-3, ...)"
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
							:loading="loadingButtonDataNonCod"
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
					:headers="headersDataNonCod"
					:loading="isLoadingDataNonCod"
					:items="DataNonCod"
					item-key="idOrder"
					hide-default-footer
					class="elevation-1"
					:page.sync="page"
					:items-per-page="itemsPerPage"
					@page-count="pageCount = $event"
				>
					<template #[`item.number`]="{ item }">
						{{ DataNonCod.indexOf(item) + 1 }}
					</template>
					<template #[`item.check`]="{ item }">
						<v-checkbox
							v-model="selectRecord"
							:value="item.idOrder"
						></v-checkbox>
					</template>
					<template #[`item.orderNumber`]="{ item }">
						<input type="hidden" id="testing-code-on" :value="item.orderNumber">
					 <span ref="myinputon" v-html="item.orderNumber" /> <v-icon @click.stop.prevent="copyOrderNumber(item.orderNumber)" small>copy_all</v-icon>
					</template>
					<template #[`item.awb`]="{ item }">
					<input type="hidden" id="testing-code-awb" :value="item.awb">
					 <span ref="myinputawb" v-html="item.awb" /> <v-icon @click.stop.prevent="copyAWB(item.awb)" small>copy_all</v-icon>
					</template>
					<template #[`item.tracking`]="{ item }">
						<v-btn
							color="light-blue darken-3"
							class="white--text text--darken-2"
							:value="item.idOrder"
							x-small
							dense
							depressed
							@click="openDialog(item)"
						>
							Tracking Order
						</v-btn>
					</template>
					<template #[`item.status_akhir`]="{ item }">
						<!-- {{ tracking.filter(val => val.idOrder == item.idOrder)[0].status_code }} -->
						<span v-if="
							tracking.filter(val => val.idOrder == item.idOrder)[0].status_code == '200' ||
							tracking.filter(val => val.idOrder == item.idOrder)[0].status_code == 200 ||
							tracking.filter(val => val.idOrder == item.idOrder)[0].status_code == 'Successful Delivery'
						">{{ item.ekspedisi == 'sicepat' ? 'Paket sudah diterima' : tracking.filter(val => val.idOrder == item.idOrder)[0].status }}</span>
						<span v-else>Sedang Diproses</span>
					</template>
					<template #[`item.proses`]="{ item }">
						<v-btn
							v-if="
							tracking.filter(val => val.idOrder == item.idOrder)[0].status_code == '200' ||
							tracking.filter(val => val.idOrder == item.idOrder)[0].status_code == 200 ||
							tracking.filter(val => val.idOrder == item.idOrder)[0].status_code == 'Successful Delivery'"
							color="light-blue darken-3"
							class="white--text text--darken-2"
							:value="item.idOrder"
							small
							dense
							depressed
							@click="hitUpdate(item)"
						>
							hit!
						</v-btn>
					</template>
				</v-data-table>
			</div>
			<v-row>
				<v-col cols="6" class="mt-3 pa-2 px-5">
					<v-btn
						color="light-blue darken-3"
						class="white--text text--darken-2 mr-2"
						small
						dense
						depressed
						:disabled="selectRecord.length ? false : true"
						:loading="loadingButtonProsesHit"
						@click="hitUpdateChecked()"
					>
						Hit Checked ({{ selectRecord.length }})
					</v-btn>
					<v-btn
						color="light-blue darken-3"
						class="white--text text--darken-2"
						small
						dense
						depressed
						:disabled="selectRecord.length ? false : true"
						@click="() => { selectRecord = [] }"
					>
						Clear Checked
					</v-btn>
				</v-col>
				<v-col cols="6" class="mt-2 pa-2 px-5">
					<v-pagination
						v-if="DataNonCod.length > 0"
						v-model="page"
						:length="pageCount"
						:total-visible="25"
					/>
				</v-col>
			</v-row>
		</v-card>
		<v-dialog
      v-model="DialogTracking"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Data Tracking Order</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="DialogTracking = false"
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
							<v-timeline
								:reverse="false"
								dense
							>
								<v-timeline-item
									v-for="(data, index) in DataTracking"
									:key="index"
								>
									<v-card class="elevation-2">
										<v-card-title class="text-h12">
											{{ data.status_code }}
										</v-card-title>
										<v-card-text>
											{{ data.status }}
										  <h4>{{ convertDateTime(data.track_date) }}</h4>
										</v-card-text>
									</v-card>
								</v-timeline-item>
							</v-timeline>
            </v-card-text>
          </div>
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
	name: 'DataNonCodStack',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		invoice: '',
		tracking: [{
			idOrder: '',
			status_code: '',
			status: ''
		}],
		selectRecord: [],
		DataNonCod: [],
		DataTracking: [],
    loadingButtonDataNonCod: false,
    loadingButtonProsesHit: false,
    isLoadingDataNonCod: false,
    DialogTracking: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
    },
		headersDataNonCod: [
      { text: "", value: "check", sortable: false, width: "7%" },
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Invoice", value: "orderNumber", sortable: false },
      { text: "No.Resi", value: "awb", sortable: false },
      { text: "Kurir", value: "ekspedisi", sortable: false },
      { text: "Tracking", value: "tracking", sortable: false },
      { text: "Status Akhir", value: "status_akhir", sortable: false },
      { text: "Proses", value: "proses", sortable: false },
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
		title: "Data Non COD Stack - DNM Mobile",
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
					this.selectRecord = []
					this.DataNonCod = []
					this.invoice = ''
				}
			}
		}
	},
	mounted() {
		const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
		let date = new Date('12-11-2022 19:07'),
		mnth = bulan[date.getMonth()],
		day = ("0" + date.getDate()).slice(-2);
		const valueConvertDate = [day, mnth, date.getFullYear()].join(" ");
		console.log(date.getDate());
	},
	methods: {
		...mapActions(["fetchData"]),
		getData() {
			if(this.invoice == '' || this.invoice == null) return this.notifikasi("warning", 'Invoice masih kosong !', "1")
			this.DataNonCod = []
			this.loadingButtonDataNonCod = true
			this.isLoadingDataNonCod = true
      let payload = {
				method: "get",
				url: `kmart/getdataNonCod?inv=${this.invoice}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataNonCod = false
				this.isLoadingDataNonCod = false
				this.DataNonCod = res.data.result
				let status_code = null
				let status = null
				this.tracking = []
				this.DataNonCod.map(val => {
					val.history
					.map(value => {
						if(value.status_code == 200 || value.status_code == '200' || value.status_code == 'Successful Delivery') {
							status_code = value.status_code
							status = value.status
						}else{
							status_code = ''
							status = ''
						}
					})
					let emit = {
						idOrder: val.idOrder,
						status_code: status_code,
						status: status
					}
					this.tracking.push(emit)
				})
			})
			.catch((err) => {
				this.DataNonCod = []
				this.loadingButtonDataNonCod = false
				this.isLoadingDataNonCod = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		openDialog(item) {
			this.DataTracking = item.history ? item.history : []
			this.DialogTracking = true
		},
		hitUpdate(item) {
			console.log(item);
			let payload = {
				method: "get",
				url: `kmart/hitUpdateStatus?idOrder=${item.idOrder}&status=ARRIVED_AT_DESTINATION&remarks=hit manual`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		async hitUpdateChecked() {
			let kirim = await Promise.all(this.selectRecord.map(async val => {
				let response = []
				let payload = {
					method: "get",
					url: `kmart/hitUpdateStatus?idOrder=${val}&status=ARRIVED_AT_DESTINATION&remarks=hit manual`,
					authToken: localStorage.getItem('user_token')
				};
				try {
					await this.fetchData(payload)
					response.push({
						idOrder: val,
						status: 'success'
					})
				} catch (error) {
					response.push({
						idOrder: val,
						status: 'error'
					})
				}
				return response[0]
			}))
			let success = kirim.filter(val => val.status == 'success').length 
			let error = kirim.filter(val => val.status == 'error').length
			// console.log(kirim, success);
			if(success > error) {
				this.selectRecord = []
				this.notifikasi("success", "SUKSES", "1")
			}else{
				this.selectRecord = []
				this.notifikasi("error", "GAGAL", "1")
			}
		},
		copyOrderNumber(orderNumber) {
      let testingCodeToCopy = document.querySelector('#testing-code-on')
			let code = document.getElementById('testing-code-on').value = orderNumber
			testingCodeToCopy.setAttribute('type', 'text') 
			testingCodeToCopy.select()

			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'berhasil' : 'gagal';
				alert('Order Number '+ code + ' ' + msg +' disalin');
			} catch (err) {
				alert('Oops, tidak bisa disalin');
			}
			
			testingCodeToCopy.setAttribute('type', 'hidden')
			window.getSelection().removeAllRanges()
    },
		copyAWB(AWB) {
      let testingCodeToCopy = document.querySelector('#testing-code-awb')
			let code = document.getElementById('testing-code-awb').value = AWB
			testingCodeToCopy.setAttribute('type', 'text') 
			testingCodeToCopy.select()

			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'berhasil' : 'gagal';
				alert('No. Resi '+ code + ' ' + msg +' disalin');
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
.scrollText{
  max-height: 450px !important;
  overflow-y: auto !important;
}
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