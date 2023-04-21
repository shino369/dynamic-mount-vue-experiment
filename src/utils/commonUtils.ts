import { useSideBar } from "@/stores/sidebar"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"

export const generateURL = (file: File, revoke: boolean = true) => {
  const fileSrc = URL.createObjectURL(file)

  if(revoke) {
    setTimeout(() => {
      URL.revokeObjectURL(fileSrc)
    }, 1000)
  }

  return fileSrc
}



export const collapseSideBar = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const sideBarStore = useSideBar()
  if (breakpoints.isSmaller("sm")) {
    sideBarStore.toggle(false)
  }
}