<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const err = ref<Error>()

onErrorCaptured((error) => {
    err.value = error
    console.error(error)
})
</script>
<template>
    <Transition>
        <div v-if="err" class="text-red-500 p-2 mb-2 max-w-fit">
            {{ err }}
        </div>
    </Transition>

    <slot></slot>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
pre {
    color: red;
}
</style>
