// CSV export helper.
export function toCSV(rows, columns) {
  if (!rows || rows.length === 0) return columns.map(c => c.label).join(',') + '\n'
  const header = columns.map(c => `"${c.label}"`).join(',')
  const body = rows.map(row =>
    columns.map(c => {
      const v = typeof c.get === 'function' ? c.get(row) : row[c.key]
      if (v === undefined || v === null) return ''
      const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
      return `"${s.replace(/"/g, '""')}"`
    }).join(',')
  ).join('\n')
  return header + '\n' + body
}

export function csvResponse(filename, csv) {
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
