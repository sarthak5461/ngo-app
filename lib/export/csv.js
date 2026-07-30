/**
 * Escapes a value for CSV.
 */
export function escapeCSV(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    value = value.toISOString();
  }

  if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  return `"${String(value).replace(/"/g, '""')}"`;
}

/**
 * Generates a CSV string.
 *
 * @param {Array} rows
 * @param {Array<{header:string,key:string,format?:Function}>} columns
 */
export function generateCSV(rows, columns) {
  const headerRow = columns.map((c) => escapeCSV(c.header)).join(",");

  const body = rows.map((row) =>
    columns
      .map((column) => {
        const value = column.format ? column.format(row) : row[column.key];

        return escapeCSV(value);
      })
      .join(","),
  );

  return [headerRow, ...body].join("\n");
}

/**
 * Creates a downloadable CSV response.
 */
export function csvResponse(filename, csv) {
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
