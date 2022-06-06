const DOUBLE_CLICK_INTERVAL = 500

// call from onMouseDown
export const observeDoubleClick = (onDoubleClick: () => void) => {
  let isMoved = false

  const onGlobalPointerMove = () => (isMoved = true)

  const onGlobalPointerDown = () => {
    if (!isMoved) {
      onDoubleClick()
    }
    removeListeners()
  }

  // wait a moment to prevent to catch mousedown event immediately
  setTimeout(() => {
    document.addEventListener("pointerdown", onGlobalPointerDown)
    document.addEventListener("pointermove", onGlobalPointerMove)
  }, 1)

  const removeListeners = () => {
    document.removeEventListener("pointerdown", onGlobalPointerDown)
    document.removeEventListener("pointermove", onGlobalPointerMove)
  }

  setTimeout(removeListeners, DOUBLE_CLICK_INTERVAL)
}
