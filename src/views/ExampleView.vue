<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { useStorageStore } from '@/stores/storage'
import { debounce } from '@/utils/commonUtils'

//  Type for Props must be declared inside SFC.
//  Other types like ref<SomeType>() can use import

const { getStorage, setStorage, deleteStorage: _deletes } = useStorageStore()
const count = ref(0)
const text = ref('')

onMounted(() => {
    text.value = getStorage<string>('text') || ''
    count.value = getStorage<number>('count') || 0
})

const increment = () => {
    count.value++
}

const clear = () => {
    text.value = ''
    count.value = 0
}

const debouncedSave = debounce(() => {
    setStorage<number>('count', count.value)
    setStorage<string>('text', text.value)
}, 1000)

watch(
    () => [count.value, text.value],
    (_newVal, _oldVal) => {
        debouncedSave()
    },
)
</script>
<template>
    <!--scoped css-->
    <div class="wrapper bg-slate-400 text-base p-4">
        <div class="bg-slate-100 p-2">
            {{ text }}
            <br />
            here is a counter: {{ count }}
            <br />
            <textarea class="w-full" v-model="text"></textarea>
        </div>
        <!-- tailwind css-->
        <div class="flex items-center py-2">
            <ButtonComponent
                icon="close"
                text="clear"
                iconClassName="ml-2 w-5 h-5"
                btnClassName="bg-white rounded w-fit active:opacity-50"
                type="button"
                @click="clear"
            />
            <ButtonComponent
                icon="plus"
                text="increment"
                iconClassName="ml-2 w-5 h-5"
                btnClassName="bg-white rounded w-fit active:opacity-50  ml-4"
                type="button"
                @click="increment"
            />
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
}
</style>
