<template>
  <div>
    <h1>{{ $t("carshare.title") }}</h1>
    <ListCarshares />
  </div>
</template>

<script>
import ListCarshares from "../components/ListCarshares.vue";
export default {
  name: "Carshare",
  components: { ListCarshares },
};
</script>

<style lang="scss" scoped></style>
