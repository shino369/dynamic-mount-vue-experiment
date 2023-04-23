<script setup lang="ts">
import IconButton from "@/components/IconButton.vue"
import ModalDialogHard from "@/components/ModalDialogHard.vue"
import type { ExtraTypes, MemAttributeResponse } from "@/types"
import { apiGet } from "@/utils/commonUtils"
import { computed, onMounted, ref, watch } from "vue"

interface Props {
  data: any
  t: Function
}
const props = defineProps<Props>()
const show = ref(false)
const extraTypes = ref<ExtraTypes<number>[]>([])
const optionMap = ref<{ [key: number]: string }>({})
const tnc = ref("")
const typeMapper = new Map()

const error = {
  tnc: "this_field_is_required",
}

const activeTab = ref("YOURS")

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
      newState.selectedSet.size === 0 && newState.guestSelectedSet.size === 0
        ? ""
        : JSON.stringify({
            label: props.data.name_l1,
            selectedSet: Array.from(newState.selectedSet).map((id) => ({
              optionId: id,
              typeId: typeMapper.get(id),
            })),
            guestSelectedSet: Array.from(newState.guestSelectedSet).map(
              (id) => ({
                optionId: id,
                typeId: typeMapper.get(id),
              })
            ),
            tnc: {
              // typeId:
              id: props.data.params.terms_n_services_options.value,
              agree: newState.agree,
            },
          })
    // console.log(JSON.formData);

    document
      .getElementById("#ResvExtraPreference" + props.data.seq)
      ?.setAttribute("value", formData)
  },
  {
    deep: true,
    // immediate: true,
  }
)
const fetchData = async () => {
  // fetch extra preference here
  const { outletId, params } = props.data
  const res = await apiGet<MemAttributeResponse>(
    props.data.baseUrl + "some_api_get_extra_preference",
    {
      outletId: outletId,
      memAttributeTypeIds: params.mem_attribute_types.value,
      tncId: params.terms_n_services_options.value,
    }
  )
  // console.log(res);
  extraTypes.value = res.memAttributeTypes.map((mt) => {
    return {
      type: mt.MemAttributeType[`atyp_name_l${props.data.langKey}`],
      id: mt.MemAttributeType.atyp_id,
      options: mt.MemAttributeOption.map((op) => {
        optionMap.value[op.atto_id] = op[`atto_name_l${props.data.langKey}`]
        typeMapper.set(op.atto_id, mt.MemAttributeType.atyp_id)
        return {
          label: op[`atto_name_l${props.data.langKey}`],
          value: op.atto_id,
        }
      }),
    }
  })
  tnc.value = res.tnc
    .map((t) => t.TmsExtraType[`etyp_info_l${props.data.langKey}`])
    .join()
}

onMounted(() => {
  // console.log('component mounted');
  // console.log(props.data);
  // fetchData()
})
const showList = computed(() =>
  activeTab.value === "YOURS"
    ? form.value.selectedSet
    : form.value.guestSelectedSet
)
const showDialog = (s: boolean) => {
  show.value = s
}

const tabOnClick = (e: string) => {
  activeTab.value = e
}

const optionOnClick = (e: number) => {
  if (activeTab.value === "YOURS") {
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
    class="dialog-btn btn btn-block btn-lg mb-2 flex items-center text-xs text-black"
    @click="showDialog(true)"
  >
    show_options
    <IconButton :name="'plus'" iconClassName="" />
  </div>
  <div
    v-if="form.selectedSet.size > 0 || form.guestSelectedSet.size > 0"
    class="text-xs"
  >
    <div
      class="flex items-center flex-wrap pb-2"
      :style="{
        borderBottom: '1px solid lightgray',
      }"
    >
      <div class="w-[130px]">your selected preference:</div>
      <div
        v-for="(tag, index) in Array.from(form.selectedSet)"
        :key="index"
        class="text-xs m-1 ml-0 p-0 px-1 rounded"
        :style="{
          backgroundColor: index % 2 === 0 ? 'lightsteelblue' : 'lightgray',
        }"
      >
        {{ optionMap[tag] }}
      </div>
    </div>
    <div class="flex items-center flex-wrap">
      <div class="w-[130px] text-xs">guest selected preference:</div>
      <div
        v-for="(tag, index) in Array.from(form.guestSelectedSet)"
        :key="index"
        class="text-xs m-1 mr-0 py-0 px-1 rounded"
        :style="{
          backgroundColor: index % 2 === 0 ? 'lightsteelblue' : 'lightgray',
        }"
      >
        {{ optionMap[tag] }}
      </div>
      <!-- tag here -->
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
      <label :for="data.id + data.seq" class="mb-0"> I agree </label>
      <div v-if="!form.agree" class="ml-2 text-red-600">
        {{ error["tnc"] }}
      </div>
    </div>
  </div>

  <ModalDialogHard :showDialog="showDialog" :show="show">
    <div class="switch-tab-row" style="padding-top: 1rem">
      <div class="tab-item" @click="tabOnClick('YOURS')">
        <div class="text-abs">YOURS</div>
        YOURS
      </div>
      <div class="tab-item" @click="tabOnClick('YOUR GUESTS')">
        <div class="text-abs">YOUR GUESTS</div>
        YOUR GUESTS
      </div>
      <div
        class="tab-layer"
        :class="{
          'translate-right': activeTab !== 'YOURS',
        }"
      ></div>
    </div>
    <div
      class="selected-list-row flex items-center min-h-[45px] flex-wrap mb-4 py-4"
      :style="{
        borderBottom: '1px solid lightgray',
      }"
    >
      <div class="mr-2">selected:</div>
      <div
        v-for="(tag, index) in Array.from(showList)"
        :key="index"
        class="flex center text-xs m-1 ml-0 py-0 px-1 rounded"
        :style="{
          backgroundColor: index % 2 === 0 ? 'lightsteelblue' : 'lightgray',
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
    <div class="option-inner-container flex-col px-2" id="scroll-container">
      <div v-for="(extraType, index) in extraTypes" :key="index">
        <div>
          {{ extraType.type }}
        </div>
        <div class="flex flex-wrap">
          <div
            v-for="(option, index) in extraType.options"
            :key="index"
            @click="optionOnClick(option.value)"
            class="option-item"
            :class="{
              'option-selected': showList.has(option.value),
            }"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="option-bottom-row"></div>
  </ModalDialogHard>
</template>

<style scoped></style>
