<?php
require __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$path = __DIR__ . '/../public/templates/sawsa_meter_reading_template.xlsx';
echo "File: $path\n";
echo "Size: " . filesize($path) . " bytes\n\n";

$reader = IOFactory::createReaderForFile($path);
$reader->setReadDataOnly(false);
$spreadsheet = $reader->load($path);
$sheet = $spreadsheet->getActiveSheet();

$highest = $sheet->getHighestRowAndColumn();
echo "Sheet: {$sheet->getTitle()}, {$highest['row']} rows x {$highest['column']} cols\n";
foreach ($sheet->getRowIterator(1, 2) as $row) {
    $cells = [];
    foreach ($row->getCellIterator() as $cell) {
        $cells[] = $cell->getColumn() . "=" . var_export($cell->getValue(), true);
    }
    echo "Row {$row->getRowIndex()}: " . implode(' | ', $cells) . "\n";
}

$b1 = $sheet->getCell('B1')->getValue();
if ($b1 === 'Meter Reading (m³)') {
    echo "\n[PASS] B1 header is exactly \"Meter Reading (m³)\"\n";
} else {
    echo "\n[FAIL] B1 header is: " . var_export($b1, true) . "\n"; exit(1);
}

$f = $sheet->getStyle('B1')->getFont();
echo "B1 font: name=" . ($f->getName() ?: 'default') . ", size=" . $f->getSize() . ", bold=" . var_export($f->getBold(), true) . ", color=" . ($f->getColor()->getRGB() ?: 'default') . "\n";
$fill = $sheet->getStyle('B1')->getFill()->getFillType();
echo "B1 fill type: " . var_export($fill, true) . ($fill !== 'none' ? " color=" . $sheet->getStyle('B1')->getFill()->getStartColor()->getRGB() : '') . "\n";
echo "Col A width: " . var_export($sheet->getColumnDimension('A')->getWidth(), true) . "\n";
echo "Col B width: " . var_export($sheet->getColumnDimension('B')->getWidth(), true) . "\n";
echo "Row 1 height: " . var_export($sheet->getRowDimension(1)->getRowHeight(), true) . "\n";
echo "\nINSPECTION DONE\n";
