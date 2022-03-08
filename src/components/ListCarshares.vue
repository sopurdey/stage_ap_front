<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="carshares"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ $t("carshare.table-title") }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <!-- start modal edit entry -->
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ $t("carshare.form-title") }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
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
                            v-model="editedItem.startTime"
                            label="startTime"
                            :rules="rules.startTime"
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            @blur="date = parseDate(dateFormatted)"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.startTime"
                          no-title
                          @input="menu1 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <!-- end datepicker startTime -->
                    <!-- start datepicker arrivalTime -->
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
                            v-model="editedItem.arrivalTime"
                            label="arrivalTime"
                            :rules="rules.arrivalTime"
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            @blur="date = parseDate(dateFormatted)"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.arrivalTime"
                          no-title
                          @input="menu2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <!-- end datepicker arrivalTime -->
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.fromAddress"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.toAddress"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.nbSpaces"
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

                      <!-- start datepicker arrivalTime -->
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
                              v-model="arrivalTime"
                              label="arrivalTime"
                              :rules="rules.arrivalTime"
                              prepend-icon="mdi-calendar"
                              v-bind="attrs"
                              @blur="date = parseDate(dateFormatted)"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="arrivalTime"
                            no-title
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <!-- end datepicker arrivalTime -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="fromAddress"
                          label="fromAddress"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="toAddress"
                          label="toAddress"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="nbSpaces"
                          label="nbSpaces"
                        ></v-text-field>
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
import CarshareApi from "../services/CarshareApi";

export default {
  name: "ListCarshares",
  data(vm) {
    return {
      carshares: this.getCarshares(),
      currentItem: {},
      dialog: false,
      dialogAdd: false,
      dialogDelete: false,
      defaultItem: {
        startTime: "",
        arrivalTime: "",
        fromAddress: "",
        toAddress: "",
        nbSpaces: 0,
      },
      editedIndex: -1,
      editedItem: {
        startTime: "",
        arrivalTime: "",
        fromAddress: "",
        toAddress: "",
        nbSpaces: 0,
      },
      headers: [
        {
          text: this.$t("carshare.startTime"),
          align: "center",
          value: "startTime",
        },
        {
          text: this.$t("carshare.arrivalTime"),
          align: "center",
          value: "arrivalTime",
        },
        {
          text: this.$t("carshare.fromAddress"),
          align: "center",
          value: "fromAddress",
        },
        {
          text: this.$t("carshare.toAddress"),
          align: "center",
          value: "toAddress",
        },
        {
          text: this.$t("carshare.nbSpaces"),
          align: "center",
          value: "nbSpaces",
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
            v > this.arrivalTime ||
            "The startTime cannot be after the arrivalTime",
        ],
        arrivalTime: [
          (v) => !!v || "The arrivalTime is required",
          (v) =>
            v > this.arrivalTime ||
            "The arrivalTime cannot be before the startTime",
        ],
      },
      valid: true,
      startTime: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      arrivalTime: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      fromAddress: "",
      toAddress: "",
      nbSpaces: 0,
      menu1: false,
      menu2: false,
      dateFormatted: vm.formatDate(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      ),
    };
  },
  methods: {
    getCarshares() {
      let carshares = [];
      CarshareApi.getAll().then((response) => {
        let data = response.data;
        for (let el of data) {
          carshares.push({
            id: el.id,
            startTime: el.startTime,
            arrivalTime: el.arrivalTime,
            fromAddress: el.fromAddress,
            toAddress: el.toAddress,
            nbSpaces: el.nbSpaces,
          });
          this.carshares = carshares;
        }
      });
    },
    refresh() {
      this.getCarshares;
    },
    addItem() {
      console.log("addItem : ");
      this.dialogAdd = true;
    },
    editItem(item) {
      console.log("item to edit : " + item.id);
      this.editedIndex = this.carshares.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    updateRecord(item) {
      console.log("item in update : " + item);
      console.log("id in update : " + item.id);
      CarshareApi.update(item.id, item);
      this.refresh();
    },
    deleteItem(item) {
      this.editedIndex = this.carshares.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.currentItem = item;
      console.log("id à supprimer : " + item.id);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.carshares.splice(this.carshares, 1);
      this.deleteRecord();
      this.closeDelete();
    },
    deleteRecord() {
      CarshareApi.delete(this.currentItem.id);
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
        Object.assign(this.carshares[this.editedIndex], this.editedItem);
        console.log("id in save : " + this.editedItem.id);
        this.updateRecord(this.editedItem);
        this.refresh();
      } else {
        console.log("id in save ELSE : " + this.editedItem.id);
        this.updateRecord(this.editedItem);
        this.carshares.push(this.editedItem);
      }
      this.close();
    },
    validate() {
      console.log("submit");
      let v = Object.assign(
        {},
        {
          startTime: this.startTime,
          arrivalTime: this.endTime,
          fromAddress: this.fromAddress,
          toAddress: this.toAddress,
          nbSpaces: this.nbSpaces,
        }
      );
      console.log(v);
      this.$refs.form.validate();
      this.carshares.push(v);
      CarshareApi.add(v);
      this.closeAdd();
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
  mounted() {
    this.getCarshares;
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
