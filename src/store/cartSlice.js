import { createSlice } from '@reduxjs/toolkit'

const initialCartState = {
    items: [],
    totalAmount: 0,
    showCart: false
}
const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        addItem (state, action) {
            state.totalAmount += action.payload.price * action.payload.amount
            const existingCartItem = state.items.find(item => item.id === action.payload.id)
            if (existingCartItem) {
                existingCartItem.amount += action.payload.amount
            } else {
                state.items.push({
                    id: action.payload.id,
                    name: action.payload.name,
                    price: action.payload.price,
                    amount: action.payload.amount
                })
            }
        },
        removeItem (state, action) {
            const existingCartItemIndex = state.items.findIndex(item => item.id === action.payload)

            const existingCartItem = state.items[existingCartItemIndex]

            if (existingCartItem.amount === 1) {
                state.items = state.items.filter(item => item.id !== action.payload)
            } else {
                state.items[existingCartItemIndex].amount--
            }
            state.totalAmount -= existingCartItem.price
        },
        Clear (state) {
            state.items = []
            state.totalAmount = 0
            state.showCart = false
        }
    }
})
export const cartAction = cartSlice.actions
export default cartSlice.reducer