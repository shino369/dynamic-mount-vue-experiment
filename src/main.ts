import { createApp, ref } from "vue"
import { createPinia, type Store } from "pinia"

import App from "@/App.vue"
import router from "@/router"
import localForage from "localforage"
import "@/assets/main.css"
import _ from "lodash"
import type { FileObj, Folder } from "./types"
import Vue3Toastify, { toast, type ToastContainerOptions } from "vue3-toastify"
import "vue3-toastify/dist/index.css"
import { BehaviorSubject } from "rxjs"

const consoleStyle = `color: white; background: #483D8B; padding: 0.2rem;`

const app = createApp(App)

localForage.config({
  driver: localForage.INDEXEDDB, // This force IndexedDB as the driver
})

const toPersist = ["folders"]
export const rehydrate = new BehaviorSubject<boolean>(false)

const indexDbPlugin = async ({ store }: { store: Store }) => {
  if (toPersist.includes(store.$id)) {
    const stored: { [key: string]: any } | null = await localForage.getItem(
      store.$id + "-state",
      (err) => {
        if (err)
          toast("Error occur when getting file from store.", {
            type: "error",
          })
      }
    )

    if (stored) {
      console.log(`%c [rehydrating ${store.$id} store...] `, consoleStyle)
      const folderKeys = (stored.folderKeys as string[]) || []

      const folders: Folder = {}
      // do not use forEach for async. use normal for loop.
      for (let i = 0; i < folderKeys.length; i++) {
        const key = folderKeys[i]
        const res: FileObj[] | null = await localForage.getItem(
          store.$id + "_" + key.split(" ").join("-"),
          (err) => {
            if (err)
              toast("Error occur when getting file from store.", {
                type: "error",
              })
          }
        )
        if (res) {
          folders[key] = res
        }
        console.log(`%c [rehydraeted folder ${key}] `, consoleStyle)
      }

      const reconstructed = {
        ..._.pickBy(stored, (_value, key) => key !== "folderKeys"),
        folders: folders,
      }

      store.$patch(reconstructed)
      rehydrate.next(true)
    }
    store.$subscribe(() => {
      console.log(
        `%c [persisting item from ${store.$id} to indexeddb...] `,
        consoleStyle
      )
      const folderKeys = Object.entries((store.$state as any).folders) as [
        key: string,
        value: FileObj[]
      ][]

      // save folder to separated key store to prevent combined large store
      for (const [key, value] of folderKeys) {
        console.log(
          `%c [persisting folder ${key} to indexeddb...] `,
          consoleStyle
        )
        localForage
          .setItem(
            store.$id + "_" + key.split(" ").join("-"),
            _.cloneDeep(value)
          )
          .then(
            (_res) => {},
            (_err) => {
              toast("Error occur when saing file to store.", {
                type: "error",
              })
            }
          )
      }

      // filter out folder
      const newObj = {
        ..._.pickBy(store.$state, (_value, key) => key !== "folders"),
        folderKeys: Object.keys((store.$state as any).folders),
      }

      // set reminded small item
      localForage.setItem(store.$id + "-state", { ...newObj }).then(
        (_res) => {},
        (_err) => {
          toast("Error occur when saing file to store.", {
            type: "error",
          })
        }
      )

      // for empty data in indexeddb
      if (!rehydrate.getValue()) {
        rehydrate.next(true)
      }
    })
  }
}

const pinia = createPinia()
pinia.use(indexDbPlugin)

app.use(pinia)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
  theme: "dark",
  closeOnClick: true,
} as ToastContainerOptions)

router.isReady().then(() => {
  app.mount("#app")
})
