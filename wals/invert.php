<?


$arr = file("datapoints.csv");

ini_set('memory_limit','256M');

foreach($arr as $key=>$line)
{
	$arr[$key] = explode(",", $line);

}


function flip_row_col_array($array) {
    $out = array();
    foreach ($array as  $rowkey => $row) {
        foreach($row as $colkey => $col){
            $out[$colkey][$rowkey]=$col;
        }
    }
    return $out;
}

$out = flip_row_col_array($arr);

$f = fopen("datapoints-inverted.csv", "w+");


foreach($out as $row):
	$row = implode(",", $row);
	fwrite($f, $row."\n");

endforeach;

fclose($f);

?>
