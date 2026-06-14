import { getCollection } from 'astro:content'
import { cleanId } from './helpers'

export interface SidebarNode {
	key: string
	title: string
	slug?: string
	order: number | string
	firstLevel?: boolean
	children: SidebarNode[]
}

function startCase(s: string): string {
	return s.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/** Port of the Lexicon template buildSidebarTree (slug-segment nesting). */
export async function buildSidebarTree(): Promise<SidebarNode[]> {
	const entries = await getCollection('lexicon', ({ data }) => data.draft !== true)
	const root: SidebarNode = { key: '', title: '', order: 0, children: [] }

	for (const entry of entries) {
		const id = cleanId(entry.id)
		const segs = id.split('/').filter(Boolean)
		let node = root
		segs.forEach((seg, i) => {
			let child = node.children.find(c => c.key === seg)
			if (!child) {
				child = { key: seg, title: startCase(seg), order: startCase(seg), children: [] }
				node.children.push(child)
			}
			if (i === segs.length - 1) {
				child.title = entry.data.title || startCase(seg)
				child.slug = `/lexicon/${id}`
				child.order = entry.data.order ?? child.title
				child.firstLevel = segs.length === 1
			}
			node = child
		})
	}

	const sortTree = (nodes: SidebarNode[]): SidebarNode[] =>
		nodes
			.sort((a, b) => {
				if (typeof a.order === 'number' && typeof b.order === 'number') return a.order - b.order
				return String(a.order).localeCompare(String(b.order))
			})
			.map(n => ({ ...n, children: sortTree(n.children) }))

	return sortTree(root.children)
}
