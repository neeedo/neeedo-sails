/**
 * Neeedo WebApp Configuration
 * (sails.config.webapp)
 */

module.exports.webapp = {

  /***************************************************************************
  *                                                                          *
  * Pagination                                                                 *
  *                                                                          *
  ***************************************************************************/
  pagination: {
    // default limit if none is given via limit request parameter
    defaultLimit: 10,
    firstPageNumber: 1
  },
  cookie: {
    // cookies maxAge in milliseconds
    maxAge: 31536000000,
    httpOnly: false
  },
  images: {
    // use HTTPS on images GET?
    useHttps: false,
    maxSizeInBytes: 5000000 , // = 5 MB
    maxCountPerObject: 5, // e.g. max. number of images per offer
    resolution: { // max resolution in pixel - uploaded images will be resized to fit the max resolution before pushing to API
      maxHeight : 500,
      maxWidth : 500
    },
    /**
     * The processes should only be disabled for testing purpose or on critical errors - this is not recommended on LIVE!
     */
    processing: {
      validators : true, // activate image validation?
      filters : true // activate image processing / filter, like rescaling?
    },
    /**
     * Allowed image types:
     *
     * each entry should define a fileType that is checked on upload by the validator class and a description which will be shown to the user
     */
    allowedTypes: [
      {
        fileType: 'image/jpeg',
        description: 'JPEG'
      },
      {
        fileType: 'image/png',
        description: 'PNG'
      },
      {
        fileType: 'image/bmp',
        description: 'BMP'
      }
    ]
  },
  geolocation: {
    /*
     * fallback values if the browser didn't sent correct geolocation values
     *
     * The default lat lng values are mapped to the current user's configured locale (see LocaleService).
     */
    defaults: {
      de: {
        // Berlin, Germany
        latitude: 52.518611111111,
        longitude: 13.40833333333334
      },
      en: {
        // London, GB
        latitude: 51.50939,
        longitude: -0.11832
      }
    }
  },
  tags: {
    suggestions: {
      limit: 6 // limit of displayed suggested tags
    }
  },
  map: {
    // initial zoom step that will be set on open layers view
    defaultZoomStep: 12,
    // max number of items (demands or offers) that will be loaded in the map
    itemLimit: 50
  },
  mailbox: {
    // max number of characters shown in the mailbox action message prewiew
    previewMaxCharacters: 60
  },
  validations: {
    user: {
      username: {
        minCount: 3,
        maxCount: 24
      },
      password: {
        minCount: 8,
        maxCount: 64
      }
    },
    offer: {
      tags: {
        minCount: 1,
        maxCount: 20
      },
      // prices in €
      price: {
        minimum: 0,
        maximum: 99999999
      },
      images: {
        minCount: 0,
        maxCount: 5
      }
    },
    demand: {
      mustTags: {
        minCount: 1,
        maxCount: 20
      },
      shouldTags: {
        minCount: 0,
        maxCount: 20
      },
      // prices in €
      price: {
        // mininum and maximum price for minimum demand price
        min: {
          minimum: 0,
          maximum: 99999999
        },
        // minimum and maximum price for maximum demand price
        max: {
          minimum: 0,
          maximum: 99999999
        }
      },
      distance: {
        // maximum distance in KM
        maximum: 50000
      }
    },
    message: {
      messageBody: {
        // max length in characters
        maxLength: 1000
      }
    }
  },
  android: {
    playStore: "https://play.google.com/store/apps/details?id=neeedo.imimaprx.htw.de.neeedo"
  },
  notifications: {
    // user who sends notifications on new offers
    user: {
      name: "Neeedo",
      id: "Neeedo"
    }
  }
};
