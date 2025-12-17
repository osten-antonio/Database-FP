export function Category({ name, text, bg }) {
  return (
    <div style={{ color: text, backgroundColor: bg}} className="rounded-md p-2 mr-3 text-center border-primary-dark border-2">
      {name}
    </div>
  )
}
