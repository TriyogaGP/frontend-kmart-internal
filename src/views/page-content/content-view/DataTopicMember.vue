<template>
	<div>
		<h1 class="subheading grey--text">Panel Data Topic Member</h1>
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
							:loading="loadingButtonDataTopicMember"
							@click="getData()"
						>
							Cari Data
						</v-btn>
					</v-col>
				</v-row>
			</v-card-actions>
		</v-card>
		<v-container>
      <v-layout row wrap>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalAksesories !== 0 && viewDataUserTopic(DataTopicMember.Aksesories, 'Aksesories')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Aksesories</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalAksesories : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalAnakAnak !== 0 && viewDataUserTopic(DataTopicMember.AnakAnak, 'Anak - Anak')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Anak - Anak</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalAnakAnak : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalAyurveda !== 0 && viewDataUserTopic(DataTopicMember.Ayurveda, 'Ayurveda')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Ayurveda</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalAyurveda : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalKosmetik !== 0 && viewDataUserTopic(DataTopicMember.Kosmetik, 'Kosmetik')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Kosmetik</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalKosmetik : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalMinumanKesehatan !== 0 && viewDataUserTopic(DataTopicMember.MinumanKesehatan, 'Minuman Kesehatan')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Minuman Kesehatan</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalMinumanKesehatan : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalMusiman !== 0 && viewDataUserTopic(DataTopicMember.Musiman, 'Musiman')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Musiman</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalMusiman : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalOlahraga !== 0 && viewDataUserTopic(DataTopicMember.Olahraga, 'Olahraga')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Olahraga</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalOlahraga : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalPakaian !== 0 && viewDataUserTopic(DataTopicMember.Pakaian, 'Pakaian')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Pakaian</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalPakaian : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalPerawatanKulit !== 0 && viewDataUserTopic(DataTopicMember.PerawatanKulit, 'Perawatan Kulit')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Perawatan Kulit</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalPerawatanKulit : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalPerlengkapanMandi !== 0 && viewDataUserTopic(DataTopicMember.PerlengkapanMandi, 'Perlengkapan Mandi')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Perlengkapan Mandi</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalPerlengkapanMandi : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalPerlengkapanRumahTangga !== 0 && viewDataUserTopic(DataTopicMember.PerlengkapanRumahTangga, 'Perlengkapan Rumah Tangga')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Perlengkapan Rumah Tangga</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalPerlengkapanRumahTangga : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalPertumbuhanRambut !== 0 && viewDataUserTopic(DataTopicMember.PertumbuhanRambut, 'Pertumbuhan Rambut')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Pertumbuhan Rambut</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalPertumbuhanRambut : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md3 lg3>
          <v-card class="ma-3" height="100" @click="totalTopic.totalSuplemen !== 0 && viewDataUserTopic(DataTopicMember.Suplemen, 'Suplemen')">
            <v-list-item>
              <v-list-item-content>
                <div class="overline text-right">Suplemen</div>
                <v-list-item-title class="headline mb-1 text-right">{{ totalTopic ? totalTopic.totalSuplemen : 0 }}</v-list-item-title>
                <div><v-divider /></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
			</v-layout>
		</v-container>
		<v-dialog
      v-model="DialogTopic"
      max-width="1000px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Topic {{ titleDialog }}</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { DialogTopic = false; }"
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
							<v-tabs
							 	v-model="tab"
								fixed-tabs
								background-color="light-blue darken-3"
								dark
							>
								<v-tab key="Belanja">
									Belanja ({{ OrderMemberBelanja ? OrderMemberBelanja.length : 0 }})
								</v-tab>
								<v-tab key="TidakBelanja">
									Tidak Belanja ({{ OrderMemberTidakBelanja ? OrderMemberTidakBelanja.length : 0 }})
								</v-tab>
							</v-tabs>
							<v-tabs-items v-model="tab">
								<v-tab-item key="Belanja">
									<v-card class="mt-2 mb-2 pa-1" elevation="0">
										<v-icon style="cursor: pointer;" large @click="exportExcelConsumer(titleDialog, OrderMemberBelanja, 'Belanja')">fas fa-file-excel</v-icon>
										<v-data-table
											loading-text="Sedang memuat... Harap tunggu"
											no-data-text="Tidak ada data yang tersedia"
											no-results-text="Tidak ada catatan yang cocok ditemukan"
											:headers="headersOrderMember"
											:loading="isLoadingDataTopic"
											:items="OrderMemberBelanja"
											item-key="idUser"
											hide-default-footer
											class="elevation-1"
											:page.sync="page"
											:items-per-page="itemsPerPage"
											@page-count="pageCount = $event"
										>
											<template #[`item.number`]="{ item }">
												{{ OrderMemberBelanja.indexOf(item) + 1 }}
											</template>
											<template #[`item.orders`]="{ item }">
												<v-btn
													color="light-blue darken-3"
													class="white--text text--darken-2"
													small
													dense
													depressed
													@click="viewDataOrder(item.dataOrders)"
												>
													Lihat Order
												</v-btn>
											</template>
										</v-data-table>
									</v-card>
									<v-row>
										<v-col cols="12">
											<v-pagination
												v-if="OrderMemberBelanja.length > 0"
												v-model="page"
												:length="pageCount"
												:total-visible="7"
											/>
										</v-col>
									</v-row>
								</v-tab-item>
								<v-tab-item key="TidakBelanja">
									<v-card class="mt-2 mb-2 pa-1" elevation="0">
										<v-icon style="cursor: pointer;" large @click="exportExcelConsumer(titleDialog, OrderMemberTidakBelanja, 'Tidak Belanja')">fas fa-file-excel</v-icon>
										<v-data-table
											loading-text="Sedang memuat... Harap tunggu"
											no-data-text="Tidak ada data yang tersedia"
											no-results-text="Tidak ada catatan yang cocok ditemukan"
											:headers="headersOrderMember"
											:loading="isLoadingDataTopic"
											:items="OrderMemberTidakBelanja"
											item-key="idUser"
											hide-default-footer
											class="elevation-1"
											:page.sync="page1"
											:items-per-page="itemsPerPage1"
											@page-count="pageCount1 = $event"
										>
											<template #[`item.number`]="{ item }">
												{{ OrderMemberTidakBelanja.indexOf(item) + 1 }}
											</template>
											<template #[`item.orders`]="{}">
												-
											</template>
										</v-data-table>
									</v-card>
									<v-row>
										<v-col cols="12">
											<v-pagination
												v-if="OrderMemberTidakBelanja.length > 0"
												v-model="page1"
												:length="pageCount1"
												:total-visible="7"
											/>
										</v-col>
									</v-row>
								</v-tab-item>
							</v-tabs-items>
            </v-card-text>
          </div>
					<v-divider />
					<v-card-actions class="pa-4"/>
        </v-card>
      </v-card>
    </v-dialog>
		<v-dialog
      v-model="DialogOrder"
      max-width="1000px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Data Orders</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { DialogOrder = false; }"
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
							<v-card class="mt-2 mb-2 pa-1" elevation="0">
								<v-data-table
									loading-text="Sedang memuat... Harap tunggu"
									no-data-text="Tidak ada data yang tersedia"
									no-results-text="Tidak ada catatan yang cocok ditemukan"
									:headers="headersDetailOrderMember"
									:loading="isLoadingDataOrder"
									:items="OrderDetails"
									item-key="orderNumber"
									hide-default-footer
									class="elevation-1"
									:page.sync="page2"
									:items-per-page="itemsPerPage2"
									@page-count="pageCount2 = $event"
								>
									<template #[`item.number`]="{ item }">
										{{ OrderDetails.indexOf(item) + 1 }}
									</template>
									<template #[`item.createdAt`]="{ item }">
										<span v-html="convertDateTime(item.createdAt)" /> 
									</template>
									<template #[`item.product`]="{ item }">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-icon small v-bind="attrs" v-on="on">info</v-icon>
											</template>
											<div
												:class="item.productDetails > 1 ? 'mb-1' : ''"
												v-for="(data, index) in item.productDetails"
												:key="index"
											>
												<strong>{{ data.name }} ({{ data.quantity }})</strong> 
											</div>
										</v-tooltip>
									</template>
								</v-data-table>
							</v-card>
							<v-row>
								<v-col cols="12" class="mt-2 pa-2 px-5">
									<v-pagination
										v-if="OrderDetails.length > 0"
										v-model="page2"
										:length="pageCount2"
										:total-visible="7"
									/>
								</v-col>
							</v-row>
            </v-card-text>
          </div>
        </v-card>
      </v-card>
    </v-dialog>
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
	name: 'DataTopicMember',
  components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		input: {
			StartDate: '',
			EndDate: ''
		},
		menu1: false,
		menu2: false,
		nowDate: new Date().toISOString().slice(0,10),
		Hariini: new Date(),
		totalTopic: {
			totalAksesories: 0,
			totalAnakAnak: 0,
			totalAyurveda: 0,
			totalKosmetik: 0,
			totalMinumanKesehatan: 0,
			totalMusiman: 0,
			totalOlahraga: 0,
			totalPakaian: 0,
			totalPerawatanKulit: 0,
			totalPerlengkapanMandi: 0,
			totalPerlengkapanRumahTangga: 0,
			totalPertumbuhanRambut: 0,
			totalSuplemen: 0
		},
		DataTopicMember: {
			Aksesories: [],
			AnakAnak: [],
			Ayurveda: [],
			Kosmetik: [],
			MinumanKesehatan: [],
			Musiman: [],
			Olahraga: [],
			Pakaian: [],
			PerawatanKulit: [],
			PerlengkapanMandi: [],
			PerlengkapanRumahTangga: [],
			PertumbuhanRambut: [],
			Suplemen: []
		},
    loadingButtonDataTopicMember: false,
    isLoadingDataTopicMember: false,
		DialogTopic: false,
		DialogOrder: false,
    isLoadingDataTopic: false,
    isLoadingDataOrder: false,
    isLoadingExport: false,
		tab: null,
		titleDialog: '',
		OrderDetails: [],
		OrderMemberBelanja: [],
		OrderMemberTidakBelanja: [],
		page: 1,
    pageCount: 0,
    itemsPerPage: 5,
		page1: 1,
    pageCount1: 0,
    itemsPerPage1: 5,
		page2: 1,
    pageCount2: 0,
    itemsPerPage2: 5,
		headersOrderMember: [
      { text: "ID User", value: "idUser", sortable: false },
      { text: "ID Member", value: "idMember", sortable: false },
      { text: "Nama", value: "name", sortable: false },
      { text: "Email", value: "email", sortable: false },
      { text: "No. Telp", value: "deviceNumber", sortable: false },
      { text: "Orders", value: "orders", sortable: false },
    ],
		headersDetailOrderMember: [
      { text: "idOrder", value: "idOrder", sortable: false },
      { text: "Invoice", value: "orderNumber", sortable: false },
      { text: "Tanggal Order", value: "createdAt", sortable: false },
      { text: "Product Detail", value: "product", sortable: false },
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
		title: "Data Topic Member - DNM Mobile",
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
					this.clearForm()
					this.OrderMemberBelanja = []
					this.OrderMemberTidakBelanja = []
					this.input = {
						StartDate: '',
						EndDate: '',
					}
				}
			}
		},
	},
	mounted() {
		// this.getData()
	},
	methods: {
		...mapActions(["fetchData"]),
		getData() {
			this.clearForm()
			this.loadingButtonDataTopicMember = true
			this.isLoadingDataTopicMember = true
      let payload = {
				method: "get",
				url: `kmart/getdataTopicConsumer?startdate=${this.input.StartDate}&enddate=${this.input.EndDate}&is_consumer=1&is_null=0`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.loadingButtonDataTopicMember = false
				this.isLoadingDataTopicMember = false
				let resdata = res.data.result
				let Total = resdata.Total
				let idUser = resdata.idUser
				this.totalTopic = {
					totalAksesories: Total.totalAksesories,
					totalAnakAnak: Total.totalAnakAnak,
					totalAyurveda: Total.totalAyurveda,
					totalKosmetik: Total.totalKosmetik,
					totalMinumanKesehatan: Total.totalMinumanKesehatan,
					totalMusiman: Total.totalMusiman,
					totalOlahraga: Total.totalOlahraga,
					totalPakaian: Total.totalPakaian,
					totalPerawatanKulit: Total.totalPerawatanKulit,
					totalPerlengkapanMandi: Total.totalPerlengkapanMandi,
					totalPerlengkapanRumahTangga: Total.totalPerlengkapanRumahTangga,
					totalPertumbuhanRambut: Total.totalPertumbuhanRambut,
					totalSuplemen: Total.totalSuplemen
				}
				this.DataTopicMember = {
					Aksesories: idUser.idUserAksesories,
					AnakAnak: idUser.idUserAnakAnak,
					Ayurveda: idUser.idUserAyurveda,
					Kosmetik: idUser.idUserKosmetik,
					MinumanKesehatan: idUser.idUserMinumanKesehatan,
					Musiman: idUser.idUserMusiman,
					Olahraga: idUser.idUserOlahraga,
					Pakaian: idUser.idUserPakaian,
					PerawatanKulit: idUser.idUserPerawatanKulit,
					PerlengkapanMandi: idUser.idUserPerlengkapanMandi,
					PerlengkapanRumahTangga: idUser.idUserPerlengkapanRumahTangga,
					PertumbuhanRambut: idUser.idUserPertumbuhanRambut,
					Suplemen: idUser.idUserSuplemen
				}
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.clearForm()
				this.loadingButtonDataTopicMember = false
				this.isLoadingDataTopicMember = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getDataOrder(idUser) {
			this.isLoadingDataTopic = true
			this.OrderMemberBelanja = []
			this.OrderMemberTidakBelanja = []
      let payload = {
				method: "get",
				url: `kmart/getdataOrderConsumer?id_user=${idUser}&is_consumer=1`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result
				this.isLoadingDataTopic = false
				this.OrderMemberBelanja = resdata.memberBelanja
				this.OrderMemberTidakBelanja = resdata.memberTidakBelanja
				// this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.isLoadingDataTopic = false
				this.OrderMemberBelanja = []
				this.OrderMemberTidakBelanja = []
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		viewDataUserTopic(idUser, title){
			this.getDataOrder(idUser)
			this.titleDialog = title
			this.DialogTopic = true
		},
		viewDataOrder(data){
			console.log(data);
			this.OrderDetails = data
			this.DialogOrder = true
		},
		clearForm(){
			this.totalTopic = {
				totalAksesories: 0,
				totalAnakAnak: 0,
				totalAyurveda: 0,
				totalKosmetik: 0,
				totalMinumanKesehatan: 0,
				totalMusiman: 0,
				totalOlahraga: 0,
				totalPakaian: 0,
				totalPerawatanKulit: 0,
				totalPerlengkapanMandi: 0,
				totalPerlengkapanRumahTangga: 0,
				totalPertumbuhanRambut: 0,
				totalSuplemen: 0
			}
			this.DataTopicMember = {
				Aksesories: [],
				AnakAnak: [],
				Ayurveda: [],
				Kosmetik: [],
				MinumanKesehatan: [],
				Musiman: [],
				Olahraga: [],
				Pakaian: [],
				PerawatanKulit: [],
				PerlengkapanMandi: [],
				PerlengkapanRumahTangga: [],
				PertumbuhanRambut: [],
				Suplemen: []
			}
		},
		async exportExcelConsumer(title, dataOrders, kondisi) {
			if(!dataOrders.length) return this.notifikasi("warning", 'Gagal Export Excel, Data belum tersedia !', "1")
			let records = await Promise.all(dataOrders.map(async val => {
				return {
					name: val.name,
					email: val.email,
					deviceNumber: val.deviceNumber,
				}
			}))
			let link = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_PROD_API_URL : process.env.VUE_APP_DEV_API_URL
			this.isLoadingExport = true
			fetch(`${link}kmart/exportExcelConsumer?dataOrder=${JSON.stringify(records)}`, {
				method: 'GET',
				dataType: "xml",
			})
			.then(response => response.arrayBuffer())
			.then(async response => {
				// console.log(response)
				this.isLoadingExport = false
				let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
				this.downloadBlob(blob,`Data Topic ${title}_Member ${kondisi}_${this.convertDateToPicker2(new Date())}.xlsx`)
				this.notifikasi("success", 'Sukses Export Excel', "1")
			})
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
.v-application .overline{
	font-size: 10px !important;
}
</style>