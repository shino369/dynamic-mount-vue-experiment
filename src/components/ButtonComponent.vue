<script setup lang="ts">
import type { StyleValue } from 'vue'
import IconButton, { type IconName } from './IconButton.vue'

interface Props {
    icon?: IconName
    text?: string
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
        class="tw-btn flex items-center justify-between px-2 py-1"
        :style="btnStyle"
        :disabled="disabled"
    >
        {{ text }}
        <IconButton v-if="icon" :name="icon" :iconClassName="iconClassName" />
    </button>
</template>

<style scoped>
button:disabled {
    cursor: not-allowed !important;
    opacity: 0.7 !important;
}

/* .tw-btn {
    border: none;
} */
.tw-btn:hover {
    opacity: 0.7;
}
.tw-btn:active {
    outline-offset: 0px !important;
}

/* override bootstrap 3 btn style */
.tw-btn:focus {
    outline-offset: 0px !important;
}
</style>
