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
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ $t("carshare.form-title") }}</span>
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
                      <v-text-field v-model="editedItem.arrivalTime"></v-text-field>
                    </v-col>
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
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.participants"
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
import CarshareApi from "../services/CarshareApi";

export default {
  name: "ListCarshares",
  data() {
    return {
      carshares: this.getCarshares(),
      currentItem: {},
      dialog: false,
      dialogDelete: false,
      defaultItem: {
        startTime: "",
        arrivalTime: "",
        fromAddress: "",
        toAddress: "",
        nbSpaces: 0,
        participants: [],
      },
      editedIndex: -1,
      editedItem: {
        startTime: "",
        arrivalTime: "",
        fromAddress: "",
        toAddress: "",
        nbSpaces: 0,
        participants: [],
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
          text: this.$t("carshare.participants"),
          align: "center",
          value: "participants",
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
            participants: el.participants,
          });
          this.carshares = carshares;
        }
      });
    },
    refresh() {
      CarshareApi.getAll()
        .then(
          (response) => {
            this.carshares = response.data;
          },
          (errorlocale) => console.log(errorlocale),
          () => console.log("Finally")
        )
        .catch((errorgeneral) => console.log(errorgeneral));
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
