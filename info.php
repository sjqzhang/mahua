<?php



require_once('php/doc2md.php');


$h2md=new Html2md();

$html=$h2md->url_get($_POST['url']);
$selector=$_POST['selector'];
$istable=$_POST['istable'];


phpQuery::newDocument($html);
$content= pq($selector)->htmlOuter();


$md= $h2md->parse($content,$istable);
$options= $h2md->get_container($html);

//print_r($selector);

echo json_encode(array('md'=>$md,'selector'=>$options));


?>