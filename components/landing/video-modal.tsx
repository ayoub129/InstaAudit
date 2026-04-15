"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

interface VideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  videoId: string
}

export function VideoModal({ open, onOpenChange, videoId }: VideoModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 outline-none">
          <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Demo Video"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}