(function(win) {
  win.gb = win.gb || {};

  gb.util = {

    /**
     * Be `arr` the result of jQuery#serializeArray(), returns an obj
     * whose keys are the names of the form inputs
     *
     * @param arr
     * @returns Object
     */
    serializeObject: function serializeObject(arr) {
      var obj = {};

      arr.forEach(function(item) {
        obj[item.name] = item.value;
      });

      return obj;
    },

    postJSON: function postJSON(url, data) {
      return $.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        contentType : 'application/json'
      });
    }

  };
}(window));