import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'

// All content + data is sourced in place from the existing Gatsby tree
// (../src/markdown). Nothing is copied: this Astro app reads the same files.
const MARKDOWN = '../src/markdown'

// Shared links shape used by Authors. Kept open (record) so any social network
// present in the YAML survives without schema churn.
const links = z.record(z.string(), z.string()).optional()

const authors = defineCollection({
	loader: file(`${MARKDOWN}/Authors.yaml`),
	schema: z.object({
		id: z.string(),
		title: z.string().nullable().optional(),
		active: z.boolean().nullable().optional(),
		icon: z.string().nullable().optional(),
		startDate: z.coerce.date().nullable().optional(),
		endDate: z.coerce.date().nullable().optional(),
		office: z.string().nullable().optional(),
		alumni: z.boolean().nullable().optional(),
		links,
	}),
})

const offices = defineCollection({
	loader: file(`${MARKDOWN}/Offices.yaml`),
	schema: z.object({
		id: z.string(),
		countryIcon: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		region: z.string().nullable().optional(),
		mapURL: z.string().nullable().optional(),
		photo: z.string().nullable().optional(),
	}),
})

const articles = defineCollection({
	loader: glob({ base: `${MARKDOWN}/articles`, pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		author: z.string(),
		authorLink: z.string().nullable().optional(),
		contributors: z.array(z.string()).nullable().optional(),
		date: z.coerce.date(),
		featuredImage: z.string().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
		canonicalLink: z.string().nullable().optional(),
		publish: z.boolean().nullable().optional(),
	}),
})

const events = defineCollection({
	loader: glob({ base: `${MARKDOWN}/events`, pattern: ['**/*.{md,mdx}', '!**/_template/**'] }),
	schema: z.object({
		title: z.string(),
		draft: z.boolean().optional(),
		office: z.string().optional(),
		date: z.string().optional(),
		endDateTime: z.string().optional(),
		summary: z.string().optional(),
		featuredImage: z.string().optional(),
		heroImage: z.string().optional(),
		bodyImage: z.string().optional(),
		ctaURL: z.string().optional(),
		author: z.string().optional(),
	}),
})

const team = defineCollection({
	loader: glob({ base: `${MARKDOWN}/team`, pattern: ['**/*.{md,mdx}', '!**/_template/**'] }),
	schema: z.object({
		author: z.string(),
	}),
})

const lexicon = defineCollection({
	loader: glob({ base: `${MARKDOWN}/lexicon`, pattern: ['**/*.{md,mdx}', '!**/_template/**'] }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		icon: z.string().optional(),
		order: z.number().optional(),
		draft: z.boolean().optional(),
		tags: z.union([z.string(), z.array(z.string())]).optional(),
		titleLabelLink: z.string().optional(),
		figmaLink: z.string().optional(),
		docLink: z.string().optional(),
		devStatus: z.string().optional(),
		productName: z.string().optional(),
	}),
})

export const collections = { authors, offices, articles, events, team, lexicon }
