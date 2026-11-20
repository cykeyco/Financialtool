import { useRef, useState, type DragEvent } from 'react'
import { Button } from '../components/Button'
import { UploadIcon } from '../components/icons'
import { useFocusOnMount } from '../components/useFocusOnMount'
import { FILES, type ImportFile } from '../data/mockData'

export function UploadStep({ onStart, focus }: { onStart: (file: ImportFile) => void; focus: boolean }) {
  const [dragging, setDragging] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const heading = useFocusOnMount<HTMLHeadingElement>(focus)

  // Any real file the user picks runs the clean sample data, under its own name.
  const handleFile = (file?: File) => file && onStart({ ...FILES.clean, name: file.name })

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <section
      aria-labelledby="upload-title"
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`flex flex-col items-center gap-4 border-[1.5px] border-dashed px-8 py-16 text-center transition-colors duration-200 ${
        dragging ? 'border-accent bg-accent-bg' : 'border-line-strong'
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex size-12 items-center justify-center transition-transform duration-200 ${
          dragging ? '-translate-y-1 bg-white' : 'bg-canvas'
        }`}
      >
        <UploadIcon />
      </span>
      <div className="flex flex-col gap-1">
        <h2 id="upload-title" ref={heading} tabIndex={-1} className="text-[17px] font-semibold outline-none">
          {dragging ? 'Drop to start' : 'Drop a bank export here'}
        </h2>
        <p className="text-muted">
          CSV or Excel. Columns are matched for you, and you review anything uncertain before import.
        </p>
      </div>
      <input
        ref={input}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <Button onClick={() => input.current?.click()}>Choose file</Button>
      <p className="mt-2 text-[13px] text-muted">
        No file to hand? Try a sample:{' '}
        <Button variant="link" onClick={() => onStart(FILES.clean)}>
          clean export
        </Button>{' '}
        or{' '}
        <Button variant="link" onClick={() => onStart(FILES.withProblems)}>
          export with problems
        </Button>
      </p>
    </section>
  )
}
