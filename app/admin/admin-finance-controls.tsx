"use client"

import { useState } from "react"
import { Loader2, Settings2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type FeeSet = {
  starterMonthly: number
  starterAnnual: number
  proMonthly: number
  proAnnual: number
  agencyMonthly: number
  agencyAnnual: number
}

type FinanceSettings = {
  domainYearlyCost: number
  hostingMonthlyCost: number
  scraperMonthlyCost: number
  openAiCostPerCall: number
  paypalFees: FeeSet
  twoCheckoutFees: FeeSet
}

type Props = {
  initialSettings: FinanceSettings
}

const feeRows: Array<{ key: keyof FeeSet; label: string }> = [
  { key: "starterMonthly", label: "Starter monthly" },
  { key: "starterAnnual", label: "Starter annual" },
  { key: "proMonthly", label: "Pro monthly" },
  { key: "proAnnual", label: "Pro annual" },
  { key: "agencyMonthly", label: "Agency monthly" },
  { key: "agencyAnnual", label: "Agency annual" },
]

export function AdminFinanceControls({ initialSettings }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState<FinanceSettings>(initialSettings)

  function setNumField(field: keyof Omit<FinanceSettings, "paypalFees" | "twoCheckoutFees">, value: string) {
    const parsed = Number(value)
    setValues((prev) => ({ ...prev, [field]: Number.isFinite(parsed) ? parsed : 0 }))
  }

  function setFeeField(provider: "paypalFees" | "twoCheckoutFees", field: keyof FeeSet, value: string) {
    const parsed = Number(value)
    setValues((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: Number.isFinite(parsed) ? parsed : 0,
      },
    }))
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/finance-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to save")
      toast.success("Finance settings updated")
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error?.message || "Failed to save finance settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="rounded-xl"
        onClick={() => setOpen(true)}
      >
        <Settings2 className="mr-2 h-4 w-4" />
        Configure costs & fees
      </Button>

      <Dialog open={open} onOpenChange={(next) => !saving && setOpen(next)}>
        <DialogContent className="z-[9999] w-full max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card p-0 shadow-2xl sm:max-w-5xl">
          <DialogHeader className="border-b border-border/50 bg-background/70 px-6 py-4 text-left">
            <DialogTitle>Profit Tracking Inputs</DialogTitle>
            <DialogDescription>
              Configure costs and transaction fees used in net profit calculations.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <h3 className="text-sm font-semibold">Recurring costs</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Monthly/annual expenses used in fixed-cost calculations.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="text-sm">
                    Domain yearly cost (USD)
                    <input type="number" min={0} step="0.01" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" value={values.domainYearlyCost} onChange={(e) => setNumField("domainYearlyCost", e.target.value)} />
                  </label>
                  <label className="text-sm">
                    Hosting monthly cost (USD)
                    <input type="number" min={0} step="0.01" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" value={values.hostingMonthlyCost} onChange={(e) => setNumField("hostingMonthlyCost", e.target.value)} />
                  </label>
                  <label className="text-sm">
                    Scraper API monthly cost (USD)
                    <input type="number" min={0} step="0.01" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" value={values.scraperMonthlyCost} onChange={(e) => setNumField("scraperMonthlyCost", e.target.value)} />
                  </label>
                  <label className="text-sm">
                    OpenAI cost per call (USD)
                    <input type="number" min={0} step="0.0001" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2" value={values.openAiCostPerCall} onChange={(e) => setNumField("openAiCostPerCall", e.target.value)} />
                  </label>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                  <h3 className="text-sm font-semibold">PayPal fees (USD per subscription)</h3>
                  <div className="mt-3 grid gap-2">
                    {feeRows.map(({ key, label }) => (
                      <label key={`paypal-${key}`} className="text-xs">
                        {label}
                        <input type="number" min={0} step="0.01" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm" value={values.paypalFees[key]} onChange={(e) => setFeeField("paypalFees", key, e.target.value)} />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                  <h3 className="text-sm font-semibold">2Checkout fees (USD per subscription)</h3>
                  <div className="mt-3 grid gap-2">
                    {feeRows.map(({ key, label }) => (
                      <label key={`2co-${key}`} className="text-xs">
                        {label}
                        <input type="number" min={0} step="0.01" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm" value={values.twoCheckoutFees[key]} onChange={(e) => setFeeField("twoCheckoutFees", key, e.target.value)} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          <div className="flex justify-end gap-2 border-t border-border/50 bg-background/70 px-6 py-4">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save settings
              </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
