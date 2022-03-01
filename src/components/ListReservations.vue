<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="reservations"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ $t("reservation.table-title") }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ $t("reservation.form-title") }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.startTime"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.endTime"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.withDriver"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.user"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.vehicle"></v-text-field>
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
import ReservationApi from "../services/ReservationApi";

export default {
  name: "ListReservations",
  data() {
    return {
      reservations: this.getReservations(),
      currentItem: {},
      dialog: false,
      dialogDelete: false,
      defaultItem: {
        startTime: "",
        endTime: "",
        withDriver: null,
        user: {
          lastName: "",
          firstName: "",
        },
        vehicle: {
          numberPlate: "",
        },
      },
      editedIndex: -1,
      editedItem: {
        startTime: "",
        endTime: "",
        withDriver: null,
        user: {
          lastName: "",
          firstName: "",
        },
        vehicle: {
          numberPlate: "",
        },
      },
      headers: [
        {
          text: this.$t("reservation.startTime"),
          align: "center",
          value: "startTime",
        },
        {
          text: this.$t("reservation.endTime"),
          align: "center",
          value: "endTime",
        },
        {
          text: this.$t("reservation.withDriver"),
          align: "center",
          value: "withDriver",
        },
        {
          text: this.$t("reservation.user"),
          align: "center",
          value: "user",
        },
        {
          text: this.$t("reservation.vehicle"),
          align: "center",
          value: "vehicle",
        },
        {
          text: this.$t("label.actions"),
          align: "center",
          value: "actions",
          sortable: false,
        },
      ],
    };
  },
  methods: {
    getReservations() {
      let reservations = [];
      ReservationApi.getAll().then((response) => {
        let data = response.data;
        for (let el of data) {
          reservations.push({
            id: el.id,
            startTime: new Date(el.startTime).toISOString().substring(0, 10),
            endTime: new Date(el.endTime).toISOString().substring(0, 10),
            withDriver: el.withDriver,
            user: {
              lastName: el.user.lastName,
              firstName: el.user.firstName,
            },
            vehicle: {
              numberPlate: el.vehicle.numberPlate,
            },
          });
          this.reservations = reservations;
        }
      });
    },
    refresh() {
      ReservationApi.getAll()
        .then(
          (response) => {
            this.reservations = response.data;
          },
          (errorlocale) => console.log(errorlocale),
          () => console.log("Finally")
        )
        .catch((errorgeneral) => console.log(errorgeneral));
    },
    editItem(item) {
      console.log("item to edit : " + item.id);
      this.editedIndex = this.reservations.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    updateRecord(item) {
      console.log("item in update : " + item);
      console.log("id in update : " + item.id);
      ReservationApi.update(item.id, item);
      this.refresh();
    },
    deleteItem(item) {
      this.editedIndex = this.reservations.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.currentItem = item;
      console.log("id à supprimer : " + item.id);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.reservations.splice(this.reservations, 1);
      this.deleteRecord();
      this.closeDelete();
    },

    deleteRecord() {
      ReservationApi.delete(this.currentItem.id);
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
        Object.assign(this.reservations[this.editedIndex], this.editedItem);
      } else {
        this.reservations.push(this.editedItem);
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
