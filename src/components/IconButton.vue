<script setup lang="ts">
import { computed } from 'vue'
import IconAll from './icons/Icon-all.vue'
import IconClose from './icons/Icon-close.vue'
import IconConfirm from './icons/Icon-confirm.vue'
import IconEdit from './icons/Icon-edit.vue'
import IconMenu from './icons/Icon-menu.vue'
import IconPlus from './icons/Icon-plus.vue'
import IconSelected from './icons/Icon-selected.vue'
import IconSpinner from './icons/Icon-spinner.vue'
import IconThreeDot from './icons/Icon-threeDot.vue'
import IconTick from './icons/Icon-tick.vue'
import IconTrash from './icons/Icon-trash.vue'

// too many files, stattically import to prevent chunk splitting
const iconMap = {
    all: IconAll,
    edit: IconEdit,
    menu: IconMenu,
    plus: IconPlus,
    selected: IconSelected,
    spinner: IconSpinner,
    tick: IconTick,
    trash: IconTrash,
    close: IconClose,
    confirm: IconConfirm,
    threeDot: IconThreeDot,
}

export type IconName = keyof typeof iconMap & string

interface Props {
    name: IconName
    iconClassName: string
}
const props = defineProps<Props>()
const iconRef = computed(() => iconMap[props.name])

</script>
<template>
    <div class="h-fit w-fit">
        <component v-if="iconRef" :is="iconRef" :class="iconClassName" />
    </div>
</template>
