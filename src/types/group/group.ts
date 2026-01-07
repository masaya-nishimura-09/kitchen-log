export interface Group {
  id: number
  adminId: string
  name: string
  members: GroupMember[]
  createdAt: string
}

export interface GroupMember {
  id: number
  role: string
  displayName: string
}
