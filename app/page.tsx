"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, MapPin, Phone, Check, Trash2 } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  type: "combo" | "drink"
}

interface OrderForm {
  name: string
  deliveryType: "pickup" | "delivery"
  address?: string
}

export default function CombinadoApp() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: "",
    deliveryType: "pickup",
  })

  const combos = [
    {
      id: "combo-8",
      name: "Combo Clásico",
      description: "Ceviche fresco + Papa a la Huancaína + Chanfainita",
      price: 8,
      image: "https://media-cdn.tripadvisor.com/media/photo-s/24/61/58/bb/combinado.jpg",
    },
    {
      id: "combo-10",
      name: "Combo Tradicional",
      description: "Tallarines Rojos + Papa a la Huancaína + Chanfainita",
      price: 10,
      image: "https://media-cdn.tripadvisor.com/media/photo-s/24/61/58/bb/combinado.jpg",
    },
    {
      id: "combo-12",
      name: "Combo Completo",
      description: "Ceviche + Tallarines Rojos + Papa a la Huancaína + Chanfainita",
      price: 12,
      image: "https://media-cdn.tripadvisor.com/media/photo-s/24/61/58/bb/combinado.jpg",
    },
  ]

  const drinks = [
    {
      id: "chicha-1l",
      name: "Chicha Morada 1L",
      description: "Chicha morada tradicional",
      price: 5,
      image: "https://i.pinimg.com/1200x/06/c4/0b/06c40bb5d6d402c6289b4058f0d23ce2.jpg",
    },
    {
      id: "chicha-500ml",
      name: "Chicha Morada 500ml",
      description: "Chicha morada tradicional",
      price: 2,
      image: "https://www.shutterstock.com/image-photo/peruvian-drink-chicha-morada-purple-600nw-1455064757.jpg",
    },
  ]

  const addToCart = (item: any, type: "combo" | "drink") => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1, type }]
    })
  }

  const updateQuantity = (id: string, change: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const setQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const getCartTotal = () => {
    const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryFee = orderForm.deliveryType === "delivery" ? 3 : 0
    return itemsTotal + deliveryFee
  }

  const handleOrder = () => {
    if (cart.length === 0) {
      alert("Agrega productos a tu carrito")
      return
    }

    if (!orderForm.name) {
      alert("Por favor ingresa tu nombre")
      return
    }

    if (orderForm.deliveryType === "delivery" && !orderForm.address) {
      alert("Por favor ingresa tu dirección para el delivery")
      return
    }

    const orderSummary = `
🍽️ *PEDIDO - COMBINADO*

👤 *Cliente:* ${orderForm.name}

📋 *Productos:*
${cart.map((item) => `• ${item.name} x${item.quantity} - S/ ${item.price * item.quantity}`).join("\n")}

🚚 *Entrega:* ${orderForm.deliveryType === "delivery" ? `Delivery (+S/ 3) - ${orderForm.address}` : "Recojo en tienda"}

💰 *Total:* S/ ${getCartTotal()}

📍 *Dirección tienda:* Av. Ejemplo 123, Lima
    `.trim()

    const whatsappUrl = `https://wa.me/51933701280?text=${encodeURIComponent(orderSummary)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Combinado</h1>
          <p className="text-sm opacity-90">Auténtica comida peruana</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-center">Nuestros Combos</h2>        
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {combos.map((combo) => (
              <Card key={combo.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={combo.image || "/placeholder.svg"}
                    alt={combo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{combo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{combo.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-lg font-bold">
                      S/ {combo.price}
                    </Badge>
                  </div>
                  {cart.find((item) => item.id === combo.id) ? (
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(combo.id, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={cart.find((item) => item.id === combo.id)?.quantity || 0}
                        onChange={(e) => setQuantity(combo.id, Number.parseInt(e.target.value) || 1)}
                        className="w-16 text-center mx-2"
                      />
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(combo.id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => addToCart(combo, "combo")} className="w-full bg-primary hover:bg-primary/90">
                      Agregar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-center">Bebidas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {drinks.map((drink) => (
              <Card key={drink.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-24 h-24 relative flex-shrink-0">
                    <img
                      src={drink.image || "/placeholder.svg"}
                      alt={drink.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{drink.name}</h3>
                      <p className="text-sm text-muted-foreground">{drink.description}</p>
                      <Badge variant="secondary" className="font-bold mt-1">
                        S/ {drink.price}
                      </Badge>
                    </div>
                    <div>
                      {cart.find((item) => item.id === drink.id) ? (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(drink.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={cart.find((item) => item.id === drink.id)?.quantity || 0}
                            onChange={(e) => setQuantity(drink.id, Number.parseInt(e.target.value) || 1)}
                            className="w-12 text-center text-sm"
                          />
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(drink.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => addToCart(drink, "drink")}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          Agregar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {cart.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <ShoppingCart className="h-5 w-5" />
                Tu Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">Cantidad:</span>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                        className="w-16 h-6 text-xs text-center"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="font-bold">S/ {item.price * item.quantity}</p>
                </div>
              ))}

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Tu nombre *</Label>
                    <Input
                      id="name"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Ingresa tu nombre"
                    />
                  </div>

                  <div>
                    <Label>Entrega *</Label>
                    <RadioGroup
                      value={orderForm.deliveryType}
                      onValueChange={(value: "pickup" | "delivery") =>
                        setOrderForm((prev) => ({ ...prev, deliveryType: value }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup">Recojo en tienda (Gratis)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery">Delivery (+S/ 3)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {orderForm.deliveryType === "delivery" && (
                    <div>
                      <Label htmlFor="address">Dirección *</Label>
                      <Input
                        id="address"
                        value={orderForm.address || ""}
                        onChange={(e) => setOrderForm((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Tu dirección completa"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>S/ {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
                      </div>
                      {orderForm.deliveryType === "delivery" && (
                        <div className="flex justify-between text-sm">
                          <span>Delivery:</span>
                          <span>S/ 3</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>S/ {getCartTotal()}</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleOrder} className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                    <Check className="h-4 w-4 mr-2" />
                    Hacer Pedido por WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <footer className="text-center space-y-2 py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Calle carbono 270 - Urb Grimaneza</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span className="text-sm">+51 933701280</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
