<template>
  <div>
    <v-toolbar />
    <v-list dense>
      <template v-for="(item, i) in items">
        <v-divider dark v-if="item.divider" :key="i"></v-divider>
        <v-list-item ripple :to="item.action" :key="i" v-else>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-if="item.text_key" class="body-2">{{
              $t(item.text_key)
            }}</v-list-item-title>
            <v-divider v-else />
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <v-divider />
    <v-container class="lang-select d-flex justify-space-around">
      <v-btn @click="switchLang('fr')" dark>FR</v-btn>
      <v-btn @click="switchLang('en')" dark>EN</v-btn>
    </v-container>
  </div>
</template>

<script>
import i18n from "../i18n";

export default {
  name: "NavDrawer",
  data() {
    return {
      items: [
        { icon: "mdi-home-outline", text_key: "home.title", action: "/" },
        { icon: "mdi-home-outline", text_key: "vehicle.title", action: "/vehicles" },
      ],
    };
  },
  methods: {
    switchLang(lang) {
      i18n.locale = lang;
    },
  },
};
</script>

<style lang="scss" scoped></style>
