<template>
  <nav>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <NavDrawer />
    </v-navigation-drawer>
    <v-app-bar dark clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $t("app.title") }}</v-toolbar-title>
    </v-app-bar>
  </nav>
</template>

<script>
import NavDrawer from "./NavDrawer.vue";
export default {
  name: "Navbar",
  components: { NavDrawer },
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
