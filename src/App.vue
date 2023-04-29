<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, ref, watch } from 'vue'
import ModalDialog from '@/components/ModalDialog.vue'
import { viewPropsStore } from '@/stores/viewProps'
import ErrorBoundary from '@/components/ErrorBoundary.vue'

const viewProps = viewPropsStore()
const { view } = storeToRefs(viewProps)
const compRef = ref()

// this necessary for chunk splitting
const viewMap = new Map([
    [
        'ExampleView',
        defineAsyncComponent(() => import('@/views/ExampleView.vue')),
    ],
    [
        'ExtraPreferenceView',
        defineAsyncComponent(() => import('@/views/ExtraPreferenceView.vue')),
    ],
])

watch(
    () => view.value,
    (newState, _oldState) => {
        if (newState && !compRef.value) {
            // console.log('mounting ', view.value.trim())
            compRef.value = viewMap.get(view.value.trim()) || '' //viewMapping[view.value.trim()] || ''
        }
    },
    {
        immediate: true,
    },
)
</script>

<template>
    <ErrorBoundary>
        <component v-if="compRef" :is="compRef" />
        <div v-if="!compRef">
            {{ view ? `view [${view}] not found` : 'mounting...' }}
        </div>
        <ModalDialog />
    </ErrorBoundary>
</template>
