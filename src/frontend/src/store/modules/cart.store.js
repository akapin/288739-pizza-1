import {
  ADD_PIZZA_TO_CART,
  REMOVE_PIZZA_FROM_CART,
  INCREMENT_PIZZA_QUANTITY,
  DECREMENT_PIZZA_QUANTITY,
  INCREMENT_ADDITIONAL_QUANTITY,
  DECREMENT_ADDITIONAL_QUANTITY,
  RESET_CART_STATE,
} from "@/store/mutations-types";

import misc from "@/static/misc.json";
import { normalizeMisc } from "@/common/helpers";

const getDefaultState = () => ({
  cartPizzaList: [],
  cartAdditionalList: misc.map(normalizeMisc),
});

export default {
  namespaced: true,

  state: getDefaultState(),

  mutations: {
    [ADD_PIZZA_TO_CART](state, pizza) {
      state.cartPizzaList.push(pizza);
    },

    [REMOVE_PIZZA_FROM_CART](state, pizza) {
      state.cartPizzaList = state.cartPizzaList.filter(
        (it) => it.id !== pizza.id
      );
    },

    [INCREMENT_PIZZA_QUANTITY](state, pizza) {
      const pizzaListItem = state.cartPizzaList.find(
        (it) => it.id === pizza.id
      );
      pizzaListItem.quantity += 1;
    },

    [DECREMENT_PIZZA_QUANTITY](state, pizza) {
      const pizzaListItem = state.cartPizzaList.find(
        (it) => it.id === pizza.id
      );
      pizzaListItem.quantity -= 1;
    },

    [INCREMENT_ADDITIONAL_QUANTITY](state, additional) {
      const additionalListItem = state.cartAdditionalList.find(
        (it) => it.id === additional.id
      );
      additionalListItem.quantity += 1;
    },

    [DECREMENT_ADDITIONAL_QUANTITY](state, additional) {
      const additionalListItem = state.cartAdditionalList.find(
        (it) => it.id === additional.id
      );
      if (additionalListItem.quantity !== 0) {
        additionalListItem.quantity -= 1;
      }
    },

    [RESET_CART_STATE](state) {
      Object.assign(state, getDefaultState());
    },
  },

  getters: {
    orderPrice(state) {
      const pizzaListPrice = state.cartPizzaList.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const cartAdditionalListPrice = state.cartAdditionalList.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      return pizzaListPrice + cartAdditionalListPrice;
    },
  },

  actions: {
    [ADD_PIZZA_TO_CART]({ rootState, rootGetters, commit }) {
      commit(ADD_PIZZA_TO_CART, {
        id: Date.now(),
        name: rootState.Builder.pizzaName,
        dough: rootState.Builder.pizzaDough,
        size: rootState.Builder.pizzaSize,
        sauce: rootState.Builder.pizzaSauce,
        ingredients: rootGetters["Builder/selectedPizzaIngredients"],
        price: rootGetters["Builder/pizzaPrice"],
        quantity: 1,
      });

      commit("Builder/RESET_BUILDER_STATE", null, { root: true });
    },

    [DECREMENT_PIZZA_QUANTITY]({ commit }, pizza) {
      if (pizza.quantity === 1) {
        commit(REMOVE_PIZZA_FROM_CART, pizza);
      } else {
        commit(DECREMENT_PIZZA_QUANTITY, pizza);
      }
    },
  },
};
