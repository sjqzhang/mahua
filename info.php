<?php


function html2md($markup){

	if(preg_match('/<body[^>]*?>[\s\S]+?<\/body>/i',$markup,$html)){
		$markup=$html[0];
	}

    function img2md($match){
        if(preg_match('/src=[\"\'](.*?)[\'\"]/',$match[0],$match1)){
            return preg_replace('/src=[\"\'](.*?)[\'\"]/',"![$1]($1)", $match1[0]);
        }else {
            return $match[0];
        }
    }

	function url2md($match){
        if( preg_match('/href=[\"\'](.*?)[\'\"]/',$match[0],$match2)) {
            if(strpos($match[0],'javascript')==0){
                return '';
            }
            return preg_replace('/href=[\"\'](.*?)[\'\"]/',"[{$match[1]}]($1)", $match2[0]);
        } else {
            return $match[0];
        }
    }

	function table2md($match){
        $markup=$match[0];
        $markup=  preg_replace('/[\r\n]*/i',"",$markup);
        $markup=  preg_replace('/<tr[^>]*?>[\r\n\t\s]*<th>/','|',$markup);
        $markup=  preg_replace('/<tr[^>]*?>[\r\n\t\s]*?<td>/','|',$markup);
        $markup=  preg_replace('/<\/td[^>]*?>[\r\n\t\s]*?<td[^>]*?>/','|',$markup);
        $markup=  preg_replace('/<\/th[^>]*?>[\r\n\t\s]*?<th[^>]*?>/','|',$markup);
        $markup=  preg_replace('/<\/td[^>]*?>[\r\n\t\s]*?<\/tr>/',"|\n",$markup);
        $markup=  preg_replace('/<\/th[^>]*?>[\r\n\t\s]*?<\/tr>/',"|\n",$markup);
        $markup=  preg_replace('/<\w+[^>]*?>|<\/\w+>/','',$markup);
        $trs= preg_split('/\n+/',$markup);
        $rows=array();
        $i=0;
        foreach($trs as  $tr){
            $tr= preg_replace('/^[\s\t]*/','', $tr);
            $tr=trim($tr);
            if(strlen($tr)>0){
                $tr=preg_replace('/^[\s\t]*/','',$tr);
                if($i==1){
                    array_push($rows,preg_replace('/[^\|]+/',':--:',$tr));
                }
                array_push($rows,$tr);
                $i=$i+1;
            }

        }
        return join("\n",$rows);
        return $markup;
    }

    //$markup= preg_replace('/[\r\n]*/i',"",$markup);
    $markup= preg_replace('/<script[^>]*?>[\s\S]*?<\/script>/i',"",$markup);
    $markup= preg_replace('/<a\s+[^>]*javascript*?>[\s\S]*?<\/a>/i',"",$markup);
    $markup= preg_replace('/<br\/?>|<br\s*\/>/i',"\r\n",$markup);
    $markup= preg_replace('/<\/li>/i',"</li>\r\n",$markup);
    $markup= preg_replace('/<\/p>/i',"</p>\r\n",$markup);
    $markup= preg_replace('/<\/div>/i',"</div>\r\n",$markup);

    //echo $markup;die;
    $markup= preg_replace('/<pre[^>]*?>[\s\S]*?<\/pre>/i',"\r\n```\r\n$0\r\n```\r\n",$markup);
    $markup= preg_replace('/<blockquote[^>]*?>[\s\S]*?<\/blockquote>/i',"\r\n```\r\n$0\r\n```\r\n",$markup);
    $markup= preg_replace_callback('/<img[^>]+?>/i','img2md',$markup);
    $markup= preg_replace_callback('/<a\s+[^>]+?>([\s\S]*?)<\/a>/i','url2md',$markup);
    $markup= preg_replace_callback('/<table[^>]*?>[\s\S]*?<\/table>/i','table2md',$markup);

    $markup= preg_replace('/(\r\n){2,}/i',"\n",$markup);
	$markup= preg_replace('/&nbsp;/i',"",$markup);

	

	 $markup= preg_replace('/<\w+[^>]*?>|<\/\w+>/i',"",$markup);

	
	return $markup;
	return '<pre>'.$markup.'</pre>';

}



//$content=file_get_contents('http://developer.51cto.com/art/201412/462887.htm');

//$content=file_get_contents('http://wuzhaohuixy-qq-com.iteye.com/blog/2171630');


$content=file_get_contents($_POST['url']);

echo html2md($content);