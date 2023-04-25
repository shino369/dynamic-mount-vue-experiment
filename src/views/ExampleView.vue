<script setup lang="ts">
import { ref } from 'vue'
import IconButton from '@/components/icons/Icon-plus.vue'

//  Type for Props must be declared inside SFC.
//  Other types like ref<SomeType>() can use import
interface Props {
    name: string
    enable: boolean
}

const props = defineProps<Props>()
const count = ref<number>(0)

const increment = () => {
    props.enable && count.value++
}
</script>
<template>
    <!--scoped css-->
    <div class="wrapper">
        {{ count }}
        <!-- tailwind css-->
        <button class="max-h-10 max-w-10" type="button" @click="increment">
            click me!
        </button>
        <IconButton :name="name" iconClassName="w-6 h-6 " />
    </div>
</template>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
}
</style>
