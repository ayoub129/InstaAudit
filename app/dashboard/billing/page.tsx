import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Download, Plus } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      <Tabs defaultValue="subscription" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing-history">Billing History</TabsTrigger>
        </TabsList>
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the Pro plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xl">Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">$19 per month</p>
                  </div>
                  <Badge>Current Plan</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">3 Instagram profiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Advanced bio optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Unlimited content recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Daily analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Competitor analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">Your subscription renews on June 22, 2025</div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Button className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600">Upgrade to Business</Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Change Billing Cycle
              </Button>
              <Button variant="ghost" className="w-full sm:w-auto text-red-500 hover:text-red-600 hover:bg-red-50">
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>Compare our available plans and choose the best one for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <h3 className="font-bold">Free</h3>
                  <p className="text-sm text-muted-foreground">$0 per month</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />1 Instagram profile
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Basic bio analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Limited content recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Weekly analytics
                    </li>
                  </ul>
                  <Button variant="outline" className="mt-4 w-full">
                    Downgrade
                  </Button>
                </div>
                <div className="rounded-lg border border-pink-500 bg-pink-50 p-4 relative">
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 rounded-full bg-pink-500 px-3 py-1 text-xs font-medium text-white">
                    Current
                  </div>
                  <h3 className="font-bold">Pro</h3>
                  <p className="text-sm text-muted-foreground">$19 per month</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />3 Instagram profiles
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Advanced bio optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Unlimited content recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Daily analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Competitor analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Priority support
                    </li>
                  </ul>
                  <Button disabled className="mt-4 w-full bg-pink-500 hover:bg-pink-600">
                    Current Plan
                  </Button>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-bold">Business</h3>
                  <p className="text-sm text-muted-foreground">$49 per month</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      10 Instagram profiles
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Team collaboration
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      White-label reports
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      API access
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Dedicated account manager
                    </li>
                  </ul>
                  <Button className="mt-4 w-full bg-pink-500 hover:bg-pink-600">Upgrade</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment-methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and billing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-16 items-center justify-center rounded-md bg-slate-100">
                      <CreditCard className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 04/2026</p>
                    </div>
                  </div>
                  <Badge>Default</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Update your billing information for invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm">john.doe@example.com</p>
                  <p className="text-sm">123 Main St</p>
                  <p className="text-sm">New York, NY 10001</p>
                  <p className="text-sm">United States</p>
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                Update Billing Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b bg-slate-50 transition-colors">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Invoice</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b transition-colors hover:bg-slate-50">
                        <td className="p-4 align-middle">INV-001</td>
                        <td className="p-4 align-middle">May 22, 2025</td>
                        <td className="p-4 align-middle">$19.00</td>
                        <td className="p-4 align-middle">
                          <Badge className="bg-green-500">Paid</Badge>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-slate-50">
                        <td className="p-4 align-middle">INV-002</td>
                        <td className="p-4 align-middle">April 22, 2025</td>
                        <td className="p-4 align-middle">$19.00</td>
                        <td className="p-4 align-middle">
                          <Badge className="bg-green-500">Paid</Badge>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b transition-colors hover:bg-slate-50">
                        <td className="p-4 align-middle">INV-003</td>
                        <td className="p-4 align-middle">March 22, 2025</td>
                        <td className="p-4 align-middle">$19.00</td>
                        <td className="p-4 align-middle">
                          <Badge className="bg-green-500">Paid</Badge>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </td>
                      </tr>
                      <tr className="transition-colors hover:bg-slate-50">
                        <td className="p-4 align-middle">INV-004</td>
                        <td className="p-4 align-middle">February 22, 2025</td>
                        <td className="p-4 align-middle">$19.00</td>
                        <td className="p-4 align-middle">
                          <Badge className="bg-green-500">Paid</Badge>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
