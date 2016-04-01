<?php

$arr = array(
	array('Name' => 'Alfreds Futterkiste', 'Country' => 'Germany'),
	array('Name' => 'Ernst Handel', 'Country' => 'Austria'),
	array('Name' => 'Centro comercial Moctezuma', 'Country' => 'Mexico'),
	array('Name' => 'Berglunds snabbköp', 'Country' => 'Sweden')
);

echo json_encode($arr);