<script setup lang="ts">
import IconButton from "@/components/IconButton.vue"
import PopupDialog from "@/components/PopupDialog.vue"
import { useFolderStore } from "@/stores/folders"
import { useModal } from "@/stores/modal"
import { computed, ref, shallowRef } from "vue"
import { RouterLink } from "vue-router"

const folderStore = useFolderStore()
const modal = useModal()
const folders = computed(() => folderStore.getFolderList())
const currentFolderName = ref<string>("")
const newFolderName = ref<string>("")
const enabledSelect = ref<boolean>(false)
const dotClicked = ref<boolean>(false)
const selectedFolderList = ref<string[]>([])

const onAddToSelected = (folderName: string) => {
  if (selectedFolderList.value.find((f) => f === folderName)) {
    selectedFolderList.value = selectedFolderList.value.filter(
      (f) => f !== folderName
    )
  } else {
    selectedFolderList.value.push(folderName)
  }
}

const onDeleteSelected = () => {
  if (selectedFolderList.value.length > 0) {
    modal.open({
      detail: {
        header: "delete",
        content: `Are you sure you want to delete ${selectedFolderList.value.length} folder(s)?`,
        actionBtns: [
          {
            name: "cancel",
            iconName: "close",
            onClick: () => {
              modal.close()
            },
          },
          {
            name: "confirm",
            iconName: "confirm",
            onClick: () => {
              confirmDelete()
              modal.close()
            },
          },
        ],
      },
      component: shallowRef(PopupDialog),
      onClose: () => {},
      type: "popup",
    })
  }
}

const confirmDelete = () => {
  selectedFolderList.value.forEach((folder) => {
    folderStore.removeFolder(folder)
  })

  clearSelected()
}

const clearSelected = () => {
  dotClicked.value = false
  enabledSelect.value = false
  selectedFolderList.value = []
}

const onDotClick = () => {
  dotClicked.value = !dotClicked.value

  if (!dotClicked.value) {
    clearSelected()
  }
}

const onEditClick = () => {
  enabledSelect.value = !enabledSelect.value
  if (!enabledSelect.value) {
    enabledSelect.value = false
    selectedFolderList.value = []
  }
}

const onSelectAll = () => {
  if (selectedFolderList.value.length > 0) {
    selectedFolderList.value = []
  } else {
    selectedFolderList.value = folders.value
  }
}

const onEditNameClick = (name: string) => {
  currentFolderName.value = name
  newFolderName.value = name
  modal.open({
    detail: {
      header: "Edit Folder Name",
      content: ``,
      inputValue: newFolderName.value,
      onInputChange: (e: Event) => {
        newFolderName.value = (e.target as HTMLInputElement).value
      },
      actionBtns: [
        {
          name: "cancel",
          iconName: "close",
          onClick: () => {
            modal.close()
          },
        },
        {
          name: "confirm",
          iconName: "confirm",
          onClick: () => {
            if (newFolderName.value.trim() !== "") {
              if (currentFolderName.value === newFolderName.value) {
                modal.close()
              } else if (folders.value.includes(newFolderName.value)) {
                modal.open({
                  detail: {
                    header: "Error: Folder Already exist",
                    headerClass: "text-red-500",
                    content: `Folder already exist. Please use oth name.`,
                    actionBtns: [
                      {
                        name: "confirm",
                        iconName: "confirm",
                        onClick: () => {
                          modal.close()
                        },
                      },
                    ],
                  },
                  component: shallowRef(PopupDialog),
                  onClose: () => {},
                  type: "popup",
                })
              } else {
                folderStore.renameFolder(
                  currentFolderName.value,
                  newFolderName.value
                )
                modal.close()
              }
            }
          },
        },
      ],
    },
    component: shallowRef(PopupDialog),
    onClose: () => {},
    type: "popup",
  })
}

const onAddNewFolderClick = () => {
  newFolderName.value = ""
  modal.open({
    detail: {
      header: "Add New Folder",
      content: ``,
      inputValue: newFolderName.value,
      onInputChange: (e: Event) => {
        newFolderName.value = (e.target as HTMLInputElement).value
      },
      actionBtns: [
        {
          name: "cancel",
          iconName: "close",
          onClick: () => {
            modal.close()
          },
        },
        {
          name: "confirm",
          iconName: "confirm",
          onClick: () => {
            if (newFolderName.value.trim() !== "") {
              if (folders.value.includes(newFolderName.value)) {
                modal.open({
                  detail: {
                    header: "Error: Folder Already exist",
                    headerClass: "text-red-500",
                    content: `Folder already exist. Please use other names.`,
                    actionBtns: [
                      {
                        name: "confirm",
                        iconName: "confirm",
                        onClick: () => {
                          modal.close()
                        },
                      },
                    ],
                  },
                  component: shallowRef(PopupDialog),
                  onClose: () => {},
                  type: "popup",
                })
              } else {
                folderStore.addNewFolder(newFolderName.value)
                modal.close()
              }
            }
          },
        },
      ],
    },
    component: shallowRef(PopupDialog),
    onClose: () => {},
    type: "popup",
  })
}
</script>

<template>
  <div
    class="h-full transition-all"
    :class="{
      'bg-zinc-400': enabledSelect,
    }"
  >
    <!-- buttons groups -->
    <div
      class="flex justify-end items-center overflow-hidden transition-transform"
    >
      <div
        class="text-sm md:text-base whitespace-nowrap mr-auto capitalize pr-2"
      ></div>
      <div
        class="rounded-lg py-1 flex justify-end bg-slate-100 overflow-hidden transition-all"
        :class="{
          'bg-slate-300': !enabledSelect,
          'w-0': !dotClicked,
          'px-4 mr-2': dotClicked,
          'w-[5.5rem]': dotClicked && !enabledSelect,
          'w-[calc(100%-4rem)]': dotClicked && enabledSelect,
        }"
      >
        <IconButton
          v-if="!enabledSelect"
          @click="onAddNewFolderClick"
          name="plus"
          class="cursor-pointer mr-2"
          icon-class-name="w-6 h-6 text-black"
        />
        <IconButton
          v-if="!enabledSelect"
          @click="onEditClick"
          name="edit"
          class="cursor-pointer"
          icon-class-name="w-6 h-6 text-black"
        />

        <div
          class="transition-all flex overflow-hidden items-center"
          :class="{
            'w-0': !enabledSelect,
            'mr-auto': enabledSelect,
          }"
        >
          <IconButton
            @click="onDeleteSelected"
            name="trash"
            class="cursor-pointer"
            :class="{
              'w-0': !enabledSelect,
            }"
            icon-class-name="w-6 h-6 text-black"
          />
          <div
            v-if="enabledSelect && selectedFolderList.length > 0 && dotClicked"
            class="ml-2 text-ellipsis text-sm md:text-base whitespace-nowrap"
          >
            {{ selectedFolderList.length }} item(s) selected
          </div>
        </div>

        <IconButton
          @click="onSelectAll"
          name="all"
          class="cursor-pointer overflow-hidden transition-all"
          :class="{
            'w-0': !enabledSelect,
            'w-6 mr-2': enabledSelect,
          }"
          icon-class-name="w-6 h-6 text-black"
        />
        <IconButton
          v-if="enabledSelect"
          @click="onEditClick"
          name="close"
          class="cursor-pointer"
          icon-class-name="w-6 h-6 text-black"
        />
      </div>

      <IconButton
        @click="onDotClick"
        name="threeDot"
        class="cursor-pointer"
        icon-class-name="w-6 h-6 text-black"
      />
    </div>

    <div
      class="w-full h-full p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 grid-flow-row gap-2 auto-rows-min"
    >
      <div
        v-for="(folder, index) in folders"
        :key="index"
        class="col-auto flex-col w-[6rem] md:w-[10rem] mb-4 relative"
      >
        <RouterLink
          @click.prevent="onAddToSelected(folder)"
          class="mb-4 flex justify-center hover:opacity-80 rounded-tl-2xl items-center w-[6rem] md:w-[10rem] h-[6rem] md:h-[10rem] bg-slate-200 shadow-sm shadow-slate-300"
          :to="`/folder/${folder}`"
          :class="{
            'opacity-30': enabledSelect && !selectedFolderList.includes(folder),
          }"
        />
        <div
          @click="onAddToSelected(folder)"
          class="w-full h-full top-0 left-0 absolute cursor-pointer"
          :class="{
            hidden: !enabledSelect,
          }"
        ></div>
        <div class="flex justify-between items-center">
          <div class="break-all">{{ folder }}</div>
          <IconButton
            @click="onEditNameClick(folder)"
            name="edit"
            class="cursor-pointer"
            icon-class-name="h-5 w-5 md:h-6 md:w-6 text-black"
          />
        </div>
      </div>
    </div>
  </div>
</template>
