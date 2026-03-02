import { useConfirm } from 'primevue/useconfirm'

type ConfirmDeleteParams = {
  message: string
  header?: string
  acceptLabel?: string
  rejectLabel?: string
  onAccept: () => void | Promise<void>
}

export function useConfirmDelete() {
  const confirm = useConfirm()

  const confirmDelete = ({
    message,
    header = 'Confirmar eliminación',
    acceptLabel = 'Aceptar',
    rejectLabel = 'Cancelar',
    onAccept,
  }: ConfirmDeleteParams) => {
    confirm.require({
      message,
      header,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel,
      rejectLabel,
      acceptClass: 'p-button-danger',
      accept: async () => {
        await onAccept()
      },
    })
  }

  return {
    confirmDelete,
  }
}
