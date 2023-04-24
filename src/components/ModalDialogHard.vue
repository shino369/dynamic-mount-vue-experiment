<script setup lang="ts">
import { ref, watch } from 'vue'
interface Props {
    showDialog: Function
    show: Boolean
}
const props = defineProps<Props>()
const preState = ref(false)
const postState = ref(false)
const headerRef = ref()
const bodyHeight = ref<string>('')

// internal state subscribed to props.show
watch(
    () => props.show,
    (newState, _oldState) => {
        if (newState) {
            document.body.style.overflow = 'hidden'
            preState.value = true
            setTimeout(() => {
                postState.value = true
                if (headerRef.value) {
                    bodyHeight.value = `calc(100% - ${headerRef.value.clientHeight}px)`
                }
            }, 50)
        } else {
            document.body.style.overflow = 'auto'
            postState.value = false
            setTimeout(() => {
                preState.value = false
            }, 100)
        }
    },
)
</script>
<template>
    <div
        @click="showDialog(false)"
        class="fixed top-0 left-0 z-[1050] h-full w-full justify-center items-center backdrop-contrast-50 transition-opacity overflow-hidden"
        :style="{
            display: preState ? 'flex' : 'none',
            opacity: postState ? 1 : 0,
        }"
    >
        <div
            class="bg-white w-[90%] max-w-[600px] h-[80%] relative transition-transform p-2 overflow-hidden box-shadow-bk rounded"
            :style="{
                transform: postState ? 'translateY(0)' : 'translateY(100vh)',
            }"
            @click.stop
        >
            <div
                ref="headerRef"
                class="flex items-center justify-end p-2 border-bottom-bk"
                @click="showDialog(false)"
            >
                <button type="button" class="close" data-dismiss="modal">
                    ×
                </button>
            </div>
            <div
                class="w-full flex flex-col pt-2"
                :style="{
                    height: bodyHeight,
                }"
            >
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.box-shadow-bk {
    box-shadow: 0px 1px 5px 0px rgb(100 100 100 / 30%);
    -webkit-box-shadow: 0px 1px 5px 0px rgb(100 100 100 / 30%);
    -moz-box-shadow: 0px 1px 5px 0px rgb(100 100 100 / 30%);
}
.border-bottom-bk {
    border-bottom: 1px solid #e5e5e5;
}
</style>
