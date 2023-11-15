<script setup lang="ts">
</script>

<template>
 
  <router-view></router-view>
</template>

<style lang="scss">
@import "./assets/css/common.css";
@import "./assets/css/base.scss";
@for $i from 12 through 88 {
	.font#{$i}{font-size: #{$i}px;}
}

body{margin: 0;}
.container{background-color: #f1f1f1;}
.bgf1{background-color: #f1f1f1;}
:root{
  --van-primary-color:#8950FC !important;
}
</style>
