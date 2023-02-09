<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Hit Manual Order</h1>
		<v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
			<v-card-text>
				<v-row no-gutters>
					<v-col
						cols="12"
						md="4"
						class="pt-2 d-flex align-center font-weight-bold"
					>
						No Invoice
					</v-col>
					<v-col
						cols="12"
						md="8"
						class="pt-3"
					>
						<v-text-field
							v-model="orderNumber"
							placeholder="No Invoice"
							outlined
							dense
							label="No Invoice"
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
							:loading="isLoading"
							@click="hitManual()"
						>
							Hit Manual
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>
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
	name: 'DataHitManualOrder',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		orderNumber: '',
    isLoading: false,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	metaInfo: {
		title: "Data Hit Manual Order - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	mounted() {
	},
	methods: {
		...mapActions(["fetchData"]),
		hitManual() {
			if(this.orderNumber == null || this.orderNumber == '') return this.notifikasi("warning", 'Order Number kosong !', "1")
			this.isLoading = true
			let bodyData = {
        orderNumber: this.orderNumber
      }
      let payload = {
				method: "post",
				url: `kmart/hitManualKMart`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.isLoading = false
				this.orderNumber == ''
				this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.isLoading = false
				this.orderNumber == ''
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