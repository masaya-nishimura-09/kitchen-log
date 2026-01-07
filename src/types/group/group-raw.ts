export interface GroupRaw {
  id: number
  admin_id: string
  name: string
  created_at: string
  group_members: GroupMemberRaw[]
}

export interface GroupMemberRaw {
  id: number
  role: string
  user_id: string
  profiles: ProfileRaw[] | ProfileRaw
}

export interface ProfileRaw {
  display_name: string
}
