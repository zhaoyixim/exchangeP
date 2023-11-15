<script setup lang="ts">
import { reactive, } from 'vue'
import { useRouter } from 'vue-router';

let getactivenum = defineProps<{ factive: string | '0' }>();

let refactivenum = parseInt(getactivenum.factive)

</script>

<template>
  <div class="footer-wrap bgbasecolor2 fontbasecolor">
    
  </div>
</template>

<style lang="scss">
</style>
