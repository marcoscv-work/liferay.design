// Lexicon Docs Sync — proof of concept.
//
// Runs in the Figma sandbox with the signed-in user's session, so it can read
// design variables, component-set variants and export images *natively* — no
// REST token, no Enterprise scope (which is exactly what blocks the headless
// scripts today). This PoC only EXTRACTS the data and shows the JSON it would
// produce; wiring it to a GitHub App / PR is the next step.

figma.showUI(__html__, { width: 520, height: 680, themeColors: true })

const round = n => Math.round(n * 255)
const hex2 = n => round(n).toString(16).padStart(2, '0')
function rgbaToHex(c) {
	const base = `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}`
	return c.a === undefined || c.a === 1 ? base : base + hex2(c.a)
}

// Resolve a variable's value in the collection's default mode, following one
// level of alias (mirrors how the docs token map reads).
async function resolveValue(variable, collectionsById) {
	const col = collectionsById[variable.variableCollectionId]
	const modeId = col ? col.defaultModeId : Object.keys(variable.valuesByMode)[0]
	let val = variable.valuesByMode[modeId]
	if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
		const ref = await figma.variables.getVariableByIdAsync(val.id)
		if (ref) return resolveValue(ref, collectionsById)
	}
	if (variable.resolvedType === 'COLOR' && val && typeof val === 'object') return rgbaToHex(val)
	if (variable.resolvedType === 'FLOAT') return String(val)
	return String(val)
}

// All local variables → { "Group/name": value }, grouped for display by the
// first path segment (Color, Spacing, …).
async function extractTokens() {
	const [vars, collections] = await Promise.all([
		figma.variables.getLocalVariablesAsync(),
		figma.variables.getLocalVariableCollectionsAsync(),
	])
	const byId = Object.fromEntries(collections.map(c => [c.id, c]))
	const tokens = {}
	for (const v of vars) tokens[v.name] = await resolveValue(v, byId)
	const groups = {}
	for (const [name, value] of Object.entries(tokens)) {
		const g = name.split('/')[0] || 'Other'
		;(groups[g] = groups[g] || []).push({ name, value })
	}
	return { count: Object.keys(tokens).length, tokens, groups }
}

// Component sets on the current page → variant axes + count, parsed from the
// "Prop=Value, Prop2=Value2" child names.
function extractComponentSets() {
	const sets = figma.currentPage.findAllWithCriteria({ types: ['COMPONENT_SET'] })
	return sets.map(set => {
		const variants = set.children.filter(c => c.type === 'COMPONENT')
		const axes = {}
		for (const c of variants) {
			for (const part of c.name.split(',')) {
				const i = part.indexOf('=')
				if (i === -1) continue
				const key = part.slice(0, i).trim()
				const value = part.slice(i + 1).trim()
				if (!key || !value) continue
				;(axes[key] = axes[key] || new Set()).add(value)
			}
		}
		return {
			name: set.name,
			nodeId: set.id,
			variantCount: variants.length,
			properties: Object.entries(axes).map(([name, values]) => ({ name, values: [...values] })),
		}
	})
}

figma.ui.onmessage = async msg => {
	if (msg.type === 'extract') {
		try {
			const tokens = await extractTokens()
			const componentSets = extractComponentSets()
			figma.ui.postMessage({
				type: 'result',
				fileName: figma.root.name,
				page: figma.currentPage.name,
				tokens,
				componentSets,
			})
		} catch (e) {
			figma.ui.postMessage({ type: 'error', message: String((e && e.message) || e) })
		}
	}
}
