<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import ModalDialog from '@/components/ModalDialog.vue'
import { viewPropsStore } from '@/stores/viewProps'
import { viewMapping } from '@/utils/viewMapper'

const viewProps = viewPropsStore()
const { view } = storeToRefs(viewProps)
const compRef = ref()

watch(
    () => view.value,
    (newState, _oldState) => {
        if (newState && !compRef.value) {
            // console.log('mounting ', view.value.trim())
            compRef.value =  viewMapping.get(view.value.trim()) || ''
        }
    },
    {
        immediate: true,
    },
)

</script>

<template>
    <component v-if="compRef" :is="compRef" />
    <div v-if="!compRef">{{view ? `view [${view}] not found` : 'mounting...'}}</div>
    <ModalDialog />
</template>

