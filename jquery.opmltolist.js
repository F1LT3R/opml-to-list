/**
 * jQuery OPMLtoList - Converts OPML Documents to Ordered/Unordered Lists
 * © 2012 Alistair MacDonald (@HTML5JS), SignedOn, Inc. (@SignedOnInc)
 *
 */

jQuery.fn.opmltolist = function (data, callback) {
  $.opmltolist(this, data, callback);
  return this;
};

jQuery.opmltolist = function (container, data, callback) {
  var container = $(container).get(0);
  return container.opmltolist || (container.opmltolist = new jQuery._opmltolist(container, data, callback));
}

jQuery._opmltolist = function (container, data, callback) {

  // Cache the kind of List Type that is being being generated
  var listType = $(container).is('ul') ? '<ul/>' : '<ol/>' ;

  // Parse the OPML tree AJAX Object
  function parse(item, parent, root){

    // GENERATE: a List Item DOM Object
    var li = $('<li/>')

      // CACHE: the text for the current Item
      , itemsText = $(item).attr('text')

      // DECLARE: variables for use in this function
      , itemsChildren
      , newItem
      , ul
      ;

    // If the Item is a Link...
    if( $(item).attr('type') === 'link' ){

      // Generate an Anchor Link with attributes and append it to the List Item,
      li.append( $('<a/>', { href: $(item).attr('url'), text: itemsText }) );
    }else{

      // ... otherwise: insert the plain text into the List Item.
      li.append( itemsText );
    }

    // Loop through the OPML Outline Attributes
    $(item.attributes).each(function(i, attr){

      // Exclude 'text' and 'url' so-as not to duplicate information
      if( attr.name !== 'text' && attr.name !== 'url' ){

        // Add the Attributes from the OPML Item to the new List Item
        li.attr(attr.name, attr.value);
      }
    });

    // Cache the Children of the current Item
    itemsChildren = $(item).children();

    // If the Item has Children...
    if( itemsChildren.length ){

      // ... and the Item is not the first in the OPML tree...
      if( !root ){

        // ... create a sub-list UL or OL
        ul = $( listType );

        // Add the item to the new UL or OL DOM Object
        li.append( ul );

        // Recursive call to the parse() function, where the new UL becomes
        // the conatiner DOM Object.
        itemsChildren.each(function(){ parse(this, ul); });

      // If the Item does not have children...
      }else{

        // Recursive call the parse() function with the last UL/OL container
        itemsChildren.each(function(){ parse(this, container); });

      }
    }

    // If the item has no text, we do not want to see them.
    if( itemsText ){
      $(parent).append( li );
    }
  }

  // Begin parsing the OPML Document tree
  parse( $(data).find('body'), container, true );

  // Execute the callback if one was pased
  if( callback ){
    callback();
  }
}
