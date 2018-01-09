import Component from '@ember/component';
import { computed, observer }  from '@ember/object';

/*
    Usage
    {{service-dropdown 
      items=passYourItems 
      showDropdown=flagToToggleDropdown 
      noSelectionText="No Item Available ..." 
      onItemSelected=(action "chooseTriggerService") 
      dropdownDidClose=(action "callbackForDropdownDidClose")
      dropdownDidClose=(action "callbackForDropdownDidClose") 
    }}


*/

export default Component.extend({
  showDropdown : null,
  _cancelDropdownFunc : null,
  keyword : null,
  filteredItems : computed('keyword', 'items.[]', function () {
    var items = this.get('items');
    var keyword = this.get('keyword');
    var filterFunc = function (item) {
      if (keyword && keyword.length > 0) {
        return (item.title+'').toLowerCase().match(keyword);
      }
      return true;
    };
    if (this.get("filter")) {
      filterFunc = this.get("filter");
    }
    return items.filter(filterFunc);
  }),

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

      var dropdownMenu = this.$(this.get('element'));
      var originalParent = dropdownMenu.parent();
      if (this.$(window).width() <= 480) { // on mobile
        dropdownMenu.appendTo(document.body);
      } 

      // assigning cancel dropdown func
      this._cancelDropdownFunc = (function (oThis) {
        return function (ev) {
          if (ev) {
            if (oThis.$(ev.target).parents('.dropdown-menu:first')[0]) {
              return;        
            }
          }

          oThis.$(document).unbind('mousedown', oThis._cancelDropdownFunc);
          oThis.$(document).unbind('touchstart', oThis._cancelDropdownFunc);

          // set flag to false to hide it
          oThis.set('showDropdown', false);
          dropdownMenu.appendTo(originalParent);
        };
      })(this);

      this.$(document).bind('mousedown', this._cancelDropdownFunc);
      this.$(document).bind('touchstart', this._cancelDropdownFunc);      
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
