<?php
// Redirect to the index.json file
header('Content-Type: application/json');
readfile('index.json');
?>