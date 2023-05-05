<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, ref, watch } from 'vue'
// import ModalDialog from '@/components/ModalDialog.vue'
import { viewPropsStore } from '@/stores/viewProps'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
// import ExtraPreferenceView from '@/views/ExtraPreferenceView.vue'
// import ExampleView from './views/ExampleView.vue'
import { useStorageStore } from '@/stores/storage'

const viewProps = viewPropsStore()
useStorageStore()
const { view } = storeToRefs(viewProps)
const compRef = ref(false)

// this necessary for chunk splitting
const viewMap = new Map([
    [
        'ExampleView',
        defineAsyncComponent(() => import('@/views/ExampleView.vue')), // if support async import
        // ExampleView,
    ],
    [
        'ExtraPreferenceView',
        defineAsyncComponent(() => import('@/views/ExtraPreferenceView.vue')),
        // ExtraPreferenceView,
    ],
])

watch(
    () => view.value,
    (newState, _oldState) => {
        if (newState && !compRef.value) {
            // console.log('mounting ', view.value.trim())
            compRef.value = true
        }
    },
    {
        immediate: true,
    },
)
</script>

<template>
    <ErrorBoundary>
        <component
            v-if="compRef && viewMap.get(view.trim())"
            :is="viewMap.get(view.trim()) as any"
        />
        <div v-if="!compRef || !viewMap.get(view.trim())">
            {{ view ? `view [${view}] not found` : 'mounting...' }}
        </div>
        <!-- <ModalDialog /> -->
    </ErrorBoundary>
</template>
