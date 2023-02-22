<template>
  <div>
		<h1 class="subheading grey--text">Panel Menu</h1>
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
					<v-icon small>add</v-icon> Tambah
				</v-btn>
				<v-btn
					color="light-blue darken-3"
					small
					dense
					depressed
					class="ma-2 white--text text--darken-2"
					@click.stop="bukaDialogSet()"
				>
					<v-icon small>settings</v-icon>	Set Urutan Menu
				</v-btn>
			</v-col>
			<v-col cols="12" md="6">
				<v-text-field
					v-model="searchData"
					append-icon="mdi-magnify"
					label="Pencarian..."
					single-line
					hide-details
					solo
					color="light-blue darken-3"
					clearable
          @keyup.enter="getMenu(1, limit, searchData)"
				/>
			</v-col>
    </v-row>
    <div class="px-1">
			<v-data-table
				loading-text="Sedang memuat... Harap tunggu"
				no-data-text="Tidak ada data yang tersedia"
				no-results-text="Tidak ada catatan yang cocok ditemukan"
				:headers="headers"
				:loading="isLoading"
				:items="DataMenu"
				:single-expand="singleExpand"
				:expanded.sync="expanded"
				show-expand
				item-key="idMenu"
				hide-default-footer
				class="elevation-1"
				:items-per-page="itemsPerPage"
				@page-count="pageCount = $event"
			>
				<template #[`item.number`]="{ item }">
					{{ DataMenu.indexOf(item) + 1 }}
				</template>
				<template #[`item.menuIcon`]="{ item }">
					<v-icon midle>{{ item.menuIcon }}</v-icon>
				</template>
				<template #[`item.statusAktif`]="{ item }">
					<v-icon small v-if="item.statusAktif === true" color="green">check</v-icon>
					<v-icon small v-else-if="item.statusAktif == false" color="red">clear</v-icon>
					<br>
					<span v-html="item.statusAktif == true ? 'Active' : 'Non Active'" /> 
				</template>
				<template #expanded-item="{ headers, item }">
					<td :colspan="headers.length" class="white">
						<v-btn
							:value="item.idMenu"
							color="#0bd369"
							small
							dark
							dense
							class="ma-2"
							@click="bukaDialog(item, 1)"
						>
						<v-icon>edit</v-icon>	Ubah
						</v-btn> 
						<v-btn
							v-if="item.statusAktif == false"
							:value="item.idMenu"
							color="#0bd369"
							small
							dark
							dense
							class="ma-2"
							@click="StatusRecord(item, 1)"
						>
						<v-icon>visibility</v-icon>	Active
						</v-btn> 
						<v-btn
							v-else-if="item.statusAktif == true"
							:value="item.idMenu"
							color="#0bd369"
							small
							dark
							dense
							class="ma-2"
							@click="StatusRecord(item, 0)"
						>
						<v-icon>visibility_off</v-icon>	Non Active
						</v-btn> 
						<v-btn
							:value="item.idMenu"
							color="#bd3a07"
							small
							dark
							dense
							class="ma-2"
							@click="HapusRecord(item)"
						>
						<v-icon>delete</v-icon>	Hapus
						</v-btn> 
						<v-divider />
					</td>
				</template>
			</v-data-table>
		</div>
		<v-row>
			<!-- <v-col cols="12" class="mt-2 pa-2 px-5">
				<v-pagination
					v-if="DataMenu.length > 0"
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
						outlined
						dense
						hide-details
						:disabled="DataMenu.length ? false : true"
					/>
					<v-icon
						style="cursor: pointer;"
						large
						:disabled="DataMenu.length ? pageSummary.page != 1 ? false : true : true"
						@click="getMenu(pageSummary.page - 1, limit, searchData)"
					>
						keyboard_arrow_left
					</v-icon>
					<v-icon
						style="cursor: pointer;"
						large
						:disabled="DataMenu.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
						@click="getMenu(pageSummary.page + 1, limit, searchData)"
					>
						keyboard_arrow_right
					</v-icon>
				</div>
			</v-col>
		</v-row>
		<v-dialog
      v-model="DialogMenu"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>{{editedIndex == 0 ? 'Tambah' : editedIndex == 1 ? 'Ubah' : 'View'}} Data Menu</v-toolbar-title>
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
        <v-card>
          <div class="scrollText">
            <div class="px-5">
              <v-divider />
            </div>
            <v-card-text>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center font-weight-bold"
                >
                  Kategori Menu
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
									<v-autocomplete
										v-model="inputMenu.kategori"
										:items="kategoriOptions"
										item-text="text"
										item-value="value"
										placeholder="Kategori Menu"
										label="Kategori Menu"
										outlined
										dense
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
                  Menu Text
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputMenu.menu_text"
                    placeholder="Menu Text"
                    outlined
                    dense
                    label="Menu Text"
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
                  Menu Route
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputMenu.menu_route"
                    placeholder="Menu Route"
                    outlined
                    dense
                    label="Menu Route"
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
                  Menu Icon
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="inputMenu.menu_icon"
                    placeholder="Menu Icon"
                    outlined
                    dense
                    label="Menu Icon"
                    color="light-blue darken-3"
                    hide-details
                    clearable
                  />
                </v-col>
              </v-row>
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
      </v-card>
    </v-dialog>
		<v-dialog
      v-model="DialogSet"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Set Urutan Menu</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="() => { DialogSet = false }"
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
								<v-tab key="utama">
									MENU UTAMA ({{ Utama.length }})
								</v-tab>
								<v-tab key="DNM">
									MENU DNM ({{ DNM.length }})
								</v-tab>
							</v-tabs>
							<v-tabs-items v-model="tab">
								<v-tab-item key="utama">
									<v-card class="pa-1" elevation="0">
                    <v-container>
                      <v-flex>
                        <v-toolbar color="light-blue darken-3" dark>
                          <v-toolbar-title>Menu Utama</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-btn icon @click="actionUtama('edit')" v-if="!editingUtama">
                            <v-icon>sort</v-icon>
                          </v-btn>
                          <v-btn icon @click="actionUtama('done')" v-if="editingUtama">
                            <v-icon>done</v-icon>
                          </v-btn>
                          <v-btn icon @click="actionUtama('undo')" v-if="editingUtama">
                            <v-icon>close</v-icon>
                          </v-btn>
                        </v-toolbar>
                        <v-list two-line>
                          <draggable v-bind="optionsUtama" v-model="Utama" class="kotakDrag">
                            <v-list-item v-for="v in Utama" :key="v.idMenu" class="kotak">
                              <v-list-item-avatar color="white">
                                <v-icon small>{{ v.menuIcon }}</v-icon>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title>{{ v.menuText }}</v-list-item-title>
                                <v-list-item-subtitle style="color: white !important;">{{ v.menuRoute }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </draggable>
                        </v-list>
                      </v-flex>
                    </v-container>
                  </v-card>
                </v-tab-item>
								<v-tab-item key="DNM">
                  <v-card class="mt-2 mb-2 pa-1" elevation="0">
                    <v-container>
                      <v-flex>
                        <v-toolbar color="light-blue darken-3" dark>
                          <v-toolbar-title>Menu DNM</v-toolbar-title>
                          <v-spacer></v-spacer>
                          <v-btn icon @click="actionDNM('edit')" v-if="!editingDNM">
                            <v-icon>sort</v-icon>
                          </v-btn>
                          <v-btn icon @click="actionDNM('done')" v-if="editingDNM">
                            <v-icon>done</v-icon>
                          </v-btn>
                          <v-btn icon @click="actionDNM('undo')" v-if="editingDNM">
                            <v-icon>close</v-icon>
                          </v-btn>
                        </v-toolbar>
                        <v-list two-line>
                          <draggable v-bind="optionsDNM" v-model="DNM" class="kotakDrag">
                            <v-list-item v-for="v in DNM" :key="v.idMenu" class="kotak">
                              <v-list-item-avatar color="white">
                                <v-icon small>{{ v.menuIcon }}</v-icon>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title>{{ v.menuText }}</v-list-item-title>
                                <v-list-item-subtitle style="color: white !important;">{{ v.menuRoute }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </draggable>
                        </v-list>
                      </v-flex>
                    </v-container>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </div>
          <v-divider />
          <v-card-actions class="pa-5"/>
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
import PopUpNotifikasiVue from "../Layout/PopUpNotifikasi.vue";
import draggable from "vuedraggable";
export default {
  name: 'Menu',
	components: { PopUpNotifikasiVue, draggable },
  data: () => ({
		tab: "",
    isLoading: false,
		DataMenu: [],
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
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "#", value: "data-table-expand", sortable: false, width: "5%" },
      { text: "Nama Menu", value: "menuText", sortable: false },
      { text: "Nama Route", value: "menuRoute", sortable: false },
      { text: "Nama Icon", value: "menuIcon", sortable: false },
      { text: "Status", value: "statusAktif", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		kategoriOptions: [
			{ value: "utama", text: "Utama" },
			{ value: "dnm", text: "DNM" },
		],
		DialogMenu: false,
		DialogSet: false,
		kondisiTombol: true,
		editedIndex: 0,
		inputMenu: {
      id_menu: '',
			kategori: '',
			menu_text: '',
			menu_route: '',
			menu_icon: '',
		},
    Utama: [],
    DNM: [],
    beforeUtama: null,
		editingUtama: false,
    beforeDNM: null,
		editingDNM: false,
    
		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  metaInfo: {
		title: "Settings (Menu) - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
  computed: {
		optionsUtama () {
			return {
				disabled: !this.editingUtama
			}
		},
		optionsDNM () {
			return {
				disabled: !this.editingDNM
			}
		}
  },
	watch: {
    inputMenu: {
      deep: true,
      handler(value){
				if(value.kategori == null){ this.inputMenu.kategori = '' }
				if(value.menu_text == null){ this.inputMenu.menu_text = '' }
				if(value.menu_route == null){ this.inputMenu.menu_route = '' }
				if(value.menu_icon == null){ this.inputMenu.menu_icon = '' }
        
        if(value.kategori != '' && value.menu_text != '' && value.menu_route != '' && value.menu_icon != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true
        }
      }
    },
    limit: {
			deep: true,
			handler(value) {
				this.getMenu(1, value, this.searchData)
			}
		},
  },
	mounted() {
		this.getMenu(1, this.limit, this.searchData);
	},
	methods: {
		...mapActions(["fetchData"]),
		getMenu(page = 1, limit, keyword) {
      this.itemsPerPage = limit
			this.isLoading = true
      this.DataMenu = []
			this.pageSummary = {
				page: '',
				limit: '',
				total: '',
				totalPages: ''
			}
      this.Utama = []
      this.DNM = []
			let payload = {
				method: "get",
				url: `settings/getMenu?page=${page}&limit=${limit}${keyword ? `&keyword=${keyword}` : ''}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        let resdata = res.data.result
				this.DataMenu = resdata.records
				this.pageSummary = {
					page: resdata.pageSummary.page,
					limit: resdata.pageSummary.limit,
					total: resdata.pageSummary.total,
					totalPages: resdata.pageSummary.totalPages
				}
        this.DataMenu.map(val => { 
          if(val.kategori === 'utama'){
            this.Utama.push(val)
          }else if(val.kategori === 'dnm'){
            this.DNM.push(val)
          }
        })
        this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
        this.DataMenu = []
        this.pageSummary = {
          page: '',
          limit: '',
          total: '',
          totalPages: ''
        }
        this.Utama = []
        this.DNM = []
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item, index){
      this.editedIndex = index
      if(index == 0){
        this.inputMenu.id_menu = ''
        this.inputMenu.kategori = ''
        this.inputMenu.menu_text = ''
        this.inputMenu.menu_route = ''
        this.inputMenu.menu_icon = ''
      }else{
				this.inputMenu.id_menu = item.idMenu
				this.inputMenu.kategori = item.kategori
        this.inputMenu.menu_text = item.menuText
        this.inputMenu.menu_route = item.menuRoute
        this.inputMenu.menu_icon = item.menuIcon
      }
      this.DialogMenu = true
    },
    bukaDialogSet(){
      this.DialogSet = true
    },
		tutupDialog(){
			this.inputMenu.id_menu = ''
			this.inputMenu.kategori = ''
			this.inputMenu.menu_text = ''
			this.inputMenu.menu_route = ''
			this.inputMenu.menu_icon = ''
			this.DialogMenu = false
		},
		SimpanForm(index) {
      let bodyData = {
        jenis: index == 0 ? 'ADD' : 'EDIT',
        id_menu: index == 0 ? '' : this.inputMenu.id_menu,
        kategori: this.inputMenu.kategori,
        menu_text: this.inputMenu.menu_text,
        menu_route: this.inputMenu.menu_route,
        menu_icon: this.inputMenu.menu_icon,
      }
      let payload = {
				method: "post",
				url: `settings/postMenu`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogMenu = false
        this.getMenu(1, this.limit, this.searchData);
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    HapusRecord(item) {
      let bodyData = {
        jenis: 'DELETE',
        id_menu: item.idMenu,
      }
      let payload = {
				method: "post",
				url: `settings/postMenu`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogMenu = false
        this.getMenu(1, this.limit, this.searchData);
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    StatusRecord(item, status_aktif) {
      let bodyData = {
        jenis: 'STATUSRECORD',
        id_menu: item.idMenu,
        status_aktif: status_aktif,
      }
      let payload = {
				method: "post",
				url: `settings/postMenu`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogMenu = false
        this.getMenu(1, this.limit, this.searchData);
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    SimpanSequenceMenu(kategori) {
      let payload = {
				method: "post",
				url: `settings/postSequenceMenu`,
        body: {
          Menu : kategori === 'utama' ? this.Utama : this.DNM
        },
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.getMenu(1, this.limit, this.searchData);
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    actionUtama (e) {
      if (e === 'edit') {
        this.beforeUtama = Object.assign([],this.Utama)
      }      
      if (e === 'undo') {
        this.Utama = this.beforeUtama
        this.beforeUtama = null
      }
      if (e === 'done') {
        this.SimpanSequenceMenu('utama')
        this.beforeUtama = null
      }
      this.editingUtama = !this.editingUtama
    },
    actionDNM (e) {
      if (e === 'edit') {
        this.beforeDNM = Object.assign([],this.DNM)
      }      
      if (e === 'undo') {
        this.DNM = this.beforeDNM
        this.beforeDNM = null
      }
      if (e === 'done') {
        this.SimpanSequenceMenu('dnm')
        this.beforeDNM = null
      }
      this.editingDNM = !this.editingDNM
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
.kotak {
	border: 2px dashed #000;
	border-radius: 10px;
	text-align: justify;
	background: rgb(98, 97, 97);
	color: rgb(255, 255, 255) !important;
	margin: 2px;
  /* padding: 2px; */
  font-size: 12pt;
}
.kotakDrag {
	border: 2px solid #000;
	border-radius: 10px;
	background: #FFF;
	margin: 2px;
  font-size: 12pt;
}
</style>