<?php

$data = array(
	'title' => 'just title',
	'status' => true
);

// type of json
//echo json_encode($data);

// type of jsonp
echo $_GET['callback'].'('.json_encode($data).')';