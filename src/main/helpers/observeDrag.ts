import { IPoint, pointSub } from "../../common/geometry"
import { getClientPos } from "./mouseEvent"

export interface DragHandler {
  onMouseMove?: (e: PointerEvent) => void
  onMouseUp?: (e: PointerEvent) => void
  onClick?: (e: PointerEvent) => void
}

export const observeDrag = ({
  onMouseMove,
  onMouseUp,
  onClick,
}: DragHandler) => {
  let isMoved = false

  const onGlobalPointerMove = (e: PointerEvent) => {
    isMoved = true
    onMouseMove?.(e)
  }

  const onGlobalPointerUp = (e: PointerEvent) => {
    onMouseUp?.(e)

    if (!isMoved) {
      onClick?.(e)
    }

    document.removeEventListener("pointermove", onGlobalPointerMove)
    document.removeEventListener("pointerup", onGlobalPointerUp)
  }

  document.addEventListener("pointermove", onGlobalPointerMove)
  document.addEventListener("pointerup", onGlobalPointerUp)
}

export interface DragHandler2 {
  onMouseMove?: (e: PointerEvent, delta: IPoint) => void
  onMouseUp?: (e: PointerEvent) => void
  onClick?: (e: PointerEvent) => void
}

export const observeDrag2 = (
  e: MouseEvent,
  { onMouseMove, onMouseUp, onClick }: DragHandler2
) => {
  let isMoved = false
  const startClientPos = getClientPos(e)

  const onGlobalPointerMove = (e: PointerEvent) => {
    isMoved = true
    const clientPos = getClientPos(e)
    const delta = pointSub(clientPos, startClientPos)
    onMouseMove?.(e, delta)
  }

  const onGlobalPointerUp = (e: PointerEvent) => {
    onMouseUp?.(e)

    if (!isMoved) {
      onClick?.(e)
    }

    document.removeEventListener("pointermove", onGlobalPointerMove)
    document.removeEventListener("pointerup", onGlobalPointerUp)
  }

  document.addEventListener("pointermove", onGlobalPointerMove)
  document.addEventListener("pointerup", onGlobalPointerUp)
}
