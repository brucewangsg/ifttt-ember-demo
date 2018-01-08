import Controller from '@ember/controller';

export default Controller.extend({
  actions : {
    toggleDropdown(key) {
      var model = this.get('model'); 
      model.set(key, true);
    },
    toggleDropdownDidClose : function (key) {
      var model = this.get('model');
      model.set(key, false);
    },
    chooseTriggerService : function (item) {
      var model = this.get('model');
      model.set('selectedTriggerService', item);
      model.set('showThisDropdown', false);
    },
    chooseActionService : function (item) {
      var model = this.get('model');
      model.set('selectedActionService', item);
      model.set('showThatDropdown', false);
    },
    chooseTrigger : function (item) {
      var model = this.get('model');
      model.set('selectedTrigger', item);
      model.set('showTriggerDropdown', false);
    }
  }
});
