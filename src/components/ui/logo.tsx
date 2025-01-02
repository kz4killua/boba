import { CircleIcon } from "lucide-react"


export function Logo({
  size = 20,
} : {
  size?: number
}) {
  return (
    <CircleIcon size={size} />
  )
}