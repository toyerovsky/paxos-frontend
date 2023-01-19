<script setup>
/* eslint-disable */

import {ref, onMounted} from 'vue'
import axios from 'axios'

const nodes = ref([])

const colors = {
  true: 'success',
  false: 'error'
}

const icons = {
  true: 'mdi-check',
  false: 'mdi-close'
}


async function fetchNodes() {
  const addresses = [
    "http://localhost:8090",
    "http://localhost:8091",
    "http://localhost:8092",
    "http://localhost:8093",
  ]
  let tempResult = []
  for (const nodeAddress of addresses) {
    try {
      let result = await axios.get(`${nodeAddress}/error-status/statuses`);
      let resultLeader = await axios.get(`${nodeAddress}/leader`);
      if (result.status === 200 && resultLeader.status === 200) {
        tempResult.push({instanceAddress: nodeAddress, isLeader: resultLeader.data, ...result.data});
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  nodes.value = tempResult;
}

async function toggleError(nodeAddress, key, value) {
  await axios.post(`${nodeAddress}/error-status/${value ? 'disable' : 'enable'}/${key}`);
  await fetchNodes()
}

onMounted(() => {
  fetchNodes();
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-table>
          <thead>
          <tr>
            <th class="text-left">
              URL instancji
            </th>
            <th class="text-left">
              Błąd INFINITE_REPLIES
            </th>
            <th class="text-left">
              Błąd INVALID_RESPONSE
            </th>
            <th class="text-left">
              Błąd LOST_CONNECTION
            </th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in nodes"
              :key="item.name"
          >
            <td>{{ item.instanceAddress }}
              <v-chip color="primary" v-if="item.isLeader">Lider</v-chip>
            </td>
            <td :key="item.instanceAddress + key"
                v-for="key in Object.keys(item).filter(x => x !== 'instanceAddress' && x !== 'isLeader')">
              <v-btn flat
                     @click="() => toggleError(item.instanceAddress, key, item[key])"
                     :icon="icons[item[key]]"
                     :color="colors[item[key]]"
              ></v-btn>
            </td>
          </tr>
          </tbody>
        </v-table>

      </v-col>

    </v-row>
  </v-container>
</template>

<style>
td {
  padding: 1em !important;
}
</style>