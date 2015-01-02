<?php



require_once('php/doc2md.php');


function mkdirs($dir){ 
	return is_dir($dir) or (mkdirs(dirname($dir)) and mkdir($dir,0777)); 
}


$h2md=new Html2md();


$action= $_POST['action'];

$filepath='/var/www/';

if($action=='load'){

	$html=$h2md->url_get($_POST['url']);
	$selector=$_POST['selector'];
	$istable=$_POST['istable'];

	$title=$h2md->get_title($html);


	phpQuery::newDocument($html);
	$content= pq($selector)->htmlOuter();


	$md= $h2md->parse($content,$istable);
	$options= $h2md->get_container($html);

	//print_r($selector);

	

	echo json_encode(array('md'=>$md,'selector'=>$options,'title'=>$filepath.$title));

} else {

	if(!is_dir(dirname($filename))){
		mkdirs(dirname($filename));
	}

	$filename=$_POST['filename'];
	$md=$_POST['md'];

	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		$filename=iconv('utf-8//IGNORE','gbk//IGNORE',$filename);
	} 

	if(!file_exists($filename)){
		$fp=fopen($filename,'w');
		fwrite($fp,$md);
		fclose($fp);
		echo 1;
	} else {
		echo 0;
	}
	

}



?>