import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type TrashEntityType =
  | "Employee"
  | "Department"
  | "Project"
  | "Task"
  | "Client"
  | "Leave Request"
  | "Attendance"
  | "Contract"
  | "Invoice"
  | "Document"

export type TrashItem = {
  id: string
  entityId: string
  entityType: TrashEntityType
  title: string
  subtitle: string
  deletedAt: string
  data: Record<string, unknown>
}

type TrashContextType = {
  trashItems: TrashItem[]
  moveToTrash: (
    entityType: TrashEntityType,
    entityId: string,
    title: string,
    subtitle: string,
    data: Record<string, unknown>
  ) => void
  restoreFromTrash: (
    id: string
  ) => TrashItem | null
  deleteForever: (id: string) => void
  emptyTrash: () => void
}

const TrashContext =
  createContext<TrashContextType | undefined>(
    undefined
  )

const STORAGE_KEY = "nexora-trash"

type TrashProviderProps = {
  children: ReactNode
}

export function TrashProvider({
  children,
}: TrashProviderProps) {
  const [trashItems, setTrashItems] =
    useState<TrashItem[]>(() => {
      try {
        const stored =
          localStorage.getItem(STORAGE_KEY)

        if (!stored) {
          return []
        }

        const parsed: unknown =
          JSON.parse(stored)

        return Array.isArray(parsed)
          ? (parsed as TrashItem[])
          : []
      } catch {
        return []
      }
    })

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(trashItems)
    )
  }, [trashItems])

  function moveToTrash(
    entityType: TrashEntityType,
    entityId: string,
    title: string,
    subtitle: string,
    data: Record<string, unknown>
  ) {
    const trashItem: TrashItem = {
      id: `${entityType
        .toLowerCase()
        .replace(/\s+/g, "-")}-${entityId}-${Date.now()}`,
      entityId,
      entityType,
      title,
      subtitle,
      deletedAt: new Date().toISOString(),
      data,
    }

    setTrashItems((currentItems) => [
      trashItem,
      ...currentItems,
    ])
  }

  function restoreFromTrash(id: string) {
    const item = trashItems.find(
      (trashItem) => trashItem.id === id
    )

    if (!item) {
      return null
    }

    setTrashItems((currentItems) =>
      currentItems.filter(
        (trashItem) => trashItem.id !== id
      )
    )

    return item
  }

  function deleteForever(id: string) {
    setTrashItems((currentItems) =>
      currentItems.filter(
        (trashItem) => trashItem.id !== id
      )
    )
  }

  function emptyTrash() {
    setTrashItems([])
  }

  return (
    <TrashContext.Provider
      value={{
        trashItems,
        moveToTrash,
        restoreFromTrash,
        deleteForever,
        emptyTrash,
      }}
    >
      {children}
    </TrashContext.Provider>
  )
}

export function useTrash() {
  const context = useContext(TrashContext)

  if (!context) {
    throw new Error(
      "useTrash must be used inside TrashProvider"
    )
  }

  return context
}