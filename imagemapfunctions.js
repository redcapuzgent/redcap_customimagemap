var imagemapfunctions = {};

imagemapfunctions.updateFunctionForCheckbox = function(dictionary, checkboxesName)
{
    for (var code in dictionary) {
        for (var i = 0; i < document.getElementsByTagName('input').length; i++) {
            var el = document.getElementsByTagName('input').item(i);
            if (el.hasAttribute("code") && el.getAttribute("code") === code && el.getAttribute("name").endsWith(checkboxesName)) {
                if (el.checked !== (dictionary[code] === 1))
                {
                    el.click();
                }
            }
        }
    }

}

imagemapfunctions.getCheckedElements = function (checkboxesName) {
    var checkedElements = [];
    for (var i = 0; i < document.getElementsByTagName('input').length; i++) {
        var el = document.getElementsByTagName('input').item(i);
        if (el.hasAttribute("code") && el.getAttribute("name").endsWith(checkboxesName)) {
            if (el.checked) {
                var code = el.getAttribute("code");
                checkedElements.push(code);
            }
        }
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

