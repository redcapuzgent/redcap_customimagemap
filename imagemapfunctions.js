var imagemapfunctions = {};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method 
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}


imagemapfunctions.updateFunctionForCheckbox = function(dictionary, checkboxesName)
{
    var updatedElement = false;
    for (var code in dictionary) {
        for (var i = 0; i < document.getElementsByTagName('input').length; i++) {
            var el = document.getElementsByTagName('input').item(i);
            if (el.hasAttribute("code") && el.getAttribute("code") === code && el.getAttribute("name").endsWith(checkboxesName)) {
                if (el.checked !== (dictionary[code] === 1))
                {
                    updatedElement = true;
                    el.click();
                }
            }
        }
    }
    if (!updatedElement){
        console.log("Didn't find any checkboxes that match the updates. Did you add checkboxes with name " + checkboxesName + " and do the checkbox codes <code, checkbox label1> match your imagemap areas?");
    }

}

imagemapfunctions.getCheckedElements = function (checkboxesName) {
    var updatedElement = false;
    var checkedElements = [];
    for (var i = 0; i < document.getElementsByTagName('input').length; i++) {
        var el = document.getElementsByTagName('input').item(i);
        if (el.hasAttribute("code") && el.getAttribute("name").endsWith(checkboxesName)) {
            if (el.checked) {
                var code = el.getAttribute("code");
                checkedElements.push(code);
            }
            updatedElement = true;
        }
    }
    if (!updatedElement){
        console.log("No imagemap segments could be loaded from the specified checkboxes " + checkboxesName);
    }
    return checkedElements;
}

imagemapfunctions.registerImageMap = function(imageId, mapId, originalCheckboxesName, color, codeAttribute)
{
    var checkboxesName = originalCheckboxesName;
    var fun = function updateFunction(dictionary)
    {
        return imagemapfunctions.updateFunctionForCheckbox(dictionary, checkboxesName);
    }

    var aug = ImageMapAug(imageId, mapId, fun, color);
    aug.codeAttribute = codeAttribute;
    aug.populateAreas(imagemapfunctions.getCheckedElements(checkboxesName));
    aug.renderMap();
}

