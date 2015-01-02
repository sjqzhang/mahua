<?php

require_once(dirname(__FILE__).'/phpQuery.php');



class Html2md {


		function img2md($match){
			if(preg_match('/src=[\"\'](.*?)[\'\"]/',$match[0],$match1)){
				return preg_replace('/src=[\"\'](.*?)[\'\"]/',"![$1]($1)", $match1[0]);
			}else {
				return $match[0];
			}
		}

		function h2md($match){
			print_r(match);die;
			$h=trim($match[1]);
			return "\r\n#### ".$h;
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


	function parse($markup,$istable=true){

	
		
		
		
		$markup= preg_replace('/<script[^>]*?>[\s\S]*?<\/script>/i',"",$markup);
		$markup= preg_replace('/<a\s+[^>]*javascript*?>[\s\S]*?<\/a>/i',"",$markup);
		if($istable){
			$markup= preg_replace('/[\r\n]*/i',"",$markup);
			$markup= preg_replace_callback('/<table[^>]*?>[\s\S]*?<\/table>/i',array($this,'table2md'),$markup);
		}
		/*
		$markup= preg_replace('/<br\/?>|<br\s*\/>/i',"\r\n",$markup);
		$markup= preg_replace('/<\/li>/i',"</li>\r\n",$markup);
		$markup= preg_replace('/<\/p>/i',"</p>\r\n\r\n",$markup);
		$markup= preg_replace('/<\/div>/i',"</div>\r\n",$markup);
		*/

		//echo $markup;die;
		/*$markup= preg_replace('/<pre[^>]*?>[\s\S]*?<\/pre>/i',"\r\n```\r\n$0\r\n```\r\n",$markup);
		$markup= preg_replace('/<blockquote[^>]*?>[\s\S]*?<\/blockquote>/i',"\r\n```\r\n$0\r\n```\r\n",$markup);
		*/
		$markup= preg_replace_callback('/<img[^>]+?>/i', array($this,'img2md'),$markup);
		$markup= preg_replace_callback('/<h\d[^>]+?>([\s\S]+?)<\/h\d>/i', array($this,'h2md'),$markup);
		$markup= preg_replace_callback('/<a\s+[^>]+?>([\s\S]*?)<\/a>/i',array($this, 'url2md'),$markup);
		

		//$markup= preg_replace('/(\r\n){2,}/i',"\n",$markup);
 
        
		$markup= preg_replace(array(
			'/<pre[^>]*?>[\s\S]*?<\/pre>/i',
			'/<blockquote[^>]*?>[\s\S]*?<\/blockquote>/i',
			'/<br\/?>|<br\s*\/>/i',
			'/<\/li>/i',
			'/<\/p>/i',
			'/<\/div>/i',
			'/&nbsp;/i',
			'/&lt;/i',
			'/&gt;/i',
			'/&quot;/i',
			'/<script[^>]*?>[\s\S]*?<\/script>/i',
			'/<strong[^>]*?>[\s\S]*?<\/strong>/i',
		
			),array(
			"\r\n```\r\n$0\r\n```\r\n",
			"\r\n```\r\n$0\r\n```\r\n",
			"\r\n",
			"</li>\r\n",
			"</p>\r\n\r\n",
			"</div>\r\n",
			" ",
			"<",
			">",
			'"',
			"",
			"\r\n\r\n#### $0\r\n\r\n",
		
			),$markup);
			
			
           

		

		 $markup= preg_replace('/<\w+[^>]*?>|<\/\w+>/i',"",$markup);

		
		return $markup;
		return '<pre>'.$markup.'</pre>';

	}

	function phpQueryCli($markup, $callQueue) {

		$pq = phpQuery::newDocument($markup);
		$method = null;
		$params = array();
		foreach($callQueue as $param) {
			if (strpos($param, '--') === 0) {
				if ($method) {
					$pq = call_user_func_array(array($pq, $method), $params);
				}
				$method = substr($param, 2);	// delete --
				$params = array();
			} else {
				$param = str_replace('\n', "\n", $param);
				$params[] = strtolower($param) == 'null'
					? null
					: $param;
			}
		}
		if ($method)
			$pq = call_user_func_array(array($pq, $method), $params);


		if (is_array($pq)){
			foreach($pq as $v)
				print $v;
		}
		else{
			print preg_replace('/(\n\s*){3,}/',"\n",$pq)."\n";
		}
		//var_dump($pq);
	}



	function url_prefix($url){

		preg_match('/https?:\/\/[^\/]+\/?/',$url,$match);
		$ret= isset($match[0])? $match[0]:'';

		if(substr($ret,strlen($ret)-1)=='/'){
			return substr($ret,0,strlen($ret)-1);
		} else {
			return $ret;
		}


	}
	function url_suffix($url){

		return substr($url,0 , strripos($url,'/')?strripos($url,'/')+1:strlen($url));

	}

	function url_get($url) {
		$ABSOLUTE_URL=$this->url_prefix($url);
		$RELATIVE_URL=$this->url_suffix($url);

		$content='';
		if(substr($url,0,4)=='http'){
			$content=file_get_contents($url);
			//$snoopy=new Snoopy();
			//$snoopy->agent = "Mozilla/5.0 (X11; Linux x86_64; rv:29.0) Gecko/20100101 Firefox/29.0 FirePHP/0.7.4";
			//$snoopy->referer = $url;
			//$snoopy->fetch($url);
			//$content=$snoopy->results;
			if(empty($content)) {
				echo "html is empty\n";die;
			}
			$content=$this->html2utf8($content);
			$content=$this->url_real_replace($content,$ABSOLUTE_URL,$RELATIVE_URL);
		}
		//    echo $content;
		return $content;
	}

	function url_real_replace($content,$abs_url,$rela_url){

		preg_match('/<base\s*href="([^"]*)"/',$content,$m);


		if(isset($m[1])){
			$rela_url=$m[1];
		}



		$content= preg_replace('/<base[^>]*>|<\/base>/','',$content);

		$pattens=array(
			'/src="\//i',
			'/href="\//i',
			'/href="#/i',
			'/href="(?!http)([^"]*)"/i',
			'/href=\'(?!http)([^\']*)\'/i',
			'/src="(?!http)([^"]*)"/i',
			'/src=\'(?!http)([^\']*)\'/i',

		);

		$replaces=array(
			'src="'.$abs_url.'/',
			'href="'.$abs_url.'/',
			'href="#/',
			'href="'.$rela_url.'\1"',
			'href=\''.$rela_url.'\1\'',
			'src="'.$rela_url.'\1"',
			'src="'.$rela_url.'\1"',

		);


		$content=preg_replace('/<script.*?(?<=show_ads)[^>]*>[\s\r\n\t]*<\/script>/im','',$content);


		return preg_replace($pattens,$replaces,$content);

	}

	function html2utf8($content){
		preg_match('/<meta.*charset="?([a-zA-Z0-9-]+)"?/i',$content,$match);
		if(!isset($match[1])){
			preg_match('/charset="?([a-zA-Z0-9-]+)"?/i',$content,$match);
		}
		if(isset( $match[1])){
			if(strtolower( $match[1])!='utf-8'){
				$pattens=array(
					'/charset="([a-zA-Z0-9-]+)"/i',
					'/charset=([a-zA-Z0-9-]+)"/i',

				);
				$replaces=array(
					' charset="utf-8" ',
					' charset=utf-8"',
				);
				$content= preg_replace($pattens,$replaces,$content);
				if(strtolower($match[1])=='gb2312'){
					$match[0]='gbk';
				}
				$content= iconv($match[1].'//IGNORE','utf-8//IGNORE',$content);
			}
		}

		$content=  preg_replace('/<head[^>]*?>/','<head>',$content);
		return $content;
	}

	function get_title($html){
		if( preg_match('/<title[^>]*?>([\s\S]*?)<\/title>/i',$html,$title)){
			return trim($title[1]);
		} else {
			return "untitled";
		}
	}


	function get_container($html){
		$ids=array();
		if(preg_match_all('/<div[^>]*id="([^"]+?)"[^>]*?>/i',$html,$matchs)){
			foreach($matchs[1] as $i=> $id){
						array_push($ids,'#'.$id);
			}
		}

		if(preg_match_all('/<div[^>]*id="([^"]+?)"[^>]*?>/i',$html,$matchs)){
			foreach($matchs[1] as $i=> $id){
						$id=trim($id);
						array_push($ids,'.'.preg_replace('/\s+/',',.',$id));
			}
		}
		return $ids;
	}
}


?>
