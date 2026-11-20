import { AlertIcon } from '../../components/icons'

export function ErrorBanner({ rows }: { rows: number[] }) {
  if (rows.length === 0) return null
  const list = rows.length > 1 ? `${rows.slice(0, -1).join(', ')} and ${rows.at(-1)}` : String(rows[0])
  return (
    <div role="alert" className="flex gap-3 bg-danger-bg px-4 py-3.5 text-danger-ink">
      <AlertIcon className="mt-0.5 shrink-0 text-danger" />
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{rows.length} rows couldn’t be read and will be left out</span>
        <span className="text-[13px]">
          Rows {list} have no amount. Fix them in your file and import again, or add them by hand later.
        </span>
      </div>
    </div>
  )
}
