
module.exports = {

  renderView: function(view, parameters, callback) {
    // disable layout before rendering
    parameters['layout'] = null;

    sails.hooks.views.render(view, parameters, function (err, html) {
        if (err) {
          console.log(err);
          callback("");
        } else {
          callback(html);
        }
      })
  },

  /**
   * Extend options1 by those of options2. Be aware that options2 will overwrite concurring options of options1.
   * @param options1
   * @param options2
   * @returns {*}
   */
  mergeViewOptions: function(options1, options2) {
    for (var viewOption2Key in options2) {
      options1[viewOption2Key] = options2[viewOption2Key];
    }

    return options1;
  }

};
