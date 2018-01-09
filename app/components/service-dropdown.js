import Component from '@ember/component';
import EmberObject, { computed, observer }  from '@ember/object';

export default Component.extend({
  showDropdown : null,
  _cancelDropdownFunc : null,

  // listen to change for showDropdown state
  showThisDropdownDidChange : observer('showDropdown', function() {
    if (this.get('showDropdown') == false) {
      // emit dropdownDidClose action when it changes to false
      this.get("dropdownDidClose")();

      if (this._cancelDropdownFunc) {
        this._cancelDropdownFunc();
        this._cancelDropdownFunc = null;
      }
    } else if (this.get('showDropdown') == true) {
      // when it changed to close, hook an event to close dropdown when document get clicked
      // hide popup when click happens on document

      var dropdownMenu = $(this.get('element'));
      var originalParent = dropdownMenu.parent();
      if ($(window).width() <= 480) { // on mobile
        dropdownMenu.appendTo(document.body);
      } 

      // assigning cancel dropdown func
      this._cancelDropdownFunc = (function (oThis) {
        return function (ev) {
          if (ev) {
            if ($(ev.target).parents('.dropdown-menu:first')[0]) {
              return;        
            }
          }

          $(document).unbind('mousedown', oThis._cancelDropdownFunc);
          $(document).unbind('touchstart', oThis._cancelDropdownFunc);

          // set flag to false to hide it
          oThis.set('showDropdown', false);
          dropdownMenu.appendTo(originalParent);
        };
      })(this);

      $(document).bind('mousedown', this._cancelDropdownFunc);
      $(document).bind('touchstart', this._cancelDropdownFunc);      
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
