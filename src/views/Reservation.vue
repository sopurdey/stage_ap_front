<template>
  <div>
    <h1>{{ $t("reservation.title") }}</h1>
      <ListReservations />
  </div>
</template>

<script>
import ListReservations from "../components/ListReservations.vue";

export default {
    name: "Reservation",
    components: { ListReservations }
};
</script>

<style lang="scss" scoped></style>
