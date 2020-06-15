import { ActionTree, ActionContext } from 'vuex';
import { MainState } from '@/typings/store';
import firebaseConfig from '@/config/firebase-config';

export class State {}

const actions: ActionTree<State, MainState> = {
  // Updates user profile detils
  updateBulkUserCategories: (
    { commit }: ActionContext<State, MainState>,
    userDetails,
  ) => {
    const updateObject: any = {};
    Object.keys(userDetails.userCategories).forEach((key: string) => {
      const categoryId = userDetails.userCategories[key];
      // Updates user details in Categories table for each user category
      updateObject[`categories/${categoryId}/users/${userDetails.userUid}`] =
        userDetails.categoryUserOptions;
    });

    // Updates Users table - user details
    updateObject[`users/${userDetails.userUid}`] = userDetails.userOptions;

    let imageUrl = '';
    let key;
    firebaseConfig.databaseRef
      .update(updateObject)
      .then(() => {
        const filename = userDetails.image.name;
        const ext = filename.slice(filename.lastIndexOf('.'));
        // Store the image in firebase storage
        return firebaseConfig.storage
          .ref('profilePictures/' + userDetails.userUid + ext)
          .put(userDetails.image);
      })
      .then((fileData) => {
        const fullPath = fileData.metadata.fullPath;
        return firebaseConfig.storage.ref(fullPath).getDownloadURL();
      })
      .then((url) => {
        imageUrl = url;
        return firebaseConfig.usersRef
          .child(userDetails.userUid)
          .update({ imageUrl: url });
      })
      .then(() => {
        userDetails.userOptions.imageUrl = imageUrl;
        commit('userModule/setUser', userDetails.userOptions, { root: true });
        commit('categoriesModule/setCategoryUser', userDetails, { root: true });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

export const commonModule = {
  namespaced: true,
  state: (): State => new State(),
  actions,
};
