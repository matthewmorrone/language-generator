<?

$features = file("features.csv");
array_shift($features);
foreach($features as $key=>$value): $features[$key] = explode(",", trim($value)); endforeach;
foreach($features as $key=>$value): $stuff1[$value[0]] = $value[1]; endforeach;

$values = file("values.csv");
array_shift($values);
foreach($values as $key=>$value): $values[$key] = explode(",", $value); endforeach;
foreach($values as $key=>$value):
	$stuff2[$value[0]][] = $value[2];
	$short[$value[0]][] = $value[1];
endforeach;

foreach($stuff1 as $key=>$value):
	$short[$key] = implode(",", $short[$key]);
	$stuff[] = $stuff1[$key].",".implode(",", $stuff2[$key]);
endforeach;

$file = fopen("wals-short.config", "w+");
foreach($short as $key=>$thing):
	fwrite($file, $key.",".$thing."\n");
endforeach;
fclose($file);

$file = fopen("wals-long.config", "w+");
foreach($stuff as $thing):
	fwrite($file, $thing."\n");
endforeach;
fclose($file);







