<template>
	<div>
		<h1 class="subheading grey--text">Panel Blast Notifikasi</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						User ID
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-row no-gutters>
							<v-col
								class="text-start"
							>
								<v-autocomplete
									v-model="inputData.idUser"
									:items="UserIDOptions"
									item-text="nama"
									item-value="idUser"
									placeholder="User ID"
									label="User ID"
									multiple
									outlined
									dense
									hide-details
									clearable
									@change="addData($event)"
								>
									<template v-slot:prepend>
										<v-icon
											class="mr-1`"
											color="light-blue darken-3"
											tabindex="-1"
											@click="selectAllData(UserIDOptions)"
										>
											check
										</v-icon>
										<v-icon
											class="mr-1`"
											color="light-blue darken-3"
											tabindex="-1"
											@click="() => inputData.idUser = []"
										>
											clear
										</v-icon>
									</template>
									<template #selection="data">
										<v-chip
											v-bind="data.attrs"
											:input-value="data.selected"
											close
											small
											outlined
											class="ma-1"
											color="light-blue darken-3"
											@click="data.select"
											@click:close="remove(data.item)"
										>
											{{ data.item.nama }}
										</v-chip>
									</template>
								</v-autocomplete>
							</v-col>
							<v-col
								class="text-end mt-1"
								cols="3"
							>
								<v-btn
									color="light-blue darken-3"
									class="white--text text--darken-2"
									small
									dense
									depressed
									@click="() => { DialogSetupConsumer = true }"
								>
									Update User
								</v-btn>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						Judul Notifikasi
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-text-field
							v-model="inputData.judul"
							placeholder="Judul Notifikasi"
							outlined
							dense
							label="Judul Notifikasi"
							color="light-blue darken-3"
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
						Isi Notifikasi
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-text-field
							v-model="inputData.isi"
							placeholder="Isi Notifikasi"
							outlined
							dense
							label="Isi Notifikasi"
							color="light-blue darken-3"
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
						Image URL
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-text-field
							v-model="inputData.image"
							placeholder="Image URL"
							outlined
							dense
							label="Image URL"
							color="light-blue darken-3"
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
						Screen Route
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-autocomplete
							height="30"
							v-model="inputData.screen"
							:items="screenOptions"
							item-text="value"
							item-value="value"
							placeholder="Screen Route"
							label="Screen Route"
							outlined
							dense
							hide-details
							clearable
						>
							<template v-slot:selection="{ item }">
								{{ item.value }} ({{ item.label }})
							</template>
							<template v-slot:item="{ item }">
								{{ item.value }} ({{ item.label }})
							</template>
						</v-autocomplete>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						Params Route
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-text-field
							v-model="inputData.params"
							placeholder="Params Route"
							outlined
							dense
							label="Params Route"
							color="light-blue darken-3"
							hide-details
							clearable
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
							:loading="loadingButtonBlastNotifikasi"
							@click="blastNotifikasi()"
						>
							Blast Notifikasi
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>
		</v-card>
		<v-dialog
      v-model="DialogSetupConsumer"
			fullscreen
      scrollable
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Setup Consumer</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { DialogSetupConsumer = false; consumerType = ''; tanggal = []; }"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
				<v-card-text class="pt-4" style="height: 100%;">
					<v-alert
						icon="info"
						border="left"
						color="light-blue darken-3"
						text
						dense
					>
						<span style="font-size: 12px;">Filter range date maksimal 1 bulan</span>
					</v-alert>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
							Range Date
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
						<DatePicker
							v-model="tanggal" 
							range
							circle
							lang="id"
							position="center bottom"
							:date-format="{
								day: '2-digit',
								month: '2-digit',
								year: 'numeric'
							}"
							placeholder="Start Date ~ End Date"
						/>
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col
							cols="12"
							md="4"
							class="pt-2 d-flex align-center font-weight-bold"
						>
							Consumer Type
						</v-col>
						<v-col
							cols="12"
							md="8"
							class="pt-3"
						>
							<v-autocomplete
								v-model="consumerType"
								:items="[{ value: '1', text: 'Member' }, { value: '0', text: 'Non-Member' }]"
								item-text="text"
								item-value="value"
								placeholder="Consumer Type"
								label="Consumer Type"
								outlined
								dense
								hide-details
								clearable
							/>
						</v-col>
					</v-row>
				</v-card-text>
				<v-divider />
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
								@click="SetupConsumer()"
							>
								Setup Consumer
							</v-btn>
						</v-col>
					</v-row>
				</v-card-actions>
      </v-card>
    </v-dialog>
		<v-dialog
			v-model="isLoadingUpdateSetup"
			transition="dialog-bottom-transition"
			persistent
			width="500px"
		>
			<v-progress-linear
				class="pa-3"
				indeterminate
				color="light-blue darken-3"
			/>
			<h4 style="color: #000; text-align: center; background-color: #FFF;">Sedang proses update data User, harap menunggu ...</h4>
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
	name: 'BlastNotifikasi',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		tanggal: [],
		consumerType: '1',
		DialogSetupConsumer: false,
    loadingButtonBlastNotifikasi: false,
    isLoadingUpdateSetup: false,
    kondisiTombol: true,
		UserIDOptions: [],
		screenOptions: [
			{ value: 'AppTabs', label: 'Halaman Utama' },
			{ value: 'ProductDetail', label: 'Halaman Product Detail' },
			{ value: 'PromoDetail', label: 'Halaman Promo Detail' },
			{ value: 'PlanC', label: 'Halaman Plan C' },
		],
		inputData: {
			idUser: [],
			judul: '',
			isi: '',
			image: '',
			screen: '',
			params: '',
		},

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
	mounted() {
		this.getData()
	},
	methods: {
		...mapActions(["fetchData"]),
		getData() {
			this.UserIDOptions = []
      let payload = {
				method: "get",
				url: `kmart/getUserNotifikasi`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.UserIDOptions = res.data.result
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.UserIDOptions = []
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		SetupConsumer() {
			if(!this.tanggal.length) return this.notifikasi("warning", 'Range Date tidak boleh kosong !', "1")
			this.isLoadingUpdateSetup = true
			this.inputData.idUser = []
      let payload = {
				method: "get",
				url: `kmart/setupConsumer?startdate=${this.tanggal[0]}&enddate=${this.tanggal[1]}&is_consumer=${this.consumerType}&is_null=0`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.isLoadingUpdateSetup = false
				this.DialogSetupConsumer = false
				this.tanggal = []
				this.consumerType = '1'
				this.getData()
				this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.inputData.idUser = []
				this.isLoadingUpdateSetup = false
				this.DialogSetupConsumer = false
				this.tanggal = []
				this.consumerType = '1'
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		blastNotifikasi() {
			// console.log(this.inputData);
			this.loadingButtonBlastNotifikasi = true
			// let id_user = this.inputData.idUser.join(',')
      let payload = {
				method: "put",
				url: `kmart/blastNotifikasi?id_user=${id_user}`,
				body: {
					id_user: this.inputData.idUser,
					payload: {
						title: this.inputData.judul,
						body: this.inputData.isi,
						image: this.inputData.image,
						screen: this.inputData.screen,
						params: this.inputData.params,
					}
				},
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonBlastNotifikasi = false
				this.inputData = {
					idUser: [],
					judul: '',
					isi: '',
					image: '',
					screen: '',
					params: '',
				},
				this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.loadingButtonBlastNotifikasi = false
				this.inputData = {
					idUser: [],
					judul: '',
					isi: '',
					image: '',
					screen: '',
					params: '',
				},
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		selectAllData(dataUser) {
			let kumpul = []
			dataUser.map(val => {
				kumpul.push(val.idUser)
			})
			this.inputData.idUser = kumpul
		},
		addData(dataUser) {
			let kumpul = []
			dataUser.map(val => {
				let data = this.UserIDOptions.filter(str => str.idUser == val)[0]
				kumpul.push(data.idUser)
			})
			this.inputData.idUser = kumpul
			// console.log(kumpul);
		},
		remove(item) {
      this.inputData.idUser.splice(this.inputData.idUser.indexOf(item.idUser), 1);
			let kumpul = []
			this.inputData.idUser.map(val => {
				let data = this.UserIDOptions.filter(str => str.idUser == val)[0]
				kumpul.push(data.idUser)
			})
			this.inputData.idUser = kumpul
			// console.log(kumpul);
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
.v-select.v-text-field--outlined:not(.v-text-field--single-line).v-input--dense .v-select__selections {
	height: 100px !important;
	overflow: overlay !important;
}
.v-select__slot {
	padding: 2px !important;
}
.v-chip .v-chip__content {
	font-size: 10px !important;
}
</style>