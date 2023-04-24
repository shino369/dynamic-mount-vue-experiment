<script setup lang="ts">
import IconButton from '@/components/IconButton.vue'
import ModalDialogHard from '@/components/ModalDialogHard.vue'
import { viewProps } from '@/stores/viewProps'
import type {
    ExtraTypePropsData,
    ExtraTypes,
    MemAttributeResponse,
} from '@/types'
import { apiGet } from '@/utils/commonUtils'
import { computed, onMounted, ref, watch } from 'vue'

const { data, t } = viewProps<ExtraTypePropsData>()
const show = ref(false)
const extraTypes = ref<ExtraTypes<number>[]>([])
const optionMap = ref<{ [key: number]: string }>({})
const tnc = ref('')
const typeMapper = new Map()

const trans: Record<string, string> = {
    yours: t('yours'),
    your_guests: t('your_guests'),
    your_selected_preferences: t('your_selected_preferences'),
    guest_selected_preferences: t('guest_selected_preferences'),
    selected: t('selected'),
    i_agree: t('i_agree'),
    select_extra_preferences: t('select_extra_preferences'),
}

const rowArr: Record<string, string>[] = [
    {
        sk: 'selectedSet',
        tk: 'your_selected_preferences',
    },
    {
        sk: 'guestSelectedSet',
        tk: 'guest_selected_preferences',
    },
]

const error = {
    tnc: 'this_field_is_required',
}

const activeTab = ref('YOURS')

const form = ref({
    selectedSet: new Set<number>(),
    guestSelectedSet: new Set<number>(),
    agree: false,
})

watch(
    () => form.value,
    (newState, _oldState) => {
        // update the form to original jquery form
        const formData =
            newState.selectedSet.size === 0 &&
            newState.guestSelectedSet.size === 0
                ? ''
                : JSON.stringify({
                      label: data.name_l1,
                      selectedSet: Array.from(newState.selectedSet).map(
                          (id) => ({
                              optionId: id,
                              typeId: typeMapper.get(id),
                          }),
                      ),
                      guestSelectedSet: Array.from(
                          newState.guestSelectedSet,
                      ).map((id) => ({
                          optionId: id,
                          typeId: typeMapper.get(id),
                      })),
                      tnc: {
                          // typeId:
                          id: data.params.terms_n_services_options.value,
                          agree: newState.agree,
                      },
                  })
        // console.log(JSON.formData);

        document
            .getElementById('#ResvExtraPreference' + data.seq)
            ?.setAttribute('value', formData)
    },
    {
        deep: true,
        // immediate: true,
    },
)
const fetchData = async () => {
    // fetch extra preference here
    const { outletId, params } = data
    const res = await apiGet<MemAttributeResponse>(
        data.baseUrl + 'some_api_get_extra_preference',
        {
            outletId: outletId,
            memAttributeTypeIds: params.mem_attribute_types.value,
            tncId: params.terms_n_services_options.value,
        },
    )
    // console.log(res);
    extraTypes.value = res.memAttributeTypes.map((mt) => {
        return {
            type: mt.MemAttributeType[`atyp_name_l${data.langKey}`],
            id: mt.MemAttributeType.atyp_id,
            options: mt.MemAttributeOption.map((op) => {
                optionMap.value[op.atto_id] = op[`atto_name_l${data.langKey}`]
                typeMapper.set(op.atto_id, mt.MemAttributeType.atyp_id)
                return {
                    label: op[`atto_name_l${data.langKey}`],
                    value: op.atto_id,
                }
            }),
        }
    })
    tnc.value = res.tnc
        .map((t) => t.TmsExtraType[`etyp_info_l${data.langKey}`])
        .join()
}

onMounted(() => {
    // console.log('component mounted');
    // console.log(props.data);
    fetchData()
})
const showList = computed(() =>
    activeTab.value === 'YOURS'
        ? form.value.selectedSet
        : form.value.guestSelectedSet,
)
const showDialog = (s: boolean) => {
    show.value = s
}

const tabOnClick = (e: string) => {
    activeTab.value = e
}

const optionOnClick = (e: number) => {
    if (activeTab.value === 'YOURS') {
        form.value.selectedSet.has(e)
            ? form.value.selectedSet.delete(e)
            : form.value.selectedSet.add(e)
    } else {
        form.value.guestSelectedSet.has(e)
            ? form.value.guestSelectedSet.delete(e)
            : form.value.guestSelectedSet.add(e)
    }
}
</script>
<template>
    <div
        type="button"
        class="custom-text-color px-1 py-2 custom-bg-color btn btn-block btn-lg mb-2 flex items-center text-xs text-black"
        @click="showDialog(true)"
    >
        {{ trans.select_extra_preferences }}
        <IconButton :name="'plus'" iconClassName="" />
    </div>
    <div
        v-if="form.selectedSet.size > 0 || form.guestSelectedSet.size > 0"
        class="text-xs selected-grid"
    >
        <div
            v-for="(arr, index) in rowArr"
            :key="index"
            class="flex items-center flex-wrap py-2"
            :style="{
                borderBottom:
                    index !== rowArr.length - 1 ? '1px solid lightgray' : '',
            }"
        >
            <div class="w-[130px]">{{ trans[arr.tk] }}:</div>
            <div
                v-for="(tag, index) in Array.from((form as Record<string, any>)[arr.sk])"
                :key="index"
                class="text-xs m-1 ml-0 p-0 px-1 rounded"
                :style="{
                    backgroundColor:
                        index % 2 === 0 ? 'lightsteelblue' : 'lightgray',
                    filter: index % 2 === 0 ? 'grayscale(1)' : '',
                }"
            >
                {{ optionMap[tag as number] }}
            </div>
        </div>
        <div
            class="js-input-data form-control p-2 h-40 overflow-auto my-2"
            :style="{
                width: 'unset',
                fontSize: '10px',
            }"
        >
            {{ tnc }}
        </div>
        <div class="flex items-center">
            <input
                :id="data.id + data.seq"
                type="checkbox"
                v-model="form.agree"
                class="mt-0 mr-2"
            />
            <label :for="data.id + data.seq" class="mb-0">
                {{ trans.i_agree }}
            </label>
            <div v-if="!form.agree" class="ml-2 text-red-600">
                {{ error['tnc'] }}
            </div>
        </div>
    </div>

    <ModalDialogHard :showDialog="showDialog" :show="show">
        <div class="flex w-full mb-2 px-4 relative pt-4 uppercase">
            <div
                class="w-1/2 rounded-lg text-center select-none cursor-pointer relative"
                @click="tabOnClick('YOURS')"
            >
                <div class="absolute z-[1051] w-[calc(100%-1rem)]">
                    {{ trans.yours }}
                </div>
                {{ trans.yours }}
            </div>
            <div
                class="w-1/2 rounded-lg text-center select-none cursor-pointer relative"
                @click="tabOnClick('YOUR GUESTS')"
            >
                <div class="absolute z-[1051] w-[calc(100%-1rem)]">
                    {{ trans.your_guests }}
                </div>
                {{ trans.your_guests }}
            </div>
            <div
                class="custom-bg-color absolute z-[1050] w-[50%-1rem] h-[100%-0.75rem] opacity-50 rounded-lg transition-transform duration-300"
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
            <div
                v-for="(tag, index) in Array.from(showList)"
                :key="index"
                class="flex center text-xs m-1 ml-0 py-0 px-1 rounded"
                :style="{
                    backgroundColor:
                        index % 2 === 0 ? 'lightsteelblue' : 'lightgray',
                }"
            >
                {{ optionMap[tag] }}
                <IconButton
                    @click="optionOnClick(tag)"
                    :name="'trash'"
                    iconClassName="cursor-pointer ml-2"
                />
            </div>
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
                        class="p-2 bg-gray-400 max-w-fit h-fit m-2 rounded-xl select-none cursor-pointer transition-opacity hover:opacity-90 active:scale-[0.95]"
                        :class="{
                            'custom-bg-color': showList.has(option.value),
                        }"
                    >
                        {{ option.label }}
                    </div>
                </div>
            </div>
        </div>
    </ModalDialogHard>
</template>

<style scoped>
.selected-grid {
    box-shadow: 10px 10px 5px 0px rgb(0 0 0 / 75%);
    -webkit-box-shadow: 0px 1px 5px 0px rgb(100 100 100 / 30%);
    -moz-box-shadow: 0px 1px 5px 0px rgb(100 100 100 / 30%);
}

.translate-right {
    transform: translateX(100%);
}
</style>
