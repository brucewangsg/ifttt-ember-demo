import Component from '@ember/component';
import EmberObject, { computed, observer }  from '@ember/object';

export default Component.extend({
  showDropdown : null,

  // listen to change for showDropdown state
  showThisDropdownDidChange : observer('showDropdown', function() {
    if (this.get('showDropdown') == false) {
      // emit dropdownDidClose action when it changes to false
      this.get("dropdownDidClose")();
    } else if (this.get('showDropdown') == true) {
      // when it changed to close, hook an event to close dropdown when document get clicked
      // hide popup when click happens on document

      var cancelShow = (function (oThis) {
        return function (ev) {
          if ($(ev.target).parents('.dropdown-menu:first')[0]) {
            return;        
          }
          $(document).unbind('mousedown', cancelShow);
          $(document).unbind('touchstart', cancelShow);

          // set flag to false to hide it
          oThis.set('showDropdown', false);
        };
      })(this);

      $(document).bind('mousedown', cancelShow);
      $(document).bind('touchstart', cancelShow);      
    }
  }),

  actions : {

    // when one of the item get chosen, trigger onItemSelected action, and close dropdown
    chooseItem(item) {
      this.get('onItemSelected')(item);
      this.set('showDropdown', false);
    }
  }
});
