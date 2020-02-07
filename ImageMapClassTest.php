<?php
require_once __DIR__ . "/../../redcap_connect.php";
require_once __DIR__ . "/../../redcap_v" . $redcap_version . "/Config/init_functions.php";

require_once "ImageMapClass.php";

function assrt($flag)
{
    if (!$flag) {
        echo "FLAG IS FALSE";
    }
}

assrt("imagemapfunctionsChecks.register()" == \uzgent\ImageMapClass\ImageMapClass::buildJSCall("@CUSTOM_IMAGEMAP=imagemapfunctions.register()"));
assrt("imagemapfunctionsChecks.register()" == \uzgent\ImageMapClass\ImageMapClass::buildJSCall("@CUSTOM_IMAGEMAP=register()"));
assrt("imagemapfunctionsChecks.register()" == \uzgent\ImageMapClass\ImageMapClass::buildJSCall("@CUSTOM_IMAGEMAP=imagemapfunctionsChecks.register()"));


