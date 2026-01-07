import { notFound } from "next/navigation"
import { fetchGroups } from "@/actions/group/fetch"
import Groups from "@/components/containers/group/groups"

export default async function Group() {
  const groups = await fetchGroups()

  if (!groups) {
    notFound()
  }
  return <Groups />
}
