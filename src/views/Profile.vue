<template>
  <div>
    <v-card class="ma-1" style="border: 1px solid #000; border-radius: 5px;">
      <v-row class="ma-1">
        <v-col cols="8" class="kotakleft">
          <v-tabs
            v-model="tab"
            fixed-tabs
            background-color="light-blue darken-3"
            dark
          >
            <v-tab v-for="item in itemsTab" :key="item.code" :href="`#${item.code}`">
              <v-icon left>
                {{ item.icon }}
              </v-icon>
              {{ item.text }}
            </v-tab>
            <v-tab-item value="1">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Nama Lengkap
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="profileData.nama"
                    placeholder="Nama Lengkap"
                    outlined
                    dense
                    label="Nama Lengkap"
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
                  class="pt-2 d-flex align-center"
                >
                  Username
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="profileData.username"
                    placeholder="Username"
                    outlined
                    dense
                    label="Username"
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
                  class="pt-2 d-flex align-center"
                >
                  Email
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="profileData.email"
                    placeholder="Email"
                    outlined
                    dense
                    label="Email"
                    color="light-blue darken-3"
                    :rules="this.profileData.email != '' ? [rules.emailRules] : []"
                    hide-details="auto"
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Kata Sandi
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="profileData.password"
                    placeholder="Kata Sandi"
                    :type="passType ? 'text' : 'password'"
                    outlined
                    dense
                    label="Kata Sandi"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                  >
                    <template v-slot:append>
                      <v-icon
                        :class="editedIndex == 2 && `mr-1`"
                        color="light-blue darken-3"
                        tabindex="-1"
                        @click="onClickVisible('passType')"
                        >{{ passType ? 'visibility' : 'visibility_off' }}</v-icon
                      >
                      <v-icon
                        v-if="editedIndex == 2"
                        color="light-blue darken-3"
                        tabindex="-1"
                        @click="endecryptData('endecryptType')"
                        >{{ endecryptType ? 'lock' : 'lock_open' }}</v-icon
                      >
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Kabupaten / Kota
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-autocomplete
                    v-model="profileData.kota"
                    :items="kotaOptions"
                    item-text="text"
                    item-value="text"
                    placeholder="Kabupaten / Kota"
                    label="Kabupaten / Kota"
                    outlined
                    dense
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
                  class="pt-2 d-flex align-center"
                >
                  No Handphone
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="profileData.noHP"
                    placeholder="No Handphone"
                    outlined
                    dense
                    label="No Handphone"
                    color="light-blue darken-3"
                    @keypress.native="onlyNumber($event, 15, profileData.noHP)"
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
                  class="pt-2 d-flex align-center"
                >
                  Alamat
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-textarea
                    v-model="profileData.alamat"
                    placeholder="Alamat"
                    outlined
                    dense
                    rows="4"
                    label="Alamat"
                    color="light-blue darken-3"
                    hide-details
                    :clearable="editedIndex != 2"
                    :readonly="editedIndex == 2"
                    no-resize
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item value="2">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Kata Sandi Lama
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="authData.passwordLama"
                    placeholder="Kata Sandi Lama"
                    :type="passTypeLama ? 'text' : 'password'"
                    outlined
                    dense
                    label="Kata Sandi Lama"
                    color="light-blue darken-3"
                    hide-details
                    clearable
                  >
                    <template v-slot:append>
                      <v-icon
                        class="mr-1"
                        color="light-blue darken-3"
                        tabindex="-1"
                        @click="onClickVisible('passTypeLama')"
                        >{{ passTypeLama ? 'visibility' : 'visibility_off' }}</v-icon
                      >
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Kata Sandi Baru
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="authData.passwordBaru"
                    placeholder="Kata Sandi Baru"
                    :type="passTypeBaru ? 'text' : 'password'"
                    outlined
                    dense
                    label="Kata Sandi Baru"
                    color="light-blue darken-3"
                    hide-details
                    clearable
                  >
                    <template v-slot:append>
                      <v-icon
                        class="mr-1"
                        color="light-blue darken-3"
                        tabindex="-1"
                        @click="onClickVisible('passTypeBaru')"
                        >{{ passTypeBaru ? 'visibility' : 'visibility_off' }}</v-icon
                      >
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-2 d-flex align-center"
                >
                  Kata Sandi Konfirmasi Baru
                </v-col>
                <v-col
                  cols="12"
                  md="8"
                  class="pt-3"
                >
                  <v-text-field
                    v-model="authData.passwordConfBaru"
                    placeholder="Kata Sandi Konfirmasi Baru"
                    :type="passTypeConfBaru ? 'text' : 'password'"
                    outlined
                    dense
                    label="Kata Sandi Konfirmasi Baru"
                    color="light-blue darken-3"
                    hide-details
                    clearable
                  >
                    <template v-slot:append>
                      <v-icon
                        class="mr-1"
                        color="light-blue darken-3"
                        tabindex="-1"
                        @click="onClickVisible('passTypeConfBaru')"
                        >{{ passTypeConfBaru ? 'visibility' : 'visibility_off' }}</v-icon
                      >
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  cols="12"
                  class="pt-2 d-flex"
                >
                  <v-btn
                    color="light-blue darken-3"
                    class="white--text text--darken-2"
                    small
                    dense
                    depressed
                    :disabled="kondisiTombol"
                    @click="UbahKataSandi()"
                    >
                    Ubah Kata Sandi
                  </v-btn>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs>
        </v-col>
        <v-col cols="4" class="light-blue darken-3 kotakright">
          <v-layout column align-center>
            <v-flex class="mt-5">
              <div class="d-flex flex-column justify-space-between align-center">
                <v-avatar size="100">
                  <v-img src="../../public/avatar.png"></v-img>
                </v-avatar>
              </div>
              <p class="white--text subheading mt-1 text-center"><strong>{{nama}}</strong></p>
              <p class="white--text text-center">{{namaRole}}</p>
            </v-flex>
          </v-layout>
          <v-divider style="border: 1px solid #FFF" />
          <div class="d-flex flex-column justify-space-between align-center mt-3">
            <v-btn
              v-if="roleID === '1'"
              color="green darken-4"
              class="white--text text--darken-2"
              small
              dense
              depressed
              @click="emptyCart()"
            >
              <v-icon style="cursor: pointer;" small>fa-solid fa-window-restore</v-icon>&nbsp;Kosongkan Keranjang
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
			v-model="isLoading"
			transition="dialog-bottom-transition"
			persistent
			width="500px"
		>
			<v-progress-linear
				class="pa-3"
				indeterminate
				color="light-blue darken-3"
			/>
			<h4 style="color: #000; text-align: center; background-color: #FFF;">Sedang proses kosongkan Keranjang, harap menunggu ...</h4>
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

export default {
  name: 'Profile',
  components: { PopUpNotifikasiVue },
  data: () => ({
    nama: '',
    namaRole: '',
    roleID: '',
    profileData: {
      idLogin: '',
      nik: '',
      nama: '',
      username: '',
      email: '',
      password: '',
      kota: '',
      noHP: '',
      alamat: '',
      fotoPeserta: '',
    },
    authData: {
      passwordLama: '',
      passwordBaru: '',
      passwordConfBaru: '',
    },
    isLoading: false,
    kondisiTombol: true,
    dataAddress: [],
    editedIndex: 2,
    passType: '',
    passTypeLama: '',
    passTypeBaru: '',
    passTypeConfBaru: '',
    endecryptType: '',
    kotaOptions: [],
    rules: {
			emailRules: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'email tidak valid'
			},
		},
    itemsTab: [
			{code: '1', text: 'Data Profile', icon: 'mdi-account'},
			{code: '2', text: 'Ubah Kata Sandi', icon: 'mdi-lock'},
		],
		tab: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  watch:{
		tab:{
			handler(value){
				if (value == '1') {
          this.getProfile(localStorage.getItem("idLogin"))
          this.passType = true
          this.endecryptType = false
          this.clearForm()
        }
			}
		},
    authData: {
      deep: true,
      handler(value){
        if(value.passwordLama == null){ this.authData.passwordLama = '' }
        if(value.passwordBaru == null){ this.authData.passwordBaru = '' }
        if(value.passwordConfBaru == null){ this.authData.passwordConfBaru = '' }
  
        if(value.passwordLama != '' && value.passwordBaru != '' && value.passwordConfBaru != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true	
        }
      }
    }
	},
  mounted() {
    this.nama = localStorage.getItem("nama")
    this.namaRole = localStorage.getItem("nama_role")
    this.roleID = localStorage.getItem("roleID")
    this.API_URL = process.env.VUE_APP_NODE_ENV === "production" ? process.env.VUE_APP_VIEW_PROD_API_URL : process.env.VUE_APP_VIEW_DEV_API_URL
    this.getKota()
    this.passType = true
    this.endecryptType = false
    this.passTypeLama = false
    this.passTypeBaru = false
    this.passTypeConfBaru = false
  },
  methods: {
    ...mapActions(["fetchData"]),
		getProfile(id) {
			let payload = {
				method: "get",
				url: `auth/getProfile?id_login=${id}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let data = res.data.result;
        this.profileData = {
          idLogin: data.idAdmin,
          nik: data.nik ? data.nik : '',
          nama: data.nama,
          username: data.username,
          email: data.email,
          password: data.kataSandi,
          kota: data.kota,
          noHP: data.noHP,
          alamat: data.alamat,
        }
			})
			.catch((err) => {
				console.log(err)
			});
		},
    getKota() {
			let payload = {
				method: "get",
				url: `settings/getWilayah?bagian=kabkotaOnly`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				this.kotaOptions = res.data.result;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    UbahKataSandi() {
      // console.log(this.authData);
      let bodyData = {
        jenis: localStorage.getItem('siteLogin'),
        id_login: localStorage.getItem('idLogin'),
        passwordLama: this.authData.passwordLama,
        passwordBaru: this.authData.passwordBaru,
        passwordConfBaru: this.authData.passwordConfBaru,
        create_update_by: localStorage.getItem('idLogin'),
      }
      let payload = {
				method: "post",
				url: `auth/ubahKataSandi`,
        body: bodyData,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then(async (res) => {
				this.clearForm()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    emptyCart() {
      this.isLoading = true
			let payload = {
				method: "get",
				url: `kmart/hitCartEmpty`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
        this.isLoading = false
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.isLoading = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    onClickVisible(d) {
      this[d] = !this[d]
    },
    endecryptData(d) {
      this[d] = !this[d]
      let url = this[d] ? 'decryptPass' : 'encryptPass' 
      let payload = {
				method: "get",
				url: `settings/${url}?kata=${this.profileData.password}`,
				authToken: localStorage.getItem('user_token')
			};
      this.profileData.password = ''
			this.fetchData(payload)
			.then((res) => {
				this.profileData.password = res.data.result.hasil;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    clearForm(){
      this.authData = {
        passwordLama: '',
        passwordBaru: '',
        passwordConfBaru: '',
      }
    },
		notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  },
  metaInfo: {
		title: "Profile - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
}
</script>
<style>
.kotakleft {
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
  border-right: 2px solid #000;
}
.kotakright {
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
  padding: 10px;
}
.kotak {
	border: 2px dashed #000;
	border-radius: 5px;
	text-align: justify;
	background: #FFF;
	color: #000;
	margin: 5px;
  padding: 5px;
  font-size: 9pt;
}
.scrollText{
  max-height: 350px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}
.v-tab {
	font-size: 8pt !important;
	font-weight: bold !important;
}
</style>