<?php

namespace App\Imports;

use RuntimeException;

/**
 * Thrown when an uploaded spreadsheet fails validation.
 *
 * Carries the full list of row-level errors so the UI can show every problem
 * in the file instead of stopping at the first one. When this exception is
 * thrown no rows have been imported.
 */
class MeterReadingImportValidationException extends RuntimeException
{
    /** @var list<string> */
    private array $errors;

    /**
     * @param  list<string>  $errors
     */
    public function __construct(array $errors)
    {
        $this->errors = array_values($errors);

        parent::__construct(implode("\n", $this->errors));
    }

    /**
     * Every validation error, one per offending row (plus any file-level errors).
     *
     * @return list<string>
     */
    public function errors(): array
    {
        return $this->errors;
    }
}
