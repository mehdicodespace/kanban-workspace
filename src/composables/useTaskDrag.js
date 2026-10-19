import { onBeforeUnmount, ref } from 'vue'

export function useTaskDrag(onDrop) {
  const draggingTask = ref(null)
  const dragPreview = ref(null)
  const dropTargetStatus = ref('')

  let activePointerId = null
  let pointerListeners = null

  function endDrag() {
    removePointerListeners()
    draggingTask.value = null
    dragPreview.value = null
    dropTargetStatus.value = ''
  }

  function removePointerListeners() {
    if (pointerListeners) {
      document.removeEventListener('pointermove', pointerListeners.updateTarget)
      document.removeEventListener('pointerup', pointerListeners.finishPointer)
      document.removeEventListener('pointercancel', pointerListeners.cancelPointer)
      document.removeEventListener('mousemove', pointerListeners.updateTarget)
      document.removeEventListener('mouseup', pointerListeners.finishPointer)
      pointerListeners = null
    }
    activePointerId = null
  }

  function startDrag({ task, event, rect } = {}) {
    if (!task || !event || !rect) return

    activePointerId = event.pointerId ?? null
    draggingTask.value = task
    dragPreview.value = {
      x: event.clientX,
      y: event.clientY,
      width: rect.width,
      height: rect.height,
      offsetX: rect.offsetX,
      offsetY: rect.offsetY
    }
    dropTargetStatus.value = ''

    const updateTarget = (pointerEvent) => {
      if (
        typeof pointerEvent.pointerId === 'number' &&
        activePointerId !== null &&
        pointerEvent.pointerId !== activePointerId
      ) {
        return
      }

      if (dragPreview.value) {
        dragPreview.value = {
          ...dragPreview.value,
          x: pointerEvent.clientX,
          y: pointerEvent.clientY
        }
      }

      const column = document
        .elementFromPoint(pointerEvent.clientX, pointerEvent.clientY)
        ?.closest('[data-drop-status]')
      const status = column?.getAttribute('data-drop-status') || ''
      dropTargetStatus.value = status !== task.status ? status : ''
    }

    const finishPointer = (pointerEvent) => {
      if (
        typeof pointerEvent.pointerId === 'number' &&
        activePointerId !== null &&
        pointerEvent.pointerId !== activePointerId
      ) {
        return
      }

      updateTarget(pointerEvent)
      const status = dropTargetStatus.value
      endDrag()
      if (status) onDrop({ task, status })
    }

    const cancelPointer = (pointerEvent) => {
      if (
        typeof pointerEvent.pointerId === 'number' &&
        activePointerId !== null &&
        pointerEvent.pointerId !== activePointerId
      ) {
        return
      }

      endDrag()
    }

    pointerListeners = { updateTarget, finishPointer, cancelPointer }
    document.addEventListener('pointermove', updateTarget)
    document.addEventListener('pointerup', finishPointer)
    document.addEventListener('pointercancel', cancelPointer)
    document.addEventListener('mousemove', updateTarget)
    document.addEventListener('mouseup', finishPointer)
  }

  onBeforeUnmount(endDrag)

  return { draggingTask, dragPreview, dropTargetStatus, startDrag, endDrag }
}
