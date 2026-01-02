import {
  // IconCalendarEvent,
  IconFile,
  IconFolder,
  IconHome,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons-react"

export const items = [
  {
    title: "ホーム",
    url: "/dashboard",
    icon: IconHome,
  },
  {
    title: "レシピ",
    url: "/dashboard/recipe",
    icon: IconFile,
  },
  {
    title: "献立",
    url: "/dashboard/set-meal",
    icon: IconFolder,
  },
  {
    title: "買い物リスト",
    url: "/dashboard/shopping-list",
    icon: IconShoppingCart,
  },
  // {
  //   title: "カレンダー",
  //   url: "/dashboard/calendar",
  //   icon: IconCalendarEvent,
  // },
  {
    title: "設定",
    url: "/dashboard/setting",
    icon: IconSettings,
  },
]
