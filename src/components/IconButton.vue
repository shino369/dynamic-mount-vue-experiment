<script setup lang="ts">
import IconAll from "./icons/Icon-all.vue"
import IconClose from "./icons/Icon-close.vue"
import IconConfirm from "./icons/Icon-confirm.vue"
import IconEdit from "./icons/Icon-edit.vue"
import IconMenu from "./icons/Icon-menu.vue"
import IconPlus from "./icons/Icon-plus.vue"
import IconSelected from "./icons/Icon-selected.vue"
import IconSpinner from "./icons/Icon-spinner.vue"
import IconThreeDot from "./icons/Icon-threeDot.vue"
import IconTick from "./icons/Icon-tick.vue"
import IconTrash from "./icons/Icon-trash.vue"

interface Props {
  name: string
  iconClassName: string
}
defineProps<Props>()

const iconMap = new Map([
  ['all', IconAll],
  ['edit', IconEdit],
  ['menu', IconMenu],
  ['plus', IconPlus],
  ['selected', IconSelected],
  ['spinner', IconSpinner],
  ['tick', IconTick],
  ['trash', IconTrash],
  ['close', IconClose],
  ['confirm', IconConfirm],
  ['threeDot', IconThreeDot]
])

</script>
<template>
  <div>
    <component :is="iconMap.get(name)" :class="iconClassName" />
  </div>
</template>
