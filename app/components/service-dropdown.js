import Component from '@ember/component';
import EmberObject, { computed, observer }  from '@ember/object';

export default Component.extend({
  showDropdown : null,

  showThisDropdownDidChange : observer('showDropdown', function() {
    if (this.get('showDropdown') == false) {
      this.get("dropdownDidClose")();
    } else if (this.get('showDropdown') == true) {
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
    chooseItem(item) {
      this.get('onItemSelected')(item);
      this.set('showDropdown', false);
    }
  }
});
