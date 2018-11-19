$(document).ready(function(){
    var ias = JQuery.ias({
      container: '.box-users',
      item: '.user-item',
      pagination: '.pagination',
      next: '.pagination .next-link',
      triggerPageThreshold: 5
    });

    ias.extension(new IASTriggerExtension({
      text: 'See more..',
      offset: 3
    }));

    ias.extension(IASSpinnerExtension({
      src: '../assets/ajax-loader.gif'
    }));

    ias.extension(IASNoneLeftExtension({
      text: 'There are no more people'
    }));
});
