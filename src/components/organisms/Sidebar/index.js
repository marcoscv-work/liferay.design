/** @jsx jsx */

import { jsx, Grid } from 'theme-ui'
import { Link, SiteName } from 'components/atoms'
import { Accordion, SiteCredits, SearchInput } from 'components/molecules'
import { map, orderBy } from 'lodash'
import * as styles from './styles.module.scss'

const SidebarContent = ({ path, tree }) => {
	const sidebarStyles = styles || {}
	const unorderedTree = map(tree, node => {
		const className = `
		${sidebarStyles.leafLink || ''}
		${node.slug === path ? sidebarStyles.active || '' : ''} ${
			node.firstLevel ? sidebarStyles.firstLevelNode || '' : ''
		}`

		if (node.hasOwnProperty('children')) {
			return (
				<Accordion
					className={className}
					key={node.order}
					open={path
						.toLowerCase()
						.includes(node.title.toLowerCase().replace(/ /g, '-'))}
					title={node.title}
					parentLink={node.slug}
				>
					<SidebarContent path={path} tree={node.children} />
				</Accordion>
			)
		}

		return (
			<Link className={className} key={node.order} to={node.slug}>
				{node.title}
			</Link>
		)
	})

	return orderBy(unorderedTree, 'key', 'asc')
}

export default function SidebarWrapper({
	path,
	tree,
	isMobile,
	showSidebar,
	section,
	lexicon,
}) {
	const sidebarStyles = styles || {}
	const className = `
		${sidebarStyles.sidebar || ''} 
		${isMobile && showSidebar ? sidebarStyles.onScreen || '' : ''} 
		${isMobile && !showSidebar ? sidebarStyles.offScreen || '' : ''} 
		${lexicon ? sidebarStyles.lexicon || '' : sidebarStyles.sidebar || ''}
		${section === 'Handbook' ? sidebarStyles.handbook || '' : ''}
	`

	return (
		<Grid
			sx={{
				gridTemplateColumns: '1fr',
				gridTemplateRows: ['8rem', null, '12rem auto 8rem'],
				gap: 0,
			}}
			className={className}
		>
			{!isMobile && (
				<div className={sidebarStyles.section}>
					<SiteName section={section} dark />
				</div>
			)}

			<div className={sidebarStyles.sidebarContentWrapper}>
				{lexicon && (
					<SearchInput id='lexicon_search' />
				)}
				<SidebarContent path={path} tree={tree} />
			</div>

			{!isMobile && (
				<div className={sidebarStyles.credits}>
					<SiteCredits />
				</div>
			)}
		</Grid>
	)
}
