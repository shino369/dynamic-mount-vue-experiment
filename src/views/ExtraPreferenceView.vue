<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue'
import ExtraPreferenceModalContent from '@/components/ExtraPreferenceComponent/ExtraPreferenceModalContent.vue'
import ModalDialogHard from '@/components/ModalDialogHard.vue'
import { useLoading } from '@/stores/loading'
import { viewPropsStore } from '@/stores/viewProps'
import type {
    APIResponse,
    ExtraTypePropsData,
    ExtraTypes,
    MemAttributeResponse,
} from '@/types'
import { apiGet } from '@/utils/commonUtils'
import { computed, onMounted, ref, watch } from 'vue'
//ExtraTypePropsData
const { data, t, config } = viewPropsStore<ExtraTypePropsData>()
const loading = useLoading()
const isLoading = computed(() => loading.isLoading)

const generalTextStyle = {
    fontSize: config.customStyle?.font_size?.normal_text + 'px',
    color: '#' + config.customStyle?.general_text_color?.font,
}

const _dialogStyles = {
    backgroundColor:
        '#' + config.customStyle?.dialog_color_new_reservation?.background,
    color: '#' + config.customStyle?.dialog_color_new_reservation?.font,
}

const buttonStyles = {
    backgroundColor: '#' + config.customStyle?.button_group?.background,
    color: '#' + config.customStyle?.button_group?.font,
}

const show = ref(false)
const extraTypes = ref<ExtraTypes<number>[]>([])
const optionMap = ref<{ [key: number]: string }>({})
const tnc = ref('')
const typeMapper = new Map()
const apiError = ref(false)
const validProps = ref(false)

const trans: Record<string, string> = {
    yours: t('yours'),
    your_guests: t('your_guests'),
    your_selected_preferences: t('your_selected_preferences'),
    guest_selected_preferences: t('guest_selected_preferences'),
    selected: t('selected'),
    i_agree: t('i_agree'),
    select_extra_preferences: t('select_extra_preferences'),
}

const btnName = computed(() => (data as any)['name_l' + config.langKey])

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
    tnc: t('this_field_is_required'),
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

        const inputField = document.getElementById(
            (data as any).fieldId,
        ) as HTMLInputElement
        if (inputField) {
            // console.log(inputField.value)
            inputField.value = formData
        }
    },
    {
        deep: true,
        // immediate: true,
    },
)
const fetchData = async () => {
    loading.setLoading(true)
    // fetch extra preference here
    const { outletId, params } = data
    try {
        const res = await apiGet<APIResponse<MemAttributeResponse>>(
            config.baseUrl + 'tms/booking/get_extra_preference',
            {
                outletId: outletId,
                memAttributeTypeIds: params.mem_attribute_types.value,
                tncId: params.terms_n_services_options.value,
            },
        )
        // console.log(res);
        if (res.error) {
            throw new Error(res.error)
        }
        extraTypes.value = res.memAttributeTypes?.map((mt) => {
            return {
                type: mt.MemAttributeType[`a    typ_name_l${config.langKey}`],
                id: mt.MemAttributeType.atyp_id,
                options: mt.MemAttributeOption.map((op) => {
                    optionMap.value[op.atto_id] =
                        op[`atto_name_l${config.langKey}`]
                    typeMapper.set(op.atto_id, mt.MemAttributeType.atyp_id)
                    return {
                        label: op[`atto_name_l${config.langKey}`],
                        value: op.atto_id,
                    }
                }),
            }
        })
        tnc.value = res.tnc
            .map((t) => t.TmsExtraType[`etyp_info_l${config.langKey}`])
            .join()

        setTimeout(() => {
            loading.setLoading(false)
        }, 300)
    } catch (error) {
        console.error(error)
        loading.setLoading(false)
        apiError.value = true
    }
}

onMounted(() => {
    // console.log('component mounted');
    // console.log(data)
    if (
        data.params.mem_attribute_types.value &&
        data.params.terms_n_services_options.value &&
        data.outletId
    ) {
        validProps.value = true
        fetchData()
    }
    // console.log(config)
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

const onClear = () => {
    activeTab.value === 'YOURS'
        ? form.value.selectedSet.clear()
        : form.value.guestSelectedSet.clear()
}
</script>
<template>
    <ButtonComponent
        v-if="validProps"
        :disabled="isLoading || apiError"
        :text="btnName"
        :icon="isLoading ? 'spinner' : 'plus'"
        :btnClassName="`px-1 py-2 btn btn-block btn-lg mb-2 flex items-center w-fit ${
            apiError ? ' border border-red-400 border-solid' : ''
        }`"
        iconClassName="w-6 h-6 ml-2 text-black"
        @click="showDialog(true)"
        :style="{ ...generalTextStyle, ...buttonStyles }"
    />
    <div
        v-if="form.selectedSet.size > 0 || form.guestSelectedSet.size > 0"
        class="selected-grid p-2"
        :style="generalTextStyle"
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
                class="m-1 ml-0 p-0 px-1 rounded"
                @click="
                    () => {
                        // optionOnClick(tag as number)
                    }
                "
                :style="{ ...buttonStyles }"
            >
                {{ optionMap[tag as number] }}
            </div>
        </div>
        <div
            class="js-input-data form-control p-2 h-40 overflow-auto my-2"
            :style="{
                width: 'unset',
                fontSize: '12px',
            }"
        >
            {{ tnc }}
        </div>
        <div class="flex items-center">
            <input
                :id="data.id + data.seq"
                type="checkbox"
                v-model="form.agree"
                class="checkbox-override w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded"
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
        <ExtraPreferenceModalContent
            :tabOnClick="tabOnClick"
            :clear="onClear"
            :optionOnClick="optionOnClick"
            :trans="trans"
            :activeTab="activeTab"
            :showList="showList"
            :optionMap="optionMap"
            :extraTypes="extraTypes"
            :buttonStyles="buttonStyles"
        />
    </ModalDialogHard>
</template>

<style scoped>
.btn:active {
    outline: 1px auto -webkit-focus-ring-color !important;
    outline-color: rgba(255, 255, 255, 0.2) !important;
}
.btn:focus {
    outline: 1px auto -webkit-focus-ring-color !important;
    outline-color: rgba(255, 255, 255, 0.2) !important;
}
.selected-grid {
    box-shadow: 10px 10px 5px 0px rgb(0 0 0 / 75%);
    -webkit-box-shadow: 0px 1px 5px 0px rgb(100 100 100 / 30%);
    -moz-box-shadow: 0px 1px 5px 0px rgb(100 100 100 / 30%);
}

.checkbox-override {
    margin: 0 !important;
    margin-right: 0.5rem !important;
}
</style>
