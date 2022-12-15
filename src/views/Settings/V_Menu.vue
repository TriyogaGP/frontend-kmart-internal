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
					<v-icon small>add</v-icon>	Tambah
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
				/>
			</v-col>
    </v-row>
    <div class="px-1">
			<v-data-table
				loading-text="Sedang memuat... Harap tunggu"
				no-data-text="Tidak ada data yang tersedia"
				no-results-text="Tidak ada catatan yang cocok ditemukan"
				:options.sync="query"
				:headers="headers"
				:search="searchData"
				:loading="isLoading"
				:items="DataMenu"
				:single-expand="singleExpand"
				:expanded.sync="expanded"
				show-expand
				item-key="idMenu"
				hide-default-footer
				class="elevation-1"
				:page.sync="page"
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
			<v-col cols="12" class="mt-2 pa-2 px-5">
				<v-pagination
					v-if="DataMenu.length > 0"
					v-model="page"
					:length="pageCount"
					:total-visible="7"
				/>
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
export default {
  name: 'Menu',
	components: { PopUpNotifikasiVue },
  data: () => ({
    isLoading: false,
		DataMenu: [],
		page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    expanded: [],
    singleExpand: true,
		searchData: "",
    query: {
      limit: 10,
      sort: ["-created_at"],
      page: 1,
      filter: "",
    },
		headers: [
      { text: "No", value: "number", sortable: false, width: "7%" },
      { text: "", value: "data-table-expand", sortable: false, width: "5%" },
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
		kondisiTombol: true,
		editedIndex: 0,
		inputMenu: {
			id_menu: '',
			kategori: '',
			menu_text: '',
			menu_route: '',
			menu_icon: '',
		},

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
  },
	mounted() {
		this.getMenu();
	},
	methods: {
		...mapActions(["fetchData"]),
		getMenu() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `settings/getMenu`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataMenu = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
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
        this.getMenu()
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
        this.getMenu()
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
        this.getMenu()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
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
</style>