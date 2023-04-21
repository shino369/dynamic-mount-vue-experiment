import { ref } from "vue"
import { defineStore } from "pinia"
import type { FileObj, Folder, OrderType, SortType } from "@/types"
import { toast } from "vue3-toastify"
import localforage from "localforage"

export const MAX_LENGTH = 1000

enum ERROR {
  MAX_LENGTH_EXCEED = "Number of files exceed limit of 1000",
  FILE_SIZE_EXCEED = "FILE_SIZE_EXCEED",
  FOLDER_NOT_YET_INITIALIZED = "FOLDER_NOT_YET_INITIALIZED",
  FOLDER_NOT_FOUND = "FOLDER_NOT_FOUND",
  FOLDER_NAME_EXIST = "FOLDER_NAME_EXIST",
  FILE_NAME_EXIST = "FOLDER_NAME_EXIST",
  FILE_NOT_FOUND = "FILE_NOT_FOUND",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
}

const showError = (err: string) => {
  toast(err, {
    type: "error",
  }) // ToastOptions
}

export const useFolderStore = defineStore("folders", () => {
  const folders = ref<Folder>({})
  const sortBy = ref<SortType>("lastModified")
  const orderBy = ref<OrderType>("desc")

  const setSort = (folderName: string, type: SortType) => {
    try {
      sortBy.value = type
      if (!folders.value[folderName]) {
        throw new Error(ERROR.FOLDER_NOT_FOUND)
      }
      folders.value[folderName] = sortList(folders.value[folderName])
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  const setOrder = (folderName: string, type: OrderType) => {
    try {
      orderBy.value = type
      if (!folders.value[folderName]) {
        throw new Error(ERROR.FOLDER_NOT_FOUND)
      }
      folders.value[folderName] = sortList(folders.value[folderName])
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  const checkFolderExist = (folderName: string) => {
    try {
      if (folders.value[folderName]) {
        return true
      } else {
        throw new Error(ERROR.FOLDER_NOT_FOUND)
      }
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
    return false
  }

  const getFolder = (folderName: string) => {
    try {
      const folder = folders.value
      if (!folder[folderName]) {
        throw new Error(ERROR.FOLDER_NOT_FOUND)
      }
      return folder[folderName]
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
    return []
  }

  const checkExist = (folderName: string, fileName: string) => {
    try {
      if (!folders.value[folderName]) {
        throw new Error(ERROR.FOLDER_NOT_FOUND)
      }
      return folders.value[folderName].findIndex(
        (i) => i.file.name === fileName
      )
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
    return -1
  }

  const getFileLength = (folderName: string) => {
    try {
      const folder = folders.value

      if (!folder[folderName]) {
        throw new Error(ERROR.FOLDER_NOT_FOUND)
      }

      return folder[folderName].length
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
    return 0
  }

  const sortList = (files: FileObj[]) => {
    switch (sortBy.value) {
      case "name":
        files.sort((a, b) =>
          orderBy.value === "desc"
            ? b.file.name.localeCompare(a.file.name)
            : a.file.name.localeCompare(b.file.name)
        )
        break
      case "size":
        files.sort((a, b) =>
          orderBy.value === "desc"
            ? b.file.size - a.file.size
            : a.file.size - b.file.size
        )
        break
      case "lastModified":
      default:
        console.log("sorting")
        files.sort((a, b) =>
          orderBy.value === "desc"
            ? b.file.lastModified - a.file.lastModified
            : a.file.lastModified - b.file.lastModified
        )
        break
    }

    return files
  }

  const getSection = (
    folderName: string,
    offset: number,
    limit: number,
    searchName?: string
  ) => {
    try {
      const folder = searchName
        ? folders.value[folderName].filter((file) =>
            file.file.name
              .toLocaleLowerCase()
              .includes(searchName.toLocaleLowerCase())
          )
        : folders.value[folderName]

      if (!folder) {
        throw new Error(ERROR.FOLDER_NOT_FOUND)
      }

      let end = offset + limit
      const start = offset

      if (end > folder.length) {
        // get all
        end = folder.length
      }

      if (start > end) {
        // should not happed
        throw new Error(ERROR.UNEXPECTED_ERROR)
      }

      return { data: folder.slice(start, end), size: folder.length }
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }

    return { data: [], size: 0 }
  }

  const getFileByIndex = (folderName: string, index: number) => {
    try {
      if (!folders.value[folderName]) {
        throw new Error(ERROR.FOLDER_NOT_FOUND)
      }

      const file = folders.value[folderName][index]

      if (!file) {
        throw new Error(ERROR.FILE_NOT_FOUND)
      }

      return file.file
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
    return undefined
  }

  const getFolderList = () => {
    try {
      const list = Object.keys(folders.value).sort()
      return list
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
    return []
  }

  const addNewFolder = (folderName: string) => {
    try {
      if (folders.value[folderName]) {
        throw new Error(ERROR.FOLDER_NAME_EXIST)
      }
      folders.value[folderName] = []
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  const setFolder = (folderName: string, newFiles: FileObj[]) => {
    try {
      folders.value[folderName] = sortList(newFiles)
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  const addFile = (folderName: string, file: FileObj) => {
    try {
      // check if max length exceed
      if (folders.value[folderName].length + 1 > MAX_LENGTH) {
        throw new Error(ERROR.MAX_LENGTH_EXCEED)
      }
      folders.value[folderName].push(file)
      folders.value[folderName] = sortList(folders.value[folderName])
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  const addFiles = (folderName: string, files: FileObj[]) => {
    try {
      // check if max length exceed
      if (folders.value[folderName].length + files.length > MAX_LENGTH) {
        throw new Error(ERROR.MAX_LENGTH_EXCEED)
      }
      folders.value[folderName].push(...files)
      folders.value[folderName] = sortList(folders.value[folderName])
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  const renameFile = (folderName: string, oldName: string, newName: string) => {
    try {
      const itemIndex = folders.value[folderName].findIndex(
        (i) => i.file.name === oldName
      )
      if (itemIndex === -1) {
        throw new Error(ERROR.FILE_NOT_FOUND)
      }
      folders.value[folderName][itemIndex].file = new File(
        [folders.value[folderName][itemIndex].file],
        newName,
        { type: folders.value[folderName][itemIndex].file.type }
      )
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  const renameFolder = (oldFolderName: string, newFolderName: string) => {
    try {
      folders.value[newFolderName] = folders.value[oldFolderName]
      delete folders.value[oldFolderName]
      localforage.removeItem("folders_" + oldFolderName.split(" ").join("-"))
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  const removeFile = (folderName: string, name: string) => {
    try {
      // use splice O(1) instead of filter O(N)
      const itemIndex = folders.value[folderName].findIndex(
        (i) => i.file.name === name
      )
      if (itemIndex > -1) {
        folders.value[folderName].splice(itemIndex, 1)
      } else {
        throw new Error(ERROR.FILE_NOT_FOUND)
      }
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  const removeFiles = (folderName: string, names: string[]) => {
    try {
      // use splice O(1) instead of filter O(N)
      let errorCount = 0
      names.forEach((name) => {
        const itemIndex = folders.value[folderName].findIndex(
          (i) => i.file.name === name
        )

        if (itemIndex > -1) {
          folders.value[folderName].splice(itemIndex, 1)
        } else {
          errorCount++
        }
      })

      if (errorCount > 0) {
        throw new Error(
          `${errorCount} file(s) not found. Perhaps already removed.`
        )
      }
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  const clearFolder = (folderName: string) => {
    folders.value[folderName] = []
  }

  const removeFolder = (folderName: string) => {
    try {
      if (folders.value[folderName]) {
        delete folders.value[folderName]
        localforage
          .removeItem("folders_" + folderName.split(" ").join("-"), (err) => {
            if (err) throw new Error(err)
          })
          .then(() => {
            console.log("removed")
          })
      } else {
        throw new Error(ERROR.FOLDER_NOT_FOUND)
      }
    } catch (e) {
      const err = (e as Error).message
      // show toast
      showError(err)
    }
  }

  return {
    folders,
    sortBy,
    orderBy,
    setSort,
    setOrder,
    checkExist,
    getFolder,
    getSection,
    getFileLength,
    getFolderList,
    addNewFolder,
    setFolder,
    clearFolder,
    removeFolder,
    addFile,
    addFiles,
    removeFile,
    removeFiles,
    renameFile,
    renameFolder,
    checkFolderExist,
    getFileByIndex,
  }
})
