
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
  }

};
