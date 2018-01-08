import Controller from '@ember/controller';

export default Controller.extend({
  actions : {
    toggleThisDropdown() {
      var model = this.get('model'); 
      model.set('showThisDropdown', true);

      // hide popup when click happens on document
      var cancelShow = (function (model) {
        return function (ev) {
          if ($(ev.target).parents('.dropdown-menu:first')[0]) {
            return;        
          }
          $(document).unbind('mousedown', cancelShow);
          $(document).unbind('touchstart', cancelShow);

          // set flag to false to hide it
          model.set('showThisDropdown', false);
        };
      })(model);

      $(document).bind('mousedown', cancelShow);
      $(document).bind('touchstart', cancelShow);

    }
  }
});
