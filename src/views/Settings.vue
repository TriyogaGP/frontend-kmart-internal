<template>
  <div>
    <h1 class="subheading grey--text">Settings</h1>
    <v-container>
			<v-layout row wrap>
        <v-flex sm6 xs12 md6 lg3>
					<v-card class="ma-3" height="100" @click="LinkRoute(1)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>admin_panel_settings</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div class="overline text-right">Hak Akses</div>
								<div><v-divider /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg3>
					<v-card class="ma-3" height="100" @click="LinkRoute(2)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>list</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div class="overline text-right">Menu</div>
								<div><v-divider /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
        <v-flex sm6 xs12 md6 lg3>
					<v-card class="ma-3" height="100" @click="LinkRoute(3)">
						<v-list-item>
							<v-list-item-avatar tile class="mt-n7">
								<v-sheet color="green" width="40" height="40" elevation="6">
									<v-icon dark large>admin_panel_settings</v-icon>
								</v-sheet>
							</v-list-item-avatar>
							<v-list-item-content>
								<div class="overline text-right">Hak Akses Menu</div>
								<div><v-divider /></div>
							</v-list-item-content>
						</v-list-item>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
		<v-divider />
		<v-card v-if="settingPanel != 0" class="mt-2 mb-2 pa-1" outlined elevation="0">
			<V_HakAkses v-if="settingPanel == 1" />
			<V_Menu v-if="settingPanel == 2" />
			<V_HakAksesMenu v-if="settingPanel == 3" />
		</v-card>
  </div>
</template>

<script>
import V_HakAkses from './Settings/V_HakAkses.vue'
import V_Menu from './Settings/V_Menu.vue'
import V_HakAksesMenu from './Settings/V_HakAksesMenu.vue'

export default {
	name: "Settings",
	components: { V_HakAkses, V_Menu, V_HakAksesMenu },
	data: () => ({
		settingPanel: 0,
	}),
	mounted() {
		this.settingPanel = 0
	},
	metaInfo: {
		title: "Settings - DNM Mobile",
		htmlAttrs: {
			lang: "id",
			amp: true,
		},
	},
	methods:{
		LinkRoute(number){
			this.settingPanel = number
		}
	}
}
</script>
