"use client"

export const dynamic = "force-dynamic"

import type React from "react"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/lib/intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { t, locale } = useLanguage()
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const shipping = 9.99
  const tax = totalPrice * 0.1
  const orderTotal = totalPrice + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const order = {
      id: `ORDER-${Date.now()}`,
      items: items,
      subtotal: totalPrice,
      shipping: shipping,
      tax: tax,
      total: orderTotal,
      date: new Date().toISOString(),
      status: "Paid",
    }

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    localStorage.setItem("orders", JSON.stringify([order, ...existingOrders]))

    clearCart()

    toast({
      title: t.checkout.success || "Order placed successfully!",
      description: t.checkout.successMessage || "Your order has been confirmed.",
    })

    router.push("/orders")
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    if (items.length === 0) {
      router.replace("/cart")
    }
  }, [items, router])

  if (items.length === 0) {
    return null
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">{t.checkout.title}</h1>

          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-center">
              <strong>{t.demo.mode}:</strong> {t.demo.checkoutMessage}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.checkout.shippingInfo}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t.checkout.firstName}</Label>
                        <Input id="firstName" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t.checkout.lastName}</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">{t.checkout.email}</Label>
                      <Input id="email" type="email" placeholder={t.placeholders.email} required />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t.checkout.phone}</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                    <div>
                      <Label htmlFor="address">{t.checkout.address}</Label>
                      <Input id="address" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">{t.checkout.city}</Label>
                        <Input id="city" required />
                      </div>
                      <div>
                        <Label htmlFor="state">{t.checkout.state}</Label>
                        <Input id="state" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">{t.checkout.zipCode}</Label>
                        <Input id="zipCode" required />
                      </div>
                      <div>
                        <Label htmlFor="country">{t.checkout.country}</Label>
                        <Input id="country" required />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t.checkout.paymentInfo}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">{t.checkout.cardNumber}</Label>
                      <Input id="cardNumber" placeholder={t.placeholders.cardNumber} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">{t.checkout.expiryDate}</Label>
                        <Input id="expiryDate" placeholder={t.placeholders.expiryDate} required />
                      </div>
                      <div>
                        <Label htmlFor="cvv">{t.checkout.cvv}</Label>
                        <Input id="cvv" placeholder={t.placeholders.cvv} required />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>{t.checkout.orderSummary}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {items.map((item) => (
                        <div
                          key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                          className="flex items-center gap-3 pb-3 border-b border-border last:border-0"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name[locale]}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.product.name[locale]}</p>
                            <p className="text-xs text-muted-foreground">
                              {t.cart.qtyLabel}: {item.quantity} × {formatCurrency(item.price, locale)}
                            </p>
                          </div>
                          <p className="font-bold text-sm">{formatCurrency(item.price * item.quantity, locale)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.cart.subtotal}</span>
                        <span className="font-medium">{formatCurrency(totalPrice, locale)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.cart.shipping}</span>
                        <span className="font-medium">{formatCurrency(shipping, locale)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t.cart.tax}</span>
                        <span className="font-medium">{formatCurrency(tax, locale)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-lg font-bold">{t.cart.total}</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(orderTotal, locale)}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full group relative overflow-hidden"
                      disabled={isProcessing}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t.checkout.processing}
                          </>
                        ) : (
                          t.checkout.placeOrder
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  )
}
