<?php

/**
 * This imagemap is based on the work of 
 */

$term = "@IMAGEMAPCHECKS";
hook_log("Starting $term for project $project_id", "DEBUG");

///////////////////////////////
//	Enable hook_functions and hook_fields for this plugin (if not already done)
if (!isset($hook_functions)) {
	$file = HOOK_PATH_FRAMEWORK . 'resources/init_hook_functions.php';
	if (file_exists($file)) {
		include_once $file;
		
		// Verify it has been loaded
		if (!isset($hook_functions)) { hook_log("ERROR: Unable to load required init_hook_functions."); return; }
	} else {
		hook_log ("ERROR: In Hooks - unable to include required file $file while in " . __FILE__);
	}
}

// See if the term defined in this hook is used on this page
if (!isset($hook_functions[$term])) {
	hook_log ("Skipping $term on $instrument of $project_id - not used.", "DEBUG");
	return;
}

//Create a map for each image with key => label & initscript.
$keyLabelCodeMap = [];
foreach(array_keys($hook_functions[$term]) as $key) 
{
    //get field label. 
    foreach ($elements as $curarr)
    {
        if ($curarr['name'] == $key)
        {
            $keyLabelCodeMap[$key]['label'] = html_entity_decode($curarr['label']);
            $keyLabelCodeMap[$key]['script'] = str_replace("$term=","", $hook_functions[$term][$key]['note']);
        }
    }
}
?>

<script>
    //Replace the label by the correct HTML label from the element. 
<?php 
foreach ($keyLabelCodeMap as $key => $map)
{
    $code = $map["label"];
    $code = str_replace("\r", "", str_replace("\n", "", $code));
    echo '$( "tr[sq_id=\'' . $key . '\']" ).html(\''.$code .'\');'."\n";    
}
?>




function updateFunctionForCheckbox(dictionary, checkboxesName)
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

function getCheckedElements(checkboxesName) {
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

function registerImageMap(imageId, mapId, originalCheckboxesName, color, codeAttribute)
{
    var checkboxesName = originalCheckboxesName;
    var fun = function updateFunction(dictionary)
    {
        return updateFunctionForCheckbox(dictionary, checkboxesName);
    }

    var aug = ImageMapAug(imageId, mapId, fun, color);
    aug.codeAttribute = codeAttribute;
    aug.populateAreas(getCheckedElements(checkboxesName));
    aug.renderMap();
}


</script>

<script src="../../hooks/framework/resources/imagemapcheckboxes/imagemap.js"></script>

<script>
    <?php
    
    foreach ($keyLabelCodeMap as $key => $map)
    {
        echo $map["script"]."\n";    
    }    
?>

</script>

