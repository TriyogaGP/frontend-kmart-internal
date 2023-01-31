<template>
  <div>
    <h1 class="subheading grey--text">Dashboard</h1>
    <v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
      <h3 class="text-center"><u>TRANSACTION {{ tahun }}</u></h3>
      <v-row 
        no-gutters
        class="mt-1 mr-3"
      >
        <v-col
          class="text-start"
          cols="6"
        >
          <v-autocomplete
            v-model="tahun"
            :items="tahunOptions"
            item-text="value"
            item-value="value"
            placeholder="pilih tahun"
            label="pilih tahun"
            outlined
            dense
            hide-details
            @change="getDataTransaksi(tahun)"
          />
        </v-col>
        <v-col
          class="text-end"
          cols="6"
        >
          <v-btn
            color="light-blue darken-3"
            x-small
            dense
            depressed
            class="ma-2 white--text text--darken-2"
            :loading="isLoadingRefresh"
            @click="getReloadDashboardTransaksi(tahun)"
          >
            <v-icon small>refresh</v-icon> refresh
          </v-btn>
        </v-col>
      </v-row>
      <v-container>
        <v-layout row wrap>
          <v-flex sm6 xs12 md6 lg6>
            <v-card class="ma-3">
              <v-list-item>
                <v-list-item-content>
                  <div class="overline text-right">Grafik DP (TRANSACTION)</div>
                  <ChartBar
                    :record.sync="record"
                    :options.sync="options"
                  />
                  </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-flex>
          <v-flex sm6 xs12 md6 lg6>
            <v-card class="ma-3">
              <v-list-item>
                <v-list-item-content>
                  <div class="overline text-right">Grafik BV (TRANSACTION)</div>
                  <ChartBar
                    :record.sync="record2"
                    :options.sync="options"
                  />
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
      <h3 class="text-center"><u>USER ACTIVE {{ new Date().getFullYear() }}</u></h3>
      <v-container>
        <v-layout row wrap>
          <v-flex sm6 xs6 md6 lg6>
            <v-card class="ma-3">
              <v-list-item>
                <v-list-item-content>
                  <v-row>
                    <v-col class="md-6 text-left">
                      <v-btn
                        color="light-blue darken-3"
                        x-small
                        dense
                        depressed
                        class="ma-2 white--text text--darken-2"
                        :loading="isLoadingRefresh1"
                        @click="getReloadDashboardUserActive('1', '0')"
                      >
                        <v-icon small>refresh</v-icon> refresh
                      </v-btn>
                      <v-autocomplete
                        v-model="member"
                        :items="bulanOptions"
                        item-text="value"
                        item-value="value"
                        placeholder="pilih bulan"
                        label="pilih bulan"
                        outlined
                        dense
                        hide-details
                        @change="HitMember($event)"
                      />
                    </v-col>
                    <v-col class="md-6">
                      <div class="overline text-right">Grafik User Member</div> 
                    </v-col>
                  </v-row>
                  <ChartDonut
                    :record.sync="record3"
                    :options.sync="optionsDonut"
                  />
                  </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-flex>
          <v-flex sm6 xs6 md6 lg6>
            <v-card class="ma-3">
              <v-list-item>
                <v-list-item-content>
                  <v-row>
                    <v-col class="md-6 text-left">
                      <v-btn
                        color="light-blue darken-3"
                        x-small
                        dense
                        depressed
                        class="ma-2 white--text text--darken-2"
                        :loading="isLoadingRefresh2"
                        @click="getReloadDashboardUserActive('0', '0')"
                      >
                        <v-icon small>refresh</v-icon> refresh
                      </v-btn>
                      <v-autocomplete
                        v-model="customer"
                        :items="bulanOptions"
                        item-text="value"
                        item-value="value"
                        placeholder="pilih bulan"
                        label="pilih bulan"
                        outlined
                        dense
                        hide-details
                        @change="HitCustomer($event)"
                      />
                    </v-col>
                    <v-col class="md-6">
                      <div class="overline text-right">Grafik User Customer</div> 
                    </v-col>
                  </v-row>
                  <ChartDonut
                    :record.sync="record4"
                    :options.sync="optionsDonut"
                  />
                  </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
      <h3 class="text-center"><u>Top 10 Products {{ new Date().getFullYear() }}</u></h3>
      <v-container>
        <v-layout row wrap>
          <v-flex sm12 xs12 md12 lg12>
            <v-card class="ma-3">
              <v-list-item>
                <v-list-item-content>
                  <v-row>
                    <v-col class="md-6 text-left">
                      <v-btn
                        color="light-blue darken-3"
                        x-small
                        dense
                        depressed
                        class="ma-2 white--text text--darken-2"
                        @click="bukaDialog()"
                      >
                        <v-icon small>info</v-icon> detail
                      </v-btn>
                      <v-autocomplete
                        v-model="podium"
                        :items="podiumOptions"
                        item-text="value"
                        item-value="value"
                        placeholder="pilih podium"
                        label="pilih podium"
                        outlined
                        dense
                        hide-details
                        @change="HitPodium($event)"
                      />
                    </v-col>
                    <v-col class="md-6">
                      <div class="overline text-right">{{ judul }}</div> 
                    </v-col>
                  </v-row>
                  <Podium
                    :records.sync="recordProduct"
                    :kategori.sync="kategori"
                  />
                  </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-dialog
			v-model="detailProduct"
			transition="dialog-bottom-transition"
			persistent
			width="1000px"
		>
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Detail Product</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { detailProduct = false; }"
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
              <v-data-table
                loading-text="Sedang memuat... Harap tunggu"
                no-data-text="Tidak ada data yang tersedia"
                no-results-text="Tidak ada catatan yang cocok ditemukan"
                :options.sync="query"
                :headers="headers"
                :search="searchData"
                :loading="isLoading"
                :items="DataProduct"
                item-key="idProduct"
                hide-default-footer
                class="elevation-1"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                @page-count="pageCount = $event"
              >
                <template #[`item.number`]="{ item }">
                  {{ DataProduct.indexOf(item) + 1 }}
                </template>
                <template #[`item.name`]="{ item }">
                  <span>
                    <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <img class="gambar" :src="item.coverImage" width="50" v-bind="attrs" v-on="on"/>
                      </template>
                      <div>
                        <img class="gambar" :src="item.coverImage" width="250"/><br>
                        {{ item.name }}
                      </div>
                    </v-tooltip><br>
                    {{ item.name }}
                  </span>
                </template>
                <template #[`item.total`]="{ item }">
                  <span v-if="kategori === 'product'" v-html="item.totalSold"></span>
                  <span v-if="kategori === 'productBSLM'" v-html="item.totalSoldLastMonth"></span>
                  <span v-if="kategori === 'productBSL90D'" v-html="item.totalSoldLast90Day"></span>
                </template>
                <template #[`item.isPackage`]="{ item }">
                  <v-icon small v-if="item.isPackage == true" color="green">check</v-icon>
                  <v-icon small v-else-if="item.isPackage == false" color="red">clear</v-icon>
                </template>
                <template #[`item.isPublished`]="{ item }">
                  <v-icon small v-if="item.isPublished == true" color="green">check</v-icon>
                  <v-icon small v-else-if="item.isPublished == false" color="red">clear</v-icon>
                </template>
                <template #[`item.isHidden`]="{ item }">
                  <v-icon small v-if="item.isHidden == true" color="green">check</v-icon>
                  <v-icon small v-else-if="item.isHidden == false" color="red">clear</v-icon>
                </template>
              </v-data-table>
            </v-card-text>
          </div>
          <v-card-actions>
            <v-row 
              no-gutters
              class="mt-1 mr-3"
            >
              <v-col
                class="text-end"
                cols="12"
              >
                <v-pagination
                  v-if="DataProduct.length > 0"
                  v-model="page"
                  :length="pageCount"
                  :total-visible="7"
                />
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-card>
		</v-dialog>
    <v-dialog
			v-model="isLoadingRefresh"
			transition="dialog-bottom-transition"
			persistent
			width="500px"
		>
			<v-progress-linear
				class="pa-3"
				indeterminate
				color="light-blue darken-3"
			/>
			<h4 style="color: #000; text-align: center; background-color: #FFF;">Sedang proses refresh data transaksi dashboard, harap menunggu ...</h4>
		</v-dialog>
    <v-dialog
			v-model="isLoadingRefresh1"
			transition="dialog-bottom-transition"
			persistent
			width="500px"
		>
			<v-progress-linear
				class="pa-3"
				indeterminate
				color="light-blue darken-3"
			/>
			<h4 style="color: #000; text-align: center; background-color: #FFF;">Sedang proses refresh data user aktif member dashboard, harap menunggu ...</h4>
		</v-dialog>
    <v-dialog
			v-model="isLoadingRefresh2"
			transition="dialog-bottom-transition"
			persistent
			width="500px"
		>
			<v-progress-linear
				class="pa-3"
				indeterminate
				color="light-blue darken-3"
			/>
			<h4 style="color: #000; text-align: center; background-color: #FFF;">Sedang proses refresh data user aktif customer dashboard, harap menunggu ...</h4>
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
import PopUpNotifikasiVue from "./Layout/PopUpNotifikasi.vue";
import ChartBar from "./Layout/chart/ChartBar.vue";
import ChartDonut from "./Layout/chart/ChartDonut.vue";
import Podium from "./Layout/Podium.vue";
export default {
  name: 'Dashboard',
  components: { PopUpNotifikasiVue, ChartBar, ChartDonut, Podium },
  data: () => ({
    record: {
      labels: [],
      datasets: []
    },
    record2: {
      labels: [],
      datasets: []
    },
    record3: {
      labels: [],
      datasets: []
    },
    record4: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    },
    optionsDonut: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'left',
          labels: {
            boxWidth: 10,
            boxHeight: 8,
            font: {
              family: "Times New Roman",
              size: 8,
              style: "initial",
            }
          }
        },
      }
    },
    bulanOptions: [
      { value: 'Januari' }, 
      { value: 'Februari' }, 
      { value: 'Maret' }, 
      { value: 'April' }, 
      { value: 'Mei' }, 
      { value: 'Juni' }, 
      { value: 'Juli' }, 
      { value: 'Agustus' }, 
      { value: 'September' }, 
      { value: 'Oktober' }, 
      { value: 'November' }, 
      { value: 'Desember' }
    ],
    tahunOptions: [],
    podiumOptions: [
      { value: '10 Best Seller Product Basic' }, 
      { value: '10 Best Seller Product Package' }, 
      { value: '10 Best Seller Product Last Month' }, 
      { value: '10 Best Seller Product Last 90 Days' }, 
      { value: '10 New Release Product' }, 
    ],
    recordProduct: [],
    url: '',
    judul: '',
    kategori: '',
    podium: '',
    tahun: '2023',
    member: '',
    customer: '',
    bulanNow: '',
    isLoading: false,
    isLoadingRefresh: false,
    isLoadingRefresh1: false,
    isLoadingRefresh2: false,
    detailProduct: false,
    
    DataProduct: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 25,
		searchData: "",
    query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
    },
		headers: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "Nama Product", value: "name", sortable: false },
      { text: "Kategori Product", value: "categoryName", sortable: false },
      { text: "Total Sold", value: "total", sortable: false },
      { text: "Package", value: "isPackage", sortable: false },
      { text: "Published", value: "isPublished", sortable: false },
      { text: "Hidden", value: "isHidden", sortable: false },
      { text: "Status", value: "status", sortable: false },
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
		title: "Dashboard - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
  mounted() {
    const month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = new Date();
    this.bulanNow = month[d.getMonth()];
    this.member = this.bulanNow,
    this.customer = this.bulanNow,
    this.getDataUserMember(this.bulanNow)
    this.getDataUserCustomer(this.bulanNow)
    this.getDataTransaksi(d.getFullYear())
    this.judul = '10 Best Seller Product Basic'
    this.podium = '10 Best Seller Product Basic'
    this.url = 'kategori=ALL&is_package=0'
    this.kategori = 'product'
    this.getDataProduct(this.url)
    for (let tahun = 2021; tahun <= d.getFullYear(); tahun++) {
      this.tahunOptions.push({value: tahun.toString()})
    }
  },  
	methods: {
		...mapActions(["fetchData"]),
    getDataTransaksi(tahun) {
      this.record = {
        labels: [],
        datasets: []
      }
      this.record2 = {
        labels: [],
        datasets: []
      }
      let payload = {
				method: "get",
				url: `kmart/getDashboardTransaksi?tahun=${tahun}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result
				let dp = [], bv = []
        resdata.map(val => {
          this.record.labels.push(val.bulan)
          dp.push(val.dp)
        })
        this.record.datasets.push(
          {
            label: "DP",
            backgroundColor: 'green',
            data: dp
          },
        )
        resdata.map(val => {
          this.record2.labels.push(val.bulan)
          bv.push(val.bv)
        })
        this.record2.datasets.push(
          {
            label: "BV",
            backgroundColor: 'red',
            data: bv
          },
        )
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    getDataUserMember(bulan) {
      this.record3 = {
        labels: [],
        datasets: []
      }
      let payload = {
				method: "get",
				url: `kmart/getDashboardUserActive?userType=Member&bulan=${bulan}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				let resdata = res.data.result[0]
				let dataUser = resdata.dataUser
				let datauser = []
        dataUser.map(val => {
          let label = `${this.uppercaseLetterFirst(val.fullname)} (${val.idMember})`
          this.record3.labels.push(label)
          datauser.push(val.jmlData)
        })
        this.record3.datasets = [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#E042F5', '#3CFA4F', '#EDD609', '#7A09E3', '#F7550A', '#0AF7DF'],
            data: datauser
          }
        ]
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
		},
    getDataUserCustomer(bulan) {
      this.record4 = {
        labels: [],
        datasets: []
      }
      let payload = {
				method: "get",
				url: `kmart/getDashboardUserActive?userType=Customer&bulan=${bulan}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				let resdata = res.data.result[0]
				let dataUser = resdata.dataUser
				let datauser = []
        dataUser.map(val => {
          this.record4.labels.push(this.uppercaseLetterFirst(val.fullname))
          datauser.push(val.jmlData)
        })
        this.record4.datasets = [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#E042F5', '#3CFA4F', '#EDD609', '#7A09E3', '#F7550A', '#0AF7DF'],
            data: datauser
          }
        ]
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    getDataProduct(url) {
      this.recordProduct = []
      this.DataProduct = []
      let payload = {
				method: "get",
				url: `kmart/getDashboardProduct?${url}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				let dataProduct = res.data.result
        this.DataProduct = dataProduct
				let datapodium = []
        dataProduct.map((val, i) => {
          if(i<10) {
            datapodium.push(val)
          }
        })
        let hasil = await datapodium.map((winner, position) => { return { ...winner, position } })
        let podium = [10, 8, 6, 4, 2, 0, 1, 3, 5, 7, 9]
        .reduce((podiumOrder, position) => [...podiumOrder, hasil[position]], [])
        .filter(Boolean)

        this.recordProduct = podium
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    getReloadDashboardTransaksi(tahun) {
      this.isLoadingRefresh = true
      let payload = {
				method: "get",
				url: `kmart/reloadDashboardTransaksi?tahun=${tahun}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.isLoadingRefresh = false
        this.getDataTransaksi(tahun)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.isLoadingRefresh = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    getReloadDashboardUserActive(isMember, detail) {
      if(isMember == '1') { this.isLoadingRefresh1 = true }else{ this.isLoadingRefresh2 = true }
      let payload = {
				method: "get",
				url: `kmart/reloadDashboardUserActive?isMember=${isMember}&detail=${detail}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        if(isMember == '1') { 
          this.isLoadingRefresh1 = false
          this.getDataUserMember(this.bulanNow)
        }else{
          this.isLoadingRefresh2 = false
          this.getDataUserCustomer(this.bulanNow)
        }
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        if(isMember == '1') { this.isLoadingRefresh1 = false }else{ this.isLoadingRefresh2 = false }
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    bukaDialog(){
      if(this.judul == '10 Best Seller Product Basic') {
        this.url = 'kategori=ALL&is_package=0'
        this.kategori = 'product'
      }else if(this.judul == '10 Best Seller Product Package') {
        this.url = 'kategori=ALL&is_package=1'
        this.kategori = 'product'
      }else if(this.judul == '10 Best Seller Product Last Month') {
        this.url = 'kategori=PART&condition=BEST_SELLER&condition_value=LAST_MONTH'
        this.kategori = 'productBSLM'
      }else if(this.judul == '10 Best Seller Product Last 90 Days') {
        this.url = 'kategori=PART&condition=BEST_SELLER&condition_value=LAST_90_DAYS'
        this.kategori = 'productBSL90D'
      }else if(this.judul == '10 New Release Product') {
        this.url = 'kategori=PART&condition=NEW_RELEASE&condition_value='
        this.kategori = 'product'
      }
      this.getDataProduct(this.url)
      this.detailProduct = true
    },
    HitMember(bulan){
      this.getDataUserMember(bulan)
    },
    HitCustomer(bulan){
      this.getDataUserCustomer(bulan)
    },
    HitPodium(kategori){
      this.judul = kategori
      if(kategori == '10 Best Seller Product Basic') {
        this.url = 'kategori=ALL&is_package=0'
        this.kategori = 'product'
      }else if(kategori == '10 Best Seller Product Package') {
        this.url = 'kategori=ALL&is_package=1'
        this.kategori = 'product'
      }else if(kategori == '10 Best Seller Product Last Month') {
        this.url = 'kategori=PART&condition=BEST_SELLER&condition_value=LAST_MONTH'
        this.kategori = 'productBSLM'
      }else if(kategori == '10 Best Seller Product Last 90 Days') {
        this.url = 'kategori=PART&condition=BEST_SELLER&condition_value=LAST_90_DAYS'
        this.kategori = 'productBSL90D'
      }else if(kategori == '10 New Release Product') {
        this.url = 'kategori=PART&condition=NEW_RELEASE&condition_value='
        this.kategori = 'product'
      }
      this.getDataProduct(this.url)
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
.gambar {
	border-style: solid !important;
	border-radius: 10px !important;
	padding: 2px !important;
}
</style>