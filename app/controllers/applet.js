import Controller from '@ember/controller';

export default Controller.extend({
  actions : {
    toggleThisDropdown() {
      var model = this.get('model'); 
      model.set('showThisDropdown', true);
    }
  }
});
