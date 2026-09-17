"use client"

/* @preview-handcrafted — the modal needs stateful open/close control,
 * so the auto-wrapper's <Component /> call renders nothing. This file
 * is protected from sync-kit overwrites via the marker above. */

import { useState } from "react"
import AddProductModal from "@/components/foundations/add-product-wizard-modal"

export function AddProductWizardModalPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-[480px] items-center justify-center">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-[#1A1A1A] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-black"
        >
          Open Add Product wizard
        </button>
      ) : (
        <AddProductModal
          open
          onClose={() => setOpen(false)}
          onPublish={() => setOpen(false)}
        />
      )}
    </div>
  )
}
