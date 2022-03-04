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
          <!-- start modal edit entry -->
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span wrap class="text-h5">{{
                  $t("reservation.form-title")
                }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <!-- start datepicker edit startTime -->
                    <v-col cols="12" lg="6">
                      <v-menu
                        v-model="editStart"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.startTime"
                            label="startTime"
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            @blur="date = parseDate(dateFormatted)"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.startTime"
                          no-title
                          @input="editStart = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <!-- end datepicker edit startTime -->
                    <!-- start datepicker edit endTime -->
                    <v-col cols="12" lg="6">
                      <v-menu
                        v-model="editEnd"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.endTime"
                            label="endTime"
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            @blur="date = parseDate(dateFormatted)"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.endTime"
                          no-title
                          @input="editEnd = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <!-- end datepicker edit endTime -->
                    <v-col cols="12" sm="6" md="4">
                      <v-checkbox
                        v-model="editedItem.withDriver"
                        label="withDriver"
                        class="shrink mr-2 mt-0"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.user.id"
                        label="User"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.vehicle.numberPlate"
                        label="Vehicle numberPlate"
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
          <!-- end modal edit entry -->

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
                      <!-- start datepicker startTime -->
                      <v-col cols="12" lg="6">
                        <v-menu
                          v-model="menu1"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="startTime"
                              label="startTime"
                              :rules="rules.startTime"
                              prepend-icon="mdi-calendar"
                              v-bind="attrs"
                              @blur="date = parseDate(dateFormatted)"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="startTime"
                            no-title
                            @input="menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <!-- end datepicker startTime -->

                      <!-- start datepicker endTime -->
                      <v-col cols="12" lg="6">
                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="endTime"
                              label="endTime"
                              prepend-icon="mdi-calendar"
                              v-bind="attrs"
                              @blur="date = parseDate(dateFormatted)"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="endTime"
                            no-title
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <!-- end datepicker endTime -->

                      <v-col cols="12" sm="6" md="4">
                        <!-- select user -->
                        <v-select
                          v-model="select"
                          :items="userList"
                          label="User"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <!-- select vehicle -->
                        <v-select
                          v-model="select"
                          :items="vehicleList"
                          label="Vehicle"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-checkbox
                          v-model="withDriver"
                          label="withDriver"
                          class="shrink mr-2 mt-0"
                        ></v-checkbox>
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
import ReservationApi from "../services/ReservationApi";
import VehicleApi from "../services/VehicleAPi";

export default {
  name: "ListReservations",
  data(vm) {
    return {
      reservations: this.getReservations(),
      currentItem: {},
      dialog: false,
      dialogAdd: false,
      dialogDelete: false,
      defaultItem: {
        startTime: "",
        endTime: "",
        withDriver: null,
        user: {},
        vehicle: {},
      },
      editedIndex: -1,
      editedItem: {
        startTime: "",
        endTime: "",
        withDriver: null,
        user: {},
        vehicle: {},
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
      rules: {
        startTime: [
          (v) => !!v || "The startTime is required",
          (v) =>
            v >= this.endTime || "The startTime cannot be after the endTime",
        ],
        endTime: [
          (v) => !!v || "The endTime is required",
          (v) =>
            v > this.endTime || "The endTime cannot be before the startTime",
        ],
      },
      withDriver: null,
      user: {},
      vehicle: {},
      select: null,
      valid: true,
      userId: [],
      vehicleId: [],
      userList: [],
      vehicleList: this.$store.getters.allVehicles,
      startTime: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      endTime: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateFormatted: vm.formatDate(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      ),
      menu1: false,
      menu2: false,
      editStart: false,
      editEnd: false,
    };
  },
  mounted() {
    this.getReservations();
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
              id: el.id,
              username: el.user.username,
              password: el.user.password,
              lastName: el.user.lastName,
              firstName: el.user.firstName,
              email: el.user.email,
              phone: el.user.phone,
              participants: el.user.participants,
              reservations: el.user.reservations,
            },
            vehicle: {
              id: el.vehicle.id,
              numberPlate: el.vehicle.numberPlate,
              brand: el.vehicle.brand,
              model: el.vehicle.carModel,
              category: el.vehicle.select,
              nbSeats: el.vehicle.nbSeats,
              status: el.vehicle.carStatus,
              photoUrl: el.vehicle.photoUrl,
              reservations: el.vehicle.reservations,
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
    addItem() {
      console.log("addItem : ");
      this.dialogAdd = true;
    },
    editItem(item) {
      console.log("item to edit : " + item.id);
      this.editedIndex = this.reservations.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    updateRecord(item) {
      console.log("item in update : ");
      console.log(item);
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
        Object.assign(this.reservations[this.editedIndex], this.editedItem);
        console.log("id in save : " + this.editedItem.id);
        this.updateRecord(this.editedItem);
        this.refresh();
      } else {
        this.reservations.push(this.editedItem);
      }
      this.close();
    },
    validate() {
      console.log("submit");
      let v = Object.assign(
        {},
        {
          startTime: this.startTime,
          endTime: this.endTime,
          withDriver: this.withDriver,
          user: this.user,
          vehicle: this.vehicle,
        }
      );
      console.log(v);
      this.$refs.form.validate();
      this.reservations.push(v);
      ReservationApi.add(v);
      this.closeAdd();
    },
    getVehicleList() {
      VehicleApi.getAll()
        .then(
          (response) => {
            return (this.vehicleList = response.data);
          },
          (errorlocale) => console.log(errorlocale),
          () => console.log("Finally")
        )
        .catch((errorgeneral) => console.log(errorgeneral));
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
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
