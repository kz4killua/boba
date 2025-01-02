import { LoaderIcon } from "lucide-react"


export function Loading({
  size=12
} : {
  size?: number
}) {
  return (
    <LoaderIcon size={size} className="animate-spin" />
  )
}