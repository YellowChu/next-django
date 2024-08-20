export default function PostComment({ created, content }: { created: string, content: string }) {
  return (
    <div className="shadow-md p-3 bg-slate-200 rounded-lg">
      <div className="text-xs text-slate-500">{created}</div>
      <p className="mt-2">{content}</p>
    </div>
  )
}