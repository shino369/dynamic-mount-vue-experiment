<script setup lang="ts">
import type { ExtraTypes } from '@/types'
import { TransitionGroup } from 'vue'
import IconButton from '../IconButton.vue'

interface Props {
    tabOnClick: Function
    optionOnClick: Function
    trans: Record<string, string>
    activeTab: string
    showList: Set<number>
    optionMap: Record<number, string>
    extraTypes: ExtraTypes<number>[]
}
defineProps<Props>()
</script>
<template>
    <div class="flex w-full px-4 relative py-4 uppercase items-center">
        <div
            class="w-1/2 rounded-lg text-center select-none cursor-pointer relative"
            @click="tabOnClick('YOURS')"
        >
            <div class="absolute z-[1051] w-full">
                {{ trans.yours }}
            </div>
            {{ trans.yours }}
        </div>
        <div
            class="w-1/2 rounded-lg text-center select-none cursor-pointer relative"
            @click="tabOnClick('YOUR GUESTS')"
        >
            <div class="absolute z-[1051] w-full">
                {{ trans.your_guests }}
            </div>
            {{ trans.your_guests }}
        </div>
        <div
            class="custom-bg-color absolute z-[1050] w-[calc(50%-1rem)] h-[calc(100%-1rem)] top-2 opacity-50 rounded-lg transition-transform duration-300"
            :class="{
                'translate-x-full': activeTab !== 'YOURS',
            }"
        ></div>
    </div>
    <div
        class="px-2 flex items-center min-h-[50px] flex-wrap mb-4 py-4"
        :style="{
            borderBottom: '1px solid lightgray',
        }"
    >
        <div class="mr-2">{{ trans.selected }}:</div>
        <TransitionGroup name="fade">
            <div
                v-for="(tag, index) in Array.from(showList)"
                :key="index"
                class="flex center text-[12px] m-1 ml-0 py-0 px-1 rounded items-center bg-sky-600 text-white transition-all"
            >
                {{ optionMap[tag] }}
                <IconButton
                    @click="optionOnClick(tag)"
                    name="trash"
                    iconClassName="cursor-pointer ml-2 w-5 h-5 text-white"
                />
            </div>
        </TransitionGroup>
    </div>
    <div
        class="flex flex-wrap max-w-[50vh] overflow-auto mb-2 flex-col px-2"
        id="scroll-container"
    >
        <div v-for="(extraType, index) in extraTypes" :key="index">
            <div>
                {{ extraType.type }}
            </div>
            <div class="flex flex-wrap">
                <div
                    v-for="(option, index) in extraType.options"
                    :key="index"
                    @click="optionOnClick(option.value)"
                    class="p-2 bg-gray-300 max-w-fit h-fit m-2 rounded-xl select-none cursor-pointer transition-opacity hover:opacity-90 active:scale-[0.95]"
                    :class="{
                        'custom-bg-color': showList.has(option.value),
                    }"
                >
                    {{ option.label }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
