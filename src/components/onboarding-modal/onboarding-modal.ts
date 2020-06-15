import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { CategoriesGetters, CategoriesActions } from '../../typings/categories';
import { userGetters, userActions } from '../../typings/user';
import { CommonActions } from '../../typings/common';
import _ from 'lodash';

const categoriesModule = namespace('categoriesModule');
const userModule = namespace('userModule');
const commonModule = namespace('commonModule');

@Component({
  template: './onboarding-modal.html',
  components: {},
})
export default class OnboardingModal extends Vue {
  public categories: CategoryObject[] = [];
  public isCardModalActive = false;
  public canCancel = false;
  public location = '';
  // Needs to be Array to be able to push into from dom
  public selectedCategories: number[] = [];
  public onboardingData = {
    text: 'Welcome',
    subtext: 'Next you will create your profile',
    step: 0,
  };

  @categoriesModule.Getter(CategoriesGetters.GetCategories)
  public getCategories!: CategoryObject[];

  @categoriesModule.Action(CategoriesActions.AddUserToCategory)
  public addUserToCategory!: (payload: object) => Promise<CategoryObject[]>;

  @userModule.Action(userActions.AddCategoryToUser)
  public addCategoryToUser!: (payload: object) => Promise<UserObject>;

  @userModule.Getter(userGetters.GetUserId)
  public getUserId!: string;

  @userModule.Getter(userGetters.GetUser)
  public getUser!: UserObject;

  // Common store
  @commonModule.Action(CommonActions.UpdateBulkUserCategories)
  public updateBulkUserCategories!: (payload: object) => Promise<UserObject>;

  public get getCategoriesUser(): boolean | void {
    if (_.isEmpty(this.getUser.name)) return;
    this.isCardModalActive = _.isEmpty(this.getUser.categories) ? true : false;
    this.categories = this.getCategories;
    return this.isCardModalActive;
  }

  next(): void {
    this.onboardingData.step++;
    switch (this.onboardingData.step) {
      case 1:
        this.onboardingData.text = 'Choose categories';
        this.onboardingData.subtext = '';
        break;
      case 2:
        this.onboardingData.text = 'Location';
        this.onboardingData.subtext = '+ radius';
        break;
      case 3:
        this.updateUserLocation();
        this.onboardingData.text = 'Done';
        this.onboardingData.subtext = 'Your profile is created';
        break;
      case 4:
        this.isCardModalActive = false;
        break;
      default:
    }
  }

  addCategories(): void {
    const userId = this.getUserId;
    Object.keys(this.selectedCategories).forEach((selected: any) => {
      this.addUserCategory(this.selectedCategories[selected], userId);
    });
  }

  /**
   * Add selected category to user
   * Add user to category
   * @param categoryId
   */
  addUserCategory(categoryId: number, userId: string): void {
    this.addCategoryToUser({ userUid: userId, categoryId: categoryId });

    const categoryUserOptions = {
      name: this.getUser.name,
      username: this.getUser.username,
      gender: this.getUser.gender,
    };
    this.addUserToCategory({
      categoryId: categoryId,
      userUid: userId,
      categoryUserOptions: categoryUserOptions,
    });

    if (categoryId != null) {
      this.$buefy.toast.open({
        message: 'Category updated',
        position: 'is-top-right',
        type: 'is-success',
      });
    }
  }

  updateUserLocation(): void {
    const user = this.getUser;
    Object.assign(user.categories, this.selectedCategories);
    user.location = this.location;

    const categoryUserOptions = {
      name: user.name,
      username: user.username,
      gender: user.gender,
      location: user.location,
    };
    const options = {
      userCategories: user.categories,
      categoryUserOptions: categoryUserOptions,
      userOptions: user,
      userUid: this.getUserId,
    };
    this.updateBulkUserCategories(options);
  }
}
