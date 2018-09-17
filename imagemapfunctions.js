var imagemapfunctions = {};

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

