import type { LucideIcon } from 'lucide-react'
import { Ticket, BookOpen, Feather, Swords, Skull, Map, Newspaper } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：Grand Alfheim（Roblox SAO 风格幻想 MMORPG）
// 7 个内容分类（community 分类按任务要求不进导航栏）
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Ticket, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'races', path: '/races', icon: Feather, isContentType: true },
	{ key: 'combat', path: '/combat', icon: Swords, isContentType: true },
	{ key: 'dungeons', path: '/dungeons', icon: Skull, isContentType: true },
	{ key: 'maps', path: '/maps', icon: Map, isContentType: true },
	{ key: 'updates', path: '/updates', icon: Newspaper, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['codes', 'guide', ...]

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
