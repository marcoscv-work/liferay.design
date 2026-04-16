/** @jsx jsx */

import { jsx } from 'theme-ui'
import { Flex, ScrollProgress } from 'components/atoms'
import { Author, GlobalMdx, SEO, Date as NiceDate } from 'components/molecules'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { Footer, Navbar } from 'components/organisms'
import { Link } from 'components/atoms'
import { graphql } from 'gatsby'
import moment from 'moment'
import { Component } from 'react'
import * as styles from './styles.module.scss'

export default class Events extends Component {
	render() {
		const post = this.props.data.mdx
		const componentStyles = styles || {}
		const office = post.frontmatter.office || {}

		// Prereqs for conditional date rendering
		const d1 = new Date() // Get today's date
		const today = d1.getTime() // convert to date object
		const d2 = new Date(moment(post.frontmatter.date).format('YYYY/MM/DD')) // get the date from the frontmatter
		const eventDate = d2.getTime() // convert the event's date to a date object

		return (
			<div>
				<ScrollProgress />
				<SEO
					description={post.excerpt}
					previewImage={post.frontmatter.featuredImage}
					keywords={'event, events in ' + `${office.id || 'Liferay'}`}
					pageTitle={
						`${post.frontmatter.title}` +
						' | Design.Liferay Event in ' +
						`${office.id || 'Liferay'}`
					}
					contentType="event"
				/>
				<Navbar section="Events" />

				<Flex justify="center" align="center" className={componentStyles.banner}>
					<Flex direction="column" className={componentStyles.bannerContent}>
						<h1>
							<NiceDate
								large
								dark
								size="3rem"
								className={componentStyles.date}
								color="mainl3"
								month={moment(post.frontmatter.date).format('MMM')}
								day={moment(post.frontmatter.date).format('DD')}
							/>
							{post.frontmatter.title}{' '}
						</h1>
						<h2>
							{`${moment(post.frontmatter.date).format('h:mma')}` ===
							'12:00am' ? null : (
								<span className={componentStyles.startTime}>
									{moment(post.frontmatter.date).format('h:mma')}
								</span>
							)}
							{post.frontmatter.endDateTime && (
								<span className={componentStyles.endTime}>
									&nbsp; – &nbsp;
									{moment(post.frontmatter.endDateTime).format('h:mma')}
								</span>
							)}
							<span className={componentStyles.locationName}>
								<Link to={office.mapURL}>
									{office.id || 'Location TBD'}
									{office.state ? `, ${office.state}` : ''}
								</Link>
							</span>
						</h2>
						{post.frontmatter.heroImage && (
							<img
								className={componentStyles.heroImage}
								src={post.frontmatter.heroImage}
							/>
						)}
						<p className={componentStyles.summary}>{post.frontmatter.summary}</p>
						{post.frontmatter.bodyImage && (
							<img
								className={componentStyles.bodyImage}
								src={post.frontmatter.bodyImage}
							/>
						)}
					</Flex>
				</Flex>
				{today < eventDate ? (
					<Link to={post.frontmatter.ctaURL} className={componentStyles.ctaButton}>
						RSVP
					</Link>
				) : null}
				<div className={componentStyles.markdownContainer}>
					<div className={componentStyles.wrapper}>
						{post.frontmatter.author ? (
							<Author
								id={post.frontmatter.author.id}
								sx={{ m: ['0 0 2rem -.4rem', '0 0 2rem -3.5rem'] }}
							/>
						) : null}
						<GlobalMdx>
							<MDXRenderer>{post.body}</MDXRenderer>
						</GlobalMdx>
					</div>
				</div>
				<Footer light />
			</div>
		)
	}
}

export const pageQuery = graphql`
	query($slug: String!) {
		mdx(fields: { slug: { eq: $slug } }) {
			frontmatter {
				title
				office {
					id
					city
					state
					mapURL
				}
				date
				author {
					id
				}
				endDateTime
				heroImage
				summary
				bodyImage
				ctaURL
			}
			body
			excerpt
		}
	}
`
