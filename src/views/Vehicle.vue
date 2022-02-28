<template>
  <div>
    <h1>{{ $t("vehicle.title") }}</h1>
    <ListVehicles />
  </div>
</template>

<script>
import ListVehicles from "../components/ListVehicles.vue";
export default {
    name: "Vehicle",
    components: { ListVehicles }
};
</script>

<style lang="scss" scoped></style>
