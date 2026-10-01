import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [
      {
        id: 1,
        name: 'Womens Away Jersey 25/26 Navy',
        price: 160.00,
        quantity: 1,
        size: '2XS',
        playerName: 'Dabritz',
        playerNumber: 8,
        image: '/Clans/Heroes/Archer-Queen.png'
      },
      {
        id: 2,
        name: 'Barbarian King Statue - Limited Edition',
        price: 85.50,
        quantity: 1,
        image: '/Clans/Heroes/Barbarian-King.png'
      }
    ],
    shipping: 0,
    taxes: 0,
  }),
  getters: {
    subtotal: (state) => state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    total: (state) => state.subtotal + state.shipping + state.taxes,
    itemCount: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0)
  },
  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId)
    },
    clearCart() {
      this.items = []
    }
  }
})
