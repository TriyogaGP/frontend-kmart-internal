<template>
	<nav>
		<v-app-bar color="light-blue darken-3" dark app>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			<v-spacer />
			<v-menu
				open-on-hover
				rounded="t-xs b-lg"
				offset-y
				transition="slide-y-transition"
				bottom
			>
				<template v-slot:activator="{ attrs, on }">
					<span
						class="white--text ma-5 UserPanel"
						v-bind="attrs"
						v-on="on"
					>
						{{nama}}
						<v-avatar size="35">
							<v-img src="../../public/avatar.png"></v-img>
						</v-avatar>
					</span>
				</template>

				<v-list dense>
					<v-list-item
						v-for="(link, index) in links"
						:key="index"
						router :to="link.route"
						class="SelectedMenu"
						active-class="SelectedMenu-active"
					>
						<v-list-item-title>
							<span>{{link.text}}</span>
						</v-list-item-title>
						<v-icon right>{{link.icon}}</v-icon>
					</v-list-item>
					<v-list-item
						@click="keluar"
						class="SelectedMenu"
						active-class="SelectedMenu-active"
					>
						<v-list-item-title>
							<span>Keluar</span>
						</v-list-item-title>
						<v-icon right>exit_to_app</v-icon>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>
		<v-navigation-drawer v-model="drawer" dark app class="light-blue darken-3">
			<div class="customScroll">
				<v-layout column align-center>
					<v-flex class="mt-5">
						<v-toolbar-title class="white--text subheading mt-1 text-center text-uppercase">
							<span>&nbsp;DNM Mobile</span>
						</v-toolbar-title>
						<div class="d-flex flex-column justify-space-between align-center">
							<v-avatar size="100">
								<v-img src="../../public/logo.png" width="100%" />
							</v-avatar>
						</div>
					</v-flex>
				</v-layout>
				<v-list dense>
					<v-list-item
						router to="/dashboard"
						class="SelectedTile"
						active-class="SelectedTile-active"
					>
						<v-list-item-title>
							<span class="menufont">Dashboard</span>
						</v-list-item-title>
						<v-icon right>dashboard</v-icon>
					</v-list-item>
					<v-list-group
						:value="false"
						class="SelectedTile"
						active-class="SelectedTile-active"
					>
						<template v-slot:activator>
							<v-list-item-content style="color: white;">
								<v-list-item-title class="menufont">Proses Data</v-list-item-title>
							</v-list-item-content>
						</template>
	
						<v-list-item
							v-for="(link) in sortLinksNav"
							:key="link.menuRoute"
							router :to="link.menuRoute"
							class="SelectedTile"
							active-class="SelectedTile-active"
						>
							<v-list-item-title>
								<span class="menufont" style="margin-left: 20px;">{{link.menuText}}</span>
							</v-list-item-title>
							<v-icon right>{{link.menuIcon}}</v-icon>
						</v-list-item>
					</v-list-group>
					<v-list-group
						v-if="linksNavKmart.length"
						:value="false"
						class="SelectedTile"
						active-class="SelectedTile-active"
					>
						<template v-slot:activator>
							<v-list-item-content style="color: white;">
								<v-list-item-title class="menufont">Menu DNM</v-list-item-title>
							</v-list-item-content>
						</template>
	
						<v-list-item
							v-for="(linkKmart) in sortLinksNavKmart"
							:key="linkKmart.menuRoute"
							router :to="linkKmart.menuRoute"
							class="SelectedTile"
							active-class="SelectedTile-active"
						>
							<v-list-item-title>
								<span class="menufont" style="margin-left: 20px;">{{linkKmart.menuText}}</span>
							</v-list-item-title>
							<v-icon right>{{linkKmart.menuIcon}}</v-icon>
						</v-list-item>
					</v-list-group>
					<v-list-item
						v-if="roleID == 1"
						router to="/settings"
						class="SelectedTile"
						active-class="SelectedTile-active"
					>
						<v-list-item-title>
							<span class="menufont">Settings</span>
						</v-list-item-title>
						<v-icon right>settings</v-icon>
					</v-list-item>
				</v-list>
			</div>
		</v-navigation-drawer>
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
				@proses="goToProses"
				@cancel="dialogNotifikasi = false"
			/>
		</v-dialog>
	</nav>
</template>

<script>
import { mapActions } from "vuex";
import PopUpNotifikasiVue from "../views/Layout/PopUpNotifikasi.vue";
export default {
	components: {
    PopUpNotifikasiVue
  },
	data: () => ({
		drawer: true,
		links: [
			{text: 'Profile', route: '/profile', icon: 'person'},
		],
		linksNav: [
			// {text: 'Data Administrator', route: '/dataAdmin', icon: 'person'},
			// {text: 'Data Harian', route: '/dataHarian', icon: 'list'},
			// {text: 'Data Order', route: '/dataOrder', icon: 'list'},
			// {text: 'Data NonCod Stack', route: '/dataStack', icon: 'list'},
			// {text: 'Data Product Order Summary', route: '/dataProductOrderSummary', icon: 'list'},
			// {text: 'Data Variant Product', route: '/dataVariantProduct', icon: 'list'},
			// {text: 'Hit Manual Order', route: '/hitManualOrder', icon: 'bolt'},
		],
		linksNavKmart: [
			// {text: 'Data User Install & Acquisition', route: '/dataUserInstallAcquisition', icon: 'list'},
			// {text: 'Data Transaksi Detail', route: '/dataTransaksiDetail', icon: 'list'},
			// {text: 'Data Transaksi Summary', route: '/dataTransaksiDetailSummary', icon: 'list'},
			// {text: 'Data Product', route: '/dataProduct', icon: 'list'},
			// {text: 'Data Product Summary', route: '/dataProductSummary', icon: 'list'},
			// {text: 'Data Customer By Area', route: '/dataCustomerByArea', icon: 'list'},
			// {text: 'Data Customer Sales By Area', route: '/dataCustomerSalesByArea', icon: 'list'},
		],
		roleID: '',
		nama: '',

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	computed: {
		sortLinksNav: function() {
			function compare(a, b) {
				if (a.menuSequence < b.menuSequence)
					return -1;
				if (a.menuSequence > b.menuSequence)
					return 1;
				return 0;
			}

			return this.linksNav.sort(compare);
		},
		sortLinksNavKmart: function() {
			function compare(a, b) {
				if (a.menuSequence < b.menuSequence)
					return -1;
				if (a.menuSequence > b.menuSequence)
					return 1;
				return 0;
			}

			return this.linksNavKmart.sort(compare);
		},
	},
	mounted() {
		if(!localStorage.getItem('user_token')) return this.$router.push({name: 'Login'});
		this.nama = localStorage.getItem('nama')
		this.roleID = localStorage.getItem('roleID')
		this.getData()
	},
	methods: {
		...mapActions(["fetchData"]),
    getData() {
      let payload = {
				method: "get",
				url: `settings/getRoleMenu?id_role=${this.roleID}`,
				authToken: localStorage.getItem('user_token')
			};
			this.fetchData(payload)
			.then((res) => {
				let resdata = res.data.result
				let records = resdata.records
				let menu = records[0].menu
				menu.map(val => {
					if(val.kategori == 'utama'){
						this.linksNav.push(val)
					}else if(val.kategori == 'dnm'){
						this.linksNavKmart.push(val)
					}
				})
				// console.log(this.linksNav, this.linksNavKmart);
			})
			.catch((err) => {
				this.notifikasi("warning", err.response.data.message, "2")
			});
		},
		keluar() {
			this.notifikasi("question", "Apakah anda yakin ingin keluar ?", "2")
		},
		goToProses(){
			localStorage.removeItem('user_token');
			localStorage.removeItem('nama');
			localStorage.removeItem('nama_role');
			localStorage.removeItem('roleID');
			localStorage.removeItem('idLogin');
			// localStorage.removeItem('siteLogin');
			this.$router.push({name: "Login"});
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
.menufont {
	font-size: 11px !important;
	color: #FFFFFF;
}
.SelectedTile:hover {
	border-radius: 2px;
	background: #44a4d0ae;
	color: white;
}
.SelectedTile-active {
	border-radius: 2px;
	background: rgba(10, 204, 117, 0.694);
	color: white;
}
.SelectedMenu:hover {
	border-radius: 2px;
	background: #939494
}
.SelectedMenu-active {
	border-radius: 2px;
	background: rgba(132, 131, 195, 0.19)
}
.SelectedMenuNotif:hover {
	border-radius: 2px;
	background: #939494;
	cursor: pointer;
}
.SelectedMenuNotif-active {
	border-radius: 2px;
	background: rgba(132, 131, 195, 0.19);
	cursor: pointer;
}
.badgeNotif {
	cursor: pointer;
}
.UserPanel {
	cursor: pointer;
}
.scrollNotif{
  max-height: 500px !important;
  overflow-y: auto !important;
}
.judulNotif {
	margin-bottom: 2px !important;
	font-size: 14px;
	font-weight: bold;
}
.pesanNotif {
	margin-bottom: 2px !important;
	font-size: 12px;
	font-weight: 500;
	text-align: justify;
}
.tanggalNotif {
	margin-bottom: 1px !important;
	font-size: 10px;
	font-weight: 500;
	text-align: right;
	font-style: italic;
}
.kondisiNotif {
	margin-bottom: 1px !important;
	font-size: 10px;
	text-align: right;
	font-style: italic;
}
.theme--dark.v-icon {
	color: #FFFFFF !important;
}
.customScroll {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.customScroll::-webkit-scrollbar {
  width: 16px;
}
.customScroll::-webkit-scrollbar-thumb {
  background-color: rgba(10, 204, 117, 0.694);
  border: 5px solid #0277bd;
  border-radius: 10rem;
}
.customScroll::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
</style>