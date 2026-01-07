import type { Group } from "@/types/group/group"
import type { GroupRaw } from "@/types/group/group-raw"

export function groupDataConverter(data: GroupRaw): Group {
  return {
    id: data.id as number,
    adminId: data.admin_id as string,
    name: data.name as string,
    createdAt: data.created_at as string,
    members: data.group_members.map((m) => ({
      id: m.id as number,
      role: m.role as string,
      displayName: Array.isArray(m.profiles)
        ? m.profiles[0].display_name
        : m.profiles.display_name,
    })),
  }
}
