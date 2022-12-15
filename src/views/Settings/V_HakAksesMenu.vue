<template>
  <div>
		<h1 class="subheading grey--text">Panel Hak Akses Menu</h1>
		<v-row no-gutters class="pa-2">
			<v-col cols="12" md="6" />
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
				:items="DataHakAksesMenu"
				:single-expand="singleExpand"
				:expanded.sync="expanded"
				show-expand
				item-key="idRoleMenu"
				hide-default-footer
				class="elevation-1"
				:page.sync="page"
				:items-per-page="itemsPerPage"
				@page-count="pageCount = $event"
			>
				<template #[`item.number`]="{ item }">
					{{ DataHakAksesMenu.indexOf(item) + 1 }}
				</template>
				<template #[`item.menu`]="{ item }">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							Detail <v-icon small v-bind="attrs" v-on="on">info</v-icon>
						</template>
						<div v-if="item.menu.length">
							<div v-for="(val, i) in item.menu" :key="i">
								{{ val.menuText }}
							</div>
						</div>
						<span v-else>Tidak ada Menu</span>
					</v-tooltip>
				</template>
				<template #expanded-item="{ headers, item }">
					<td :colspan="headers.length" class="white">
						<v-btn
							:value="item.idRoleMenu"
							color="#0bd369"
							small
							dark
							dense
							class="ma-2"
							@click="bukaDialog(item)"
						>
						<v-icon>edit</v-icon>	Ubah
						</v-btn> 
						<v-divider />
					</td>
				</template>
			</v-data-table>
		</div>
		<v-row>
			<v-col cols="12" class="mt-2 pa-2 px-5">
				<v-pagination
					v-if="DataHakAksesMenu.length > 0"
					v-model="page"
					:length="pageCount"
					:total-visible="7"
				/>
			</v-col>
		</v-row>
		<v-dialog
      v-model="DialogRoleMenu"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="light-blue darken-3"
        >
          <v-toolbar-title>Ubah Data Hak Akses Menu</v-toolbar-title>
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
                  Role Name
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
									<v-autocomplete
										v-model="inputRoleMenu.menu"
										:items="menuOptions"
										placeholder="Pilih Menu"
										label="Pilih Menu"
										item-text="menuText"
										item-value="idMenu"
										multiple
										outlined
										hide-details
										dense
										clearable
										@change="addData($event)"
									>
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
												{{ data.item.menuText }}
											</v-chip>
										</template>
									</v-autocomplete>
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
                  color="light-blue darken-3"
                  class="white--text text--darken-2"
                  small
                  dense
                  depressed
                  @click="SimpanForm()"
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
  name: 'HakAksesMenu',
	components: { PopUpNotifikasiVue },
  data: () => ({
    isLoading: false,
		DataHakAksesMenu: [],
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
      { text: "Nama Role", value: "namaRole", sortable: false },
      { text: "Menu", value: "menu", sortable: false },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
		menuOptions: [],
		DialogRoleMenu: false,
		kondisiTombol: true,
		editedIndex: 0,
		inputRoleMenu: {
			id_role_menu: '',
			id_role: '',
			menu: '',
			kumpulanMenu: '',
		},

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  metaInfo: {
		title: "Settings (Hak Akses Menu) - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	mounted() {
		this.getHakAksesMenu();
	},
	methods: {
		...mapActions(["fetchData"]),
		getHakAksesMenu() {
			this.isLoading = true
			let payload = {
				method: "get",
				url: `settings/getRoleMenu`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.DataHakAksesMenu = res.data.result;
				this.isLoading = false
			})
			.catch((err) => {
				this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		getMenu() {
			let payload = {
				method: "get",
				url: `settings/getMenu`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.menuOptions = res.data.result;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		bukaDialog(item){
			this.getMenu()
			this.inputRoleMenu.id_role_menu = item.idRoleMenu
			this.inputRoleMenu.id_role = item.idRole
			let kumpul = [], kumpulMenu = []
			item.menu.map(el => {
				kumpulMenu.push({
					kategori: el.kategori,
					idMenu: el.idMenu,
				})
				kumpul.push(el.idMenu)
			})
			this.inputRoleMenu.menu = kumpul
			this.inputRoleMenu.kumpulanMenu = kumpulMenu
      this.DialogRoleMenu = true
    },
		tutupDialog(){
			this.inputRoleMenu.id_role_menu = ''
			this.inputRoleMenu.id_role = ''
			this.inputRoleMenu.menu = ''
			this.inputRoleMenu.kumpulanMenu = ''
			this.DialogRoleMenu = false
		},
		SimpanForm() {
			const menu = [];
      for (let i = 0; i < this.inputRoleMenu.kumpulanMenu.length; i++) {
        menu.push({
					kategori: this.inputRoleMenu.kumpulanMenu[i].kategori,
					idMenu: this.inputRoleMenu.kumpulanMenu[i].idMenu,
				});
      }
			let bodyData = {
        id_role_menu: this.inputRoleMenu.id_role_menu,
        id_role: this.inputRoleMenu.id_role,
        menu: menu,
      }
      let payload = {
				method: "post",
				url: `settings/postRoleMenu`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.DialogRoleMenu = false
        this.getHakAksesMenu()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		remove(item) {
      this.inputRoleMenu.menu.splice(this.inputRoleMenu.menu.indexOf(item.idMenu), 1);
			this.getMenu()
			let kumpul = []
			this.inputRoleMenu.menu.map(val => {
				let data = this.menuOptions.filter(menu => menu.idMenu == val)[0]
				kumpul.push({
					kategori: data.kategori,
					idMenu: data.idMenu,
				})
			})
			this.inputRoleMenu.kumpulanMenu = kumpul
    },
		addData(idMenu) {
			this.getMenu()
			let kumpul = []
			idMenu.map(val => {
				let data = this.menuOptions.filter(menu => menu.idMenu == val)[0]
				kumpul.push({
					kategori: data.kategori,
					idMenu: data.idMenu,
				})
			})
			this.inputRoleMenu.kumpulanMenu = kumpul
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