<template>
	<div>
		<h1 class="subheading grey--text">Panel Data User Install Dan Acquisition</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						User Install
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-text-field
							v-model="userinstall"
							placeholder="Upload"
							outlined
							dense
							style="display: none"
						/>
						<input 
							ref="UserInstall"
							:key="componentKey"
							type="file"
							accept="text/csv"
							style="display: none"
							@change="uploadFile($event, 'install')"
						>
						<v-btn depressed small color="light-blue darken-3" dark @click="$refs.UserInstall.click()">
							<v-icon small left>upload</v-icon> Upload User Install
						</v-btn>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						User Acquisition
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-text-field
							v-model="useracquisition"
							placeholder="Upload"
							outlined
							dense
							style="display: none"
						/>
						<input 
							ref="UserAcquisition"
							:key="componentKey"
							type="file"
							accept="text/csv"
							style="display: none"
							@change="uploadFile($event, 'acquisition')"
						>
						<v-btn depressed small color="light-blue darken-3" dark @click="$refs.UserAcquisition.click()">
							<v-icon small left>upload</v-icon> Upload User Acquisition
						</v-btn>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider />
			<v-alert
				class="mt-2"
				icon="info"
				border="left"
				color="light-blue darken-3"
				text
				dense
			>
				<span style="font-size: 12px;">Range Date jika kosong default h-7 dari tanggal hari ini</span>
			</v-alert>
			<v-card>
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
							:loading="loadingButtonDataUserGoogle"
							@click="getData()"
						>
							Cari
						</v-btn>
						<v-btn
							color="light-blue darken-3"
							class="white--text text--darken-2"
							small
							dense
							depressed
							@click="() => { tanggal = []; DataUserGoogle = []; }"
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
										:headers="(val.code == 1) ? headersInstall : headersAcquisition"
										:loading="isLoadingDataUserGoogle"
										:items="DataUserGoogle"
										item-key="orderNumber"
										hide-default-footer
										class="elevation-1"
										:page.sync="page"
										:items-per-page="itemsPerPage"
										@page-count="pageCount = $event"
									>
										<template #[`item.number`]="{ item }">
											{{ DataUserGoogle.indexOf(item) + 1 }}
										</template>
										<template #[`item.user`]="{ item }">
											<div v-if="(val.code == 1)">
												All: {{ item.install.All }}<br>
												Indonesia: {{ item.install.Indonesia }}<br>
												Malaysia: {{ item.install.Malaysia }}<br>
												Saudi Arabia: {{ item.install.Saudi_Arabia }}<br>
												United States: {{ item.install.United_States }}
											</div>
											<div v-if="(val.code == 2)">
												All: {{ item.acquisition.All }}<br>
												Indonesia: {{ item.acquisition.Indonesia }}<br>
												Malaysia: {{ item.acquisition.Malaysia }}<br>
											</div>
										</template>
									</v-data-table>
								</div>
								<v-row>
									<v-col cols="12" class="mt-2 pa-2 px-5">
										<v-pagination
											v-if="DataUserGoogle.length > 0"
											v-model="page"
											:length="pageCount"
											:total-visible="7"
										/>
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
	name: 'DataUserInstallAcquisition',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		tanggal: [],
		userinstall: '',
		useracquisition: '',
		componentKey: 0,
		DataUserGoogle: [],
    loadingButtonDataUserGoogle: false,
    isLoadingDataUserGoogle: false,
		page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		headersInstall: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Tanggal", value: "date", sortable: false },
      { text: "Install", value: "user", sortable: false },
      { text: "Notes", value: "notes", sortable: false },
    ],
		headersAcquisition: [
      { text: "No.", value: "number", sortable: false, width: "7%" },
      { text: "Tanggal", value: "date", sortable: false },
      { text: "Acquisition", value: "user", sortable: false },
      { text: "Notes", value: "notes", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		itemsTab: [
			{code: '1', text: 'User Install'},
			{code: '2', text: 'User Acquisition'},
		],
		tab: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Data User Install & Acquisition - DNM Mobile",
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
					this.DataUserGoogle = []
					this.tanggal = []
				}
			}
		}
	},
	mounted() {
	},
	methods: {
		...mapActions({
      fetchData: "fetchData",
      uploadCSV: "upload/uploadCSV",
    }),
		getData() {
			this.DataUserGoogle = []
			this.loadingButtonDataUserGoogle = true
			this.isLoadingDataUserGoogle = true
      let payload = {
				method: "get",
				url: `kmart/getUserGoogle?params=${this.tab == 0 ? 'install' : 'acquisition'}&startdate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[0]) : ''}&enddate=${this.tanggal.length ? this.convertDateToPicker2(this.tanggal[1]) : ''}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataUserGoogle = false
				this.isLoadingDataUserGoogle = false
				this.DataUserGoogle = res.data.result
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.DataUserGoogle = []
				this.loadingButtonDataUserGoogle = false
				this.isLoadingDataUserGoogle = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		async uploadFile(e, bagian) {
			let upload
			if(bagian == 'install'){
				let file = await e.target.files[0];
				upload = await this.uploadLampiran(file, bagian);
			}else if(bagian == 'acquisition'){
				let file = await e.target.files[0];
				upload = await this.uploadLampiran(file, bagian);
			}
			if(upload.data.status == 200){
				this.notifikasi("success", `Berhasil Upload Data User ${bagian == 'install' ? 'Install' : 'Acquisition'}`, "1")
			}else{
				this.notifikasi("error", 'Gagal proses data', "1")
			}
    },
		async uploadLampiran(dataUpload, bagian) {
			if(dataUpload){
				const bodyData = {
					bagian: bagian,
					files: dataUpload,
				};
				try {
					let response = await this.uploadCSV(bodyData);
					if(bagian == 'install'){
						this.$refs.UserInstall.value = null
					}else if(bagian == 'acquisition'){
						this.$refs.UserAcquisition.value = null
					}
					return response
				} catch (err) {
					this.notifikasi("error", err.response.data.message, "1")
				}
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