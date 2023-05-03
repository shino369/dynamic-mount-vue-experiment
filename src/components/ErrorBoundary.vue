<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const err = ref<Error>()

onErrorCaptured((error) => {
    err.value = error
    console.error(error)
})
</script>
<template>
    <div
        v-if="err"
        class="text-red-500 text-base p-2 max-w-fit rounded border-red-400 border border-solid border-opacity-80 bg-red-200"
    >
        <!-- do not change to pre or do any js here, source map will fail to trace-->
        <div class="mb-2">Error Boundary</div>
        <div class="bg-white p-4">
            {{ err }}
        </div>
    </div>
    <slot v-if="!err"></slot>
</template>
