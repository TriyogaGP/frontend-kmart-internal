<template>
  <div>
    <h1 class="subheading grey--text">Data Berita Acara</h1>
    <v-card class="mt-2 mb-2 pa-1" outlined elevation="0">
      <v-row no-gutters class="pa-2">
        <v-col cols="12" md="6">
          <v-btn
            color="light-blue darken-3"
            small
            dense
            depressed
            class="ma-2 white--text text--darken-2"
            @click.stop="bukaDialog(null, 0)"
          >
            <v-icon small>add</v-icon>	Tambah
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-row no-gutters>
            <v-col cols="12" md="9">
              <v-text-field
                v-model="searchData"
                append-icon="mdi-magnify"
                label="Pencarian..."
                single-line
                hide-details
                solo
                color="light-blue darken-3"
                clearable
                @keyup.enter="getBeritaAcara(1, limit, searchData)"
              />
            </v-col>
            <v-col cols="12" md="3" class="pl-2 d-flex justify-end align-center">
              <v-autocomplete
                v-model="page"
                :items="pageOptions"
                item-text="value"
                item-value="value"
                label="Page"
                outlined
                dense
                hide-details
                :disabled="DataBeritaAcara.length ? false : true"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="px-1">
        <v-data-table
          loading-text="Sedang memuat... Harap tunggu"
          no-data-text="Tidak ada data yang tersedia"
          no-results-text="Tidak ada catatan yang cocok ditemukan"
          :headers="headers"
          :loading="isLoading"
          :items="DataBeritaAcara"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
          item-key="idBeritaAcara"
          hide-default-footer
          class="elevation-1"
          :items-per-page="itemsPerPage"
          @page-count="pageCount = $event"
        >
          <template #[`item.number`]="{ item }">
            {{ page > 1 ? ((page - 1)*limit) + DataBeritaAcara.indexOf(item) + 1 : DataBeritaAcara.indexOf(item) + 1 }}
          </template>
					<template #[`item.orderNumber`]="{ item }">
						<input type="hidden" id="testing-code-on" :value="item.orderNumber">
					  <span ref="myinputon" v-html="item.orderNumber" /> <v-icon @click.stop.prevent="copyOrderNumber(item.orderNumber)" small>copy_all</v-icon> 
					</template>
					<template #[`item.penjelasan`]="{ item }">
						<span v-html="(item.penjelasan || '').length > 120 ? `${item.penjelasan.substring(0, 120)}...` : item.penjelasan" /> 
					</template>
					<template #[`item.createdAt`]="{ item }">
						<span v-html="convertDateTime(item.createdAt)" /> 
					</template>
          <template #expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="white">
              <v-btn
                :value="item.idBeritaAcara"
                color="#0bd369"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                @click="bukaDialog(item, 1)"
              >
                <v-icon small>edit</v-icon>	Ubah
              </v-btn> 
              <v-btn
                :value="item.idBeritaAcara"
                color="#04f7f7"
                small
                dense
                depressed
                class="ma-2 white--text text--darken-2"
                @click="bukaDialog(item, 2)"
              >
                <v-icon small>info</v-icon>	Detail
              </v-btn>
              <v-divider />
            </td>
          </template>
        </v-data-table>
      </div>
      <v-row>
        <!-- <v-col cols="12" class="mt-2 pa-2 px-5">
          <v-pagination
            v-if="DataBeritaAcara.length > 0"
            v-model="page"
            :length="pageCount"
            :total-visible="7"
          />
        </v-col> -->
        <v-col cols="10" class="mt-2 d-flex justify-start align-center">
				<span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
			</v-col>
			<v-col cols="2" class="mt-2 text-right">
				<div class="d-flex justify-end">
					<v-autocomplete
						v-model="limit"
						:items="limitPage"
						item-text="value"
						item-value="value"
            label="Limit"
						outlined
						dense
						hide-details
						:disabled="DataBeritaAcara.length ? false : true"
					/>
					<v-icon
						style="cursor: pointer;"
						large
						:disabled="DataBeritaAcara.length ? pageSummary.page != 1 ? false : true : true"
						@click="() => { page = pageSummary.page - 1 }"
					>
						keyboard_arrow_left
					</v-icon>
					<v-icon
						style="cursor: pointer;"
						large
						:disabled="DataBeritaAcara.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
						@click="() => { page = pageSummary.page + 1 }"
					>
						keyboard_arrow_right
					</v-icon>
				</div>
			</v-col>
      </v-row>
    </v-card>
    <v-dialog
      v-model="DialogBeritaAcara"
			scrollable
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>
            {{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Berita Acara
            <v-btn
              color="#04f7f7"
              small
              dense
              depressed
              :loading="isLoadingExport"
              class="ma-2 white--text text--darken-2"
              @click="pdfCreate(inputDataBeritaAcara)"
            >
              <v-icon small>info</v-icon>	Cetak PDF
            </v-btn>
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="tutupDialog"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text v-if="editedIndex !== 2" class="pt-4">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Order Number
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-text-field
                v-model="inputDataBeritaAcara.order_number"
                placeholder="Order Number"
                outlined
                dense
                label="Order Number"
                color="light-blue darken-3"
                hide-details
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Penjelasan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-textarea
                v-model="inputDataBeritaAcara.penjelasan"
                placeholder="Penjelasan"
                outlined
                dense
                rows="4"
                label="Penjelasan"
                color="light-blue darken-3"
                hide-details
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
                no-resize
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Request Oleh
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <v-textarea
                v-model="inputDataBeritaAcara.request_by"
                placeholder="Request By"
                outlined
                dense
                rows="4"
                label="Request By"
                color="light-blue darken-3"
                hide-details
                :clearable="editedIndex != 2"
                :readonly="editedIndex == 2"
                no-resize
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-if="editedIndex === 2" class="pt-4">
          <v-row no-gutters class="py-2">
						<v-col
							cols="12"
							md="6"
						>
							<strong>Order Number</strong><br>
              <input type="hidden" id="testing-code-on" :value="inputDataBeritaAcara.order_number">
					    <span ref="myinputon" v-html="inputDataBeritaAcara.order_number" /> <v-icon @click.stop.prevent="copyOrderNumber(inputDataBeritaAcara.order_number)" small>copy_all</v-icon> 
						</v-col>
						<v-col
							cols="12"
							md="6"
						>
							<strong>Tanggal Request</strong><br>
							{{ convertDateTime(this.inputDataBeritaAcara.created_at) }}
						</v-col>
					</v-row>
          <v-row no-gutters class="py-2">
						<v-col
							cols="12"
							md="12"
						>
							<strong>Request By</strong><br>
							{{ this.inputDataBeritaAcara.request_by }}
						</v-col>
					</v-row>
          <v-row no-gutters class="py-2">
						<v-col
							cols="12"
							md="12"
						>
							<strong>Penjelasan</strong><br>
							{{ this.inputDataBeritaAcara.penjelasan }}
						</v-col>
					</v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions v-if="editedIndex === 2"/>
        <v-card-actions v-if="editedIndex !== 2">
          <v-row 
            no-gutters
            class="mt-1 mr-3"
          >
            <v-col
              class="text-end"
              cols="12"
            >
              <v-btn
                v-if="editedIndex == 0"
                color="light-blue darken-3"
                class="white--text text--darken-2"
                small
                dense
                depressed
                :disabled="kondisiTombol"
                @click="SimpanForm(0)"
              >
                Simpan Data
              </v-btn> 
              <v-btn
                v-else-if="editedIndex == 1"
                color="light-blue darken-3"
                class="white--text text--darken-2"
                small
                dense
                depressed
                :disabled="kondisiTombol"
                @click="SimpanForm(1)"
              >
                Ubah Data
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
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
  name: 'DataBeritaAcara',
  components: {
    PopUpNotifikasiVue
  },
  data: () => ({
    isLoading: false,
		DataBeritaAcara: [],
    expanded: [],
    singleExpand: true,
		searchData: "",
    page: 1,
    pageCount: 0,
    itemsPerPage: 100,
    limit: 20,
		limitPage: [
			{ value: 5 },
			{ value: 10 },
			{ value: 20 },
			{ value: 50 },
			{ value: 100 },
		],
    pageOptions: [
      { value: 1 }
    ],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "#", value: "data-table-expand", sortable: false, width: "5%" },
      { text: "Order Number", value: "orderNumber", sortable: false },
      { text: "Penjelasan", value: "penjelasan", sortable: false },
      { text: "Request By", value: "requestBy", sortable: false },
      { text: "Request Date", value: "createdAt", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    BASEURL: '',
    roleID: '',
    idLog: '',
    DialogBeritaAcara: false,
    isLoadingExport: false,
    inputDataBeritaAcara: {
      id_berita_acara: '',
      order_number: '',
      penjelasan: '',
      request_by: '',
      created_at: '',
    },
    editedIndex: 0,
    kondisiTombol: true,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  metaInfo: {
		title: "Data Berita Acara - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
  watch: {
    inputDataBeritaAcara: {
      deep: true,
      handler(value){
				if(value.order_number == null){ this.inputDataBeritaAcara.order_number = '' }
				if(value.penjelasan == null){ this.inputDataBeritaAcara.penjelasan = '' }
				if(value.request_by == null){ this.inputDataBeritaAcara.request_by = '' }

        if(value.order_number != '' && value.penjelasan != '' && value.request_by != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }
      }
    },
    page: {
			deep: true,
			handler(value) {
				this.getBeritaAcara(value, this.limit, this.searchData)
			}
		},
    limit: {
			deep: true,
			handler(value) {
				this.getBeritaAcara(1, value, this.searchData)
			}
		},
    searchData: {
			deep: true,
			handler(value) {
        if (value == null) {
          this.getBeritaAcara(1, this.limit, this.searchData)
        }
			}
		},
  },
  mounted() {
    this.BASEURL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_PROD_API_URL : process.env.VUE_APP_DEV_API_URL
    this.roleID = localStorage.getItem('roleID')
    this.idLog = localStorage.getItem('idLogin')
		this.getBeritaAcara(this.page, this.limit, this.searchData);
	},
	methods: {
		...mapActions(["fetchData"]),
		getBeritaAcara(page = 1, limit, keyword) {
      this.itemsPerPage = limit
      this.page = page
			this.isLoading = true
      this.DataBeritaAcara = []
      this.pageOptions = [{ value: 1 }]
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
			let payload = {
        method: "get",
				url: `admin/BeritaAcara?page=${page}&limit=${limit}${keyword ? `&keyword=${keyword}` : ''}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        let resdata = res.data.result
				this.DataBeritaAcara = resdata.records
				this.pageSummary = {
					page: this.DataBeritaAcara.length ? resdata.pageSummary.page : 0,
					limit: this.DataBeritaAcara.length ? resdata.pageSummary.limit : 0,
					total: this.DataBeritaAcara.length ? resdata.pageSummary.total : 0,
					totalPages: this.DataBeritaAcara.length ? resdata.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push({ value: index })
        }
        this.isLoading = false
			})
			.catch((err) => {
        this.itemsPerPage = limit
        this.page = page
        this.DataBeritaAcara = []
        this.pageOptions = [{ value: 1 }]
        this.pageSummary = {
          page: '',
          limit: '',
          total: '',
          totalPages: ''
        }
        this.isLoading = false
        this.notifikasi("error", err.response.data.message, "1")
			});
		},
    bukaDialog(item, index){
      this.editedIndex = index
      this.passType = false
      this.endecryptType = false
      if(index == 0){
        this.clearForm()
      }else{
        this.inputDataBeritaAcara.id_berita_acara = item.idBeritaAcara
        this.inputDataBeritaAcara.order_number = item.orderNumber
        this.inputDataBeritaAcara.penjelasan = item.penjelasan
        this.inputDataBeritaAcara.request_by = item.requestBy
        this.inputDataBeritaAcara.created_at = item.createdAt
      }
      this.DialogBeritaAcara = true
    },
    tutupDialog() {
      this.clearForm()
      this.DialogBeritaAcara = false
    },
    SimpanForm(index) {
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_berita_acara: index == 0 ? '' : this.inputDataBeritaAcara.id_berita_acara,
        order_number: this.inputDataBeritaAcara.order_number,
        penjelasan: this.inputDataBeritaAcara.penjelasan,
        request_by: this.inputDataBeritaAcara.request_by,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `admin/BeritaAcara`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogBeritaAcara = false
        this.getBeritaAcara(1, this.limit, this.searchData)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    pdfCreate(data) {
      this.isLoadingExport = true
      fetch(`${this.BASEURL}admin/PDF/${data.id_berita_acara}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
      })
      .then(response => response.arrayBuffer())
      .then(async response => {
        this.isLoadingExport = false
        let blob = new Blob([response], { type: 'application/pdf' })
        this.downloadBlob(blob,`Berita Acara - ${data.order_number}.pdf`)
        this.notifikasi("success", 'Sukses Export PDF', "1")
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
    clearForm() {
      this.inputDataBeritaAcara.id_berita_acara = ''
      this.inputDataBeritaAcara.order_number = ''
      this.inputDataBeritaAcara.penjelasan = ''
      this.inputDataBeritaAcara.request_by = ''
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