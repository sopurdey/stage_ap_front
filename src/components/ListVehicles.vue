<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="vehicles"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ $t("vehicle.table-title") }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ $t("vehicle.form-title") }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.numberPlate"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.brand"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.model"
                        label="Model"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.category"
                        label="Category"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nbSeats"
                        label="Seats"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.status"
                        label="Status"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.photoUrl"
                        label="Photo"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error darken-3" text @click="close">
                  {{ $t("btn.cancel") }}
                </v-btn>
                <v-btn color="success darken-3" text @click="save">
                  {{ $t("btn.save") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title wrap class="text-h5">{{
                $t("vehicle.confirm-del")
              }}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error darken-1" text @click="closeDelete">
                  {{ $t("btn.cancel") }}
                </v-btn>
                <v-btn color="success darken-1" text @click="deleteItemConfirm">
                  {{ $t("btn.ok") }}
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          x-small
          color="success darken-1"
          class="mr-2"
          @click="editItem(item)"
        >
          {{ $t("btn.edit") }}
        </v-btn>
        <v-btn x-small color="error darken-1" @click="deleteItem(item)">
          {{ $t("btn.delete") }}
        </v-btn>
      </template>
      <template v-slot:no-data>
        <v-btn color="blue darken-1" text @click="closeDelete">
          {{ $t("btn.cancel") }}
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import VehicleApi from "../services/VehicleAPi";

export default {
  name: "ListVehicles",
  data() {
    return {
      vehicles: this.getVehicles(),
      currentItem: {},
      dialog: false,
      dialogDelete: false,
      defaultItem: {
        numberPlate: "",
        brand: "",
        model: "",
        category: "",
        nbSeats: 0,
        status: "",
        photoUrl: "",
        reservations: [],
      },
      editedIndex: -1,
      editedItem: {
        numberPlate: "",
        brand: "",
        model: "",
        category: "",
        nbSeats: 0,
        status: "",
        photoUrl: "",
        reservations: [],
      },
      headers: [
        { text: this.$t('vehicle.numberPlate'), align: "center", value: "numberPlate" },
        { text: this.$t('vehicle.brand'), align: "center", value: "brand" },
        { text: this.$t('vehicle.model'), align: "center", value: "model" },
        { text: this.$t('vehicle.category'), align: "center", value: "category" },
        { text: this.$t('vehicle.seats'), align: "center", value: "nbSeats" },
        { text: this.$t('vehicle.status'), align: "center", value: "status" },
        { text: this.$t('vehicle.photo'), align: "center", value: "photoUrl" },
        { text: this.$t('label.actions'), align: "center", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    getVehicles() {
      let vehicles = [];
      VehicleApi.getAll().then((response) => {
        let data = response.data;
        for (let el of data) {
          vehicles.push({
            id: el.id,
            numberPlate: el.numberPlate,
            brand: el.brand,
            model: el.model,
            category: el.category,
            nbSeats: el.nbSeats,
            status: el.status,
            photoUrl: el.photoUrl,
            reservations: el.reservations,
          });
          this.vehicles = vehicles;
        }
      });
    },
    editItem(item) {
      this.editedIndex = this.vehicles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    updateRecord(id, item) {
      console.log(item);
      VehicleApi.update(id, item);
      console.log(item);
      this.getVehicles();
    },
    deleteItem(item) {
      this.editedIndex = this.vehicles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.currentItem = item;
      console.log("id à supprimer : " + item.id);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.vehicles.splice(this.vehicles, 1);
      this.deleteRecord();
      this.closeDelete();
    },

    deleteRecord() {
      VehicleApi.delete(this.currentItem.id);
      console.log("id supprimé : " + this.currentItem.id);
      this.currentItem = {};
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.vehicles[this.editedIndex], this.editedItem);
      } else {
        this.vehicles.push(this.editedItem);
      }
      this.close();
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
};
</script>

<style lang="scss" scoped></style>
