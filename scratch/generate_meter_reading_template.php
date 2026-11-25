<?php

/**
 * One-off generator: rewrites public/templates/sawsa_meter_reading_template.xlsx
 * to the simplified import format (Customer | Meter Reading (m³)).
 */

require __DIR__ . '/../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$sheet->setTitle('Meter Readings');

$headers = ['Customer', 'Meter Reading (m³)'];
foreach ($headers as $i => $header) {
    $column = Coordinate::stringFromColumnIndex($i + 1);
    $sheet->setCellValue($column . '1', $header);
    $sheet->getColumnDimension($column)->setWidth($i === 0 ? 32 : 18);
}

$sheet->getStyle('A1:B1')->applyFromArray([
    'font' => [
        'bold'  => true,
        'color' => ['rgb' => 'FFFFFF'],
        'size'  => 12,
    ],
    'fill' => [
        'fillType'   => Fill::FILL_SOLID,
        'startColor' => ['rgb' => '047857'],
    ],
    'alignment' => [
        'horizontal' => Alignment::HORIZONTAL_LEFT,
        'vertical'   => Alignment::VERTICAL_CENTER,
    ],
]);
$sheet->getRowDimension('1')->setRowHeight(24);

$writer = new Xlsx($spreadsheet);
$writer->save(__DIR__ . '/../public/templates/sawsa_meter_reading_template.xlsx');

echo "Template written to public/templates/sawsa_meter_reading_template.xlsx\n";
