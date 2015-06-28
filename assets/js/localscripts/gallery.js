/**
 * Created by cneubauer on 28.06.15.
 */

$('#offerGallery').lightSlider({
  gallery:true,
  item:1,
  loop:true,
  thumbItem:9,
  slideMargin:0,
  enableDrag: false,
  currentPagerPosition:'left',
  onSliderLoad: function(el) {
    el.lightGallery({
      selector: '#imageGallery .lslide'
    });
  }
});
