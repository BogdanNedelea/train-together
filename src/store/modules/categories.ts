import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebase from '@/config/firebase-config';
export class State {
  public categories: CategoryObject = {} as CategoryObject;
}

//eslint-disable-next-line
const getters: GetterTree<State, any> = {
  getCategories(state: State) {
    return state.categories;
  },
};

const mutations: MutationTree<State> = {
  setCategories: (state: State, payload: CategoryObject) =>
    (state.categories = payload),
};

const actions: ActionTree<State, MainState> = {
  retriveCategories({ state, commit }: ActionContext<State, MainState>) {
    try {
      firebase.categoriesRef.once('value', (snapshot: any) => {
        if (snapshot) {
          commit('setCategories', snapshot.val());
        }
      });
    } catch {
      throw Error('Could not fetch data');
    }
  },
};

export const categoriesModule = {
  namespaced: true,
  state: (): State => new State(),
  getters,
  mutations,
  actions,
};