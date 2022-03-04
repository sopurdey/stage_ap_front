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

          <!-- start modal edit entry -->
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span wrap class="text-h5">{{ $t("vehicle.form-title") }}</span>
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
                      <v-text-field v-model="editedItem.brand"></v-text-field>
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
          <!-- end modal edit entry-->

          <!-- start modal delete -->
          <v-dialog v-model="dialogDelete" max-width="550px">
            <v-card>
              <v-card-title wrap class="text-h5">{{
                $t("form.confirm-del")
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
          <!-- end modal delete -->

          <!-- start modal add entry -->
          <v-dialog v-model="dialogAdd" max-width="600px">
            <v-card>
              <v-card-title>
                <span wrap class="text-h5">{{ $t("form.add-entry") }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="numberPlate"
                          :counter="10"
                          :rules="rules.numberPlate"
                          label="numberPlate"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="brand"
                          :rules="rules.brand"
                          label="Brand"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="carModel"
                          :rules="rules.carModel"
                          label="Model"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="select"
                          :items="selectCat"
                          :rules="rules.category"
                          label="Category"
                        ></v-select>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="nbSeats"
                          :rules="rules.seats"
                          label="Seats"
                        ></v-text-field>
                      </v-col>
                      <v-row class="radioSelect">
                        <v-radio-group row v-model="carStatus" mandatory>
                          <v-col cols="12" sm="12" md="4">
                            <v-radio label="IN_SERVICE" value="IN_SERVICE">
                            </v-radio>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <v-radio
                              label="MAINTENANCE"
                              value="MAINTENANCE"
                            ></v-radio>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <v-radio
                              label="OUT_OF_SERVICE"
                              value="OUT_OF_SERVICE"
                            ></v-radio>
                          </v-col>
                        </v-radio-group>
                      </v-row>

                      <v-col cols="12" sm="12" md="12">
                        <v-row align="center">
                          <v-checkbox
                            v-model="enabled"
                            hide-details
                            class="shrink mr-2 mt-0"
                          ></v-checkbox>
                          <v-text-field
                            v-model="photoUrl"
                            :disabled="!enabled"
                            label="Photo link"
                          ></v-text-field>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-btn-toggle group>
                  <v-btn color="error darken-3" text @click="closeAdd">
                    {{ $t("btn.cancel") }}
                  </v-btn>

                  <v-btn
                    :disabled="!valid"
                    color="success darken-3"
                    text
                    class="mr-4"
                    @click="validate"
                  >
                    {{ $t("btn.submit") }}
                  </v-btn>
                </v-btn-toggle>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- end modal add entry-->
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
    <v-btn @click="addItem" fixed left small color="success darken-1">{{
      $t("btn.add")
    }}</v-btn>
  </div>
</template>

<script>
import VehicleApi from "../services/VehicleAPi";

export default {
  name: "ListVehicles",
  data() {
    return {
      vehicles: this.getVehicles(),
      enabled: false,
      currentItem: {},
      dialog: false,
      dialogAdd: false,
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
        {
          text: this.$t("vehicle.numberPlate"),
          align: "center",
          value: "numberPlate",
        },
        { text: this.$t("vehicle.brand"), align: "center", value: "brand" },
        { text: this.$t("vehicle.model"), align: "center", value: "model" },
        {
          text: this.$t("vehicle.category"),
          align: "center",
          value: "category",
        },
        { text: this.$t("vehicle.seats"), align: "center", value: "nbSeats" },
        { text: this.$t("vehicle.status"), align: "center", value: "status" },
        { text: this.$t("vehicle.photo"), align: "center", value: "photoUrl" },
        {
          text: this.$t("label.actions"),
          align: "center",
          value: "actions",
          sortable: false,
        },
      ],
      newItem: {
        numberPlate: "",
        brand: "",
        model: "",
        category: "",
        nbSeats: 0,
        status: "",
        photoUrl: "",
        reservations: [],
      },
      numberPlate: "",
      brand: "",
      carModel: "",
      nbSeats: 0,
      photoUrl: "",
      reservations: [],
      carStatus: ["IN_SERVICE", "MAINTENANCE", "OUT_OF_SERVICE"],
      selectCat: [
        "MICRO",
        "HATCHBACK",
        "UNIVERSAL",
        "COMPACT",
        "S_SEDAN",
        "M_SEDAN",
        "L_SEDAN",
        "SUV_4X4_PICKUP",
      ],
      select: null,
      valid: true,
      rules: {
        numberPlate: [
          (v) => !!v || "The number plate is required",
          (v) => (v && v.length <= 9) || "Name must be less than 9 characters",
        ],
        brand: [(v) => !!v || "The brand is required"],
        carModel: [(v) => !!v || "The model is required"],
        seats: [(v) => !!v || "Please add the number of seats"],
        category: [(v) => !!v || "The category is required"],
      },
    };
  },
  mounted() {
    this.getVehicles();
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
    refresh() {
      this.getVehicles();
    },
    addItem() {
      console.log("addItem : ");
      this.dialogAdd = true;
    },
    editItem(item) {
      console.log("item to edit : " + item.id);
      this.editedIndex = this.vehicles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    updateRecord(item) {
      console.log("item in update : " + item);
      console.log("id in update : " + item.id);
      VehicleApi.update(item.id, item);
      this.refresh();
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
      this.refresh();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeAdd() {
      this.dialogAdd = false;
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
        console.log("id in save : " + this.editedItem.id);
        this.updateRecord(this.editedItem);
        this.refresh();
      } else {
        console.log("id in save ELSE : " + this.editedItem.id);
        this.updateRecord(this.editedItem);
        this.vehicles.push(this.editedItem);
      }
      this.close();
    },
    validate() {
      console.log("submit");
      let v = Object.assign(
        {},
        {
          numberPlate: this.numberPlate,
          brand: this.brand,
          model: this.carModel,
          category: this.select,
          nbSeats: this.nbSeats,
          status: this.carStatus,
          photoUrl: this.photoUrl,
          reservations: this.reservations,
        }
      );
      console.log(v);
      this.$refs.form.validate();
      this.vehicles.push(v);
      VehicleApi.add(v);
      this.closeAdd();
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

<style lang="scss" scoped>
.v-data-table {
  margin-bottom: 1rem;
}
a:link,
a:visited {
  color: white;
  text-decoration: none;
}
.v-card__actions {
  display: flex;
  justify-content: end;
}
.radioSelect {
  display: flex;
  justify-content: center;
}
</style>
