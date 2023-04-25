<script setup lang="ts">
import type { StyleValue } from 'vue'
import IconButton from './IconButton.vue'

interface Props {
    icon?: string
    disabled?: boolean
    btnClassName?: string
    btnStyle?: StyleValue
    iconClassName?: string
    type?: 'button' | 'submit' | 'reset'
}
withDefaults(defineProps<Props>(), {
    disabled: false,
    iconClassName: 'w-5 h-5',
    type: 'button',
})
</script>
<template>
    <button
        :type="type"
        :class="btnClassName || ''"
        class="flex items-center justify-between px-2 py-1"
        :style="btnStyle"
        :disabled="disabled"
    >
        <slot></slot>
        <IconButton v-if="icon" :name="icon" :iconClassName="iconClassName" />
    </button>
</template>

<style scoped>
button:disabled {
    cursor: not-allowed !important;
    opacity: 0.7 !important;
}
</style>
