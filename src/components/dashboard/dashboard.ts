import Vue from 'vue';
import { namespace } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import firebaseConfig from '@/services/firebase-config';
import { CommonMutations } from '../../typings/common';

const commonModule = namespace('commonModule');

@Component({
  template: './dashboard.html',
  components: {},
})
export default class Dashboard extends Vue {
  // Data property
  public myDataProperty?: string;

  @commonModule.Mutation(CommonMutations.CurrentUser)
  public setCurrentUser!: (payload: string) => void;

  // Lifecycle hook
  mounted() {
    console.log('The About component was mounted');
    this.setCurrentUser('RandomIDForThisUser');
  }

  logout() {
    firebaseConfig.auth.signOut().then(() => {
      this.$router.replace('login');
    });
  }
}
