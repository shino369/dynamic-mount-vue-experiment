<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

const err = ref<Error>()

onErrorCaptured((error) => {
    err.value = error
    console.error(error)
})

</script>
<template>
    <div v-if="err" class="text-red-500">
        <div>{{ err.message }}</div>
    </div>
    <slot v-if="!err"></slot>
</template>