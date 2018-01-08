import Controller from '@ember/controller';
import mockAPI from '../models/mockapi';

export default Controller.extend({
  actions : {
    toggleThisDropdown() {
      var model = this.get('model'); 
      model.set('showThisDropdown', true);
    },
    triggerServiceDropdownDidClose : function () {
      var model = this.get('model');
      model.set('showThisDropdown', false);
    },
    chooseTriggerService : function (item) {
      var model = this.get('model');
      model.set('selectedTriggerService', item);
      model.set('showThisDropdown', false);
    }
  }
});
