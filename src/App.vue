<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
// import ModalDialog from '@/components/ModalDialog.vue'
import { viewPropsStore } from '@/stores/viewProps'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import ExtraPreferenceView from '@/views/ExtraPreferenceView.vue'
import ExampleView from './views/ExampleView.vue'
// import { useStorageStore } from './stores/storage'

const viewProps = viewPropsStore()
// const storageStore = useStorageStore()
const { view } = storeToRefs(viewProps)
const compRef = ref()

// this necessary for chunk splitting
const viewMap = new Map([
    [
        'ExampleView',
        // defineAsyncComponent(() => import('@/views/ExampleView.vue')),   // if support async import
        ExampleView,
    ],
    ['ExtraPreferenceView', ExtraPreferenceView],
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
        <!-- <ModalDialog /> -->
    </ErrorBoundary>
</template>
