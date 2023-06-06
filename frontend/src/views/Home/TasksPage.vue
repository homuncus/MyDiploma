<template>
  <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
    <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
  </ul>
</template>

<script lang="ts">
export default {
  methods: {
    load() {
      this.count = this.count + 2
    }
  },
  data() {
    return {
      count: 0
    }
  },
}
</script>