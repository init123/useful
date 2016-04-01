<?php

// 判断Angular传递的是Json格式数据 转为php识别的form方式
if(strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== -1) $_POST = json_decode(file_get_contents('php://input'), true);

echo json_encode(array('status' => true, 'data' => $_POST['msg']));