/** @jsx jsx */

import { jsx, Grid, Box, Flex } from 'theme-ui'
import { Container, Link, Image, ScrollProgress } from 'components/atoms'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { SEO, Tags, GlobalMdx } from 'components/molecules'
import { Footer, Navbar, RecentBlogPosts, PreviousNext } from 'components/organisms'
import { graphql, withPrefix } from 'gatsby'
import moment from 'moment'
import React, { Component } from 'react'
import * as styles from './styles.module.scss'
import { makeAuthorSlug } from 'utils'
import Plx from 'react-plx'

const featuredImage = [
	{
		start: '0',
		duration: '100vh',
		properties: [
			{
				startValue: 1,
				endValue: 1.5,
				property: 'scale',
			},
		],
	},
]

const hero = [
	{
		start: '0',
		duration: '100vh',
		properties: [
			{
				startValue: 0,
				endValue: 50,
				unit: 'vh',
				property: 'translateY',
			},
			{
				startValue: 1,
				endValue: 0,
				property: 'opacity',
			},
		],
	},
]

export default class Articles extends Component {
	render() {
		const post = this.props.data.mdx
		const componentStyles = styles || {}
		const author = post.frontmatter.author || { id: 'Liferay Design' }
		const links = author.links ? author.links : null // this is to catch people who dont have links

		return (
			<div style={{ overflowX: 'hidden' }}>
				<ScrollProgress />
				<SEO
					description={post.excerpt}
					previewImage={post.frontmatter.featuredImage}
					keywords={post.frontmatter.tags}
					pageTitle={
						`${post.frontmatter.title}` +
						' - an article by ' +
						`${author.id}` +
						' on Design.Liferay'
					}
					twitterHandle={links ? links.twitter : null}
					canonicalLink={
						post.frontmatter.canonicalLink
							? post.frontmatter.canonicalLink
							: ''
					}
					contentType="article"
				/>
				<Navbar section="Articles" className={componentStyles.sticky} />
				<Plx
					parallaxData={hero}
					sx={{ paddingBottom: '6rem', willChange: 'transform' }}
				>
					<Container>
						<Grid sx={{ gridAutoFlow: 'column' }} className={componentStyles.banner}>
							<Box>
								{post.frontmatter.tags ? (
									<Tags tags={post.frontmatter.tags} />
								) : null}
								<h1>
									{post.frontmatter.title}{' '}
									<span>
										by{' '}
										<Link
											sx={{
												color: 'primaryl3',
												textDecoration: 'underline',
												textDecorationColor: theme =>
													theme.colors.primary,
											}}
											to={withPrefix(
												'/team/' +
													`${makeAuthorSlug(
														author.id,
													)}`,
											)}
										>
											{author.id}
										</Link>
										{post.frontmatter.contributors ? (
											<>
												{' '}
												and{' '}
												{post.frontmatter.contributors.map(i => (
													<Link
														sx={{
															color: 'primaryl3',
															textDecoration: 'underline',
															textDecorationColor:
																'primary',
														}}
														to={withPrefix(
															'/team/' +
																`${makeAuthorSlug(i.id)}`,
														)}
													>
														{i.id}
													</Link>
												))}
											</>
										) : null}
										&nbsp;on{' '}
										{moment(post.frontmatter.date).format(
											'MMMM DD, YYYY',
										)}
									</span>
								</h1>
							</Box>
							<Box
								sx={{
									alignSelf: 'center',
									justifySelf: 'center',
								}}
								className={componentStyles.role}
							>
								<h2>{post.timeToRead} Min Read</h2>
							</Box>
						</Grid>
					</Container>
				</Plx>
				<div className={componentStyles.markdownContainer}>
					<div
						sx={{
							margin: '-16rem auto 0',
							overflow: 'hidden',
							width: ['auto', '768px'],
						}}
						className={componentStyles.featuredImage}
					>
						<Plx
							parallaxData={featuredImage}
							sx={{ willChange: 'transform', transformOrigin: 'center' }}
						>
							<Image
								alt={'featured image for ' + `${post.frontmatter.title}`}
								src={post.frontmatter.featuredImage}
							/>
						</Plx>
					</div>
					<div className={componentStyles.wrapper}>
						<GlobalMdx>
							<MDXRenderer>{post.body}</MDXRenderer>
						</GlobalMdx>
						<PreviousNext section="articles" current={post.id} />
					</div>
				</div>
				<RecentBlogPosts
					heading={'More posts by ' + `${author.id}`}
					teammate={`${makeAuthorSlug(author.id)}`}
					currentPost={post.id}
				/>
				<Footer light />
			</div>
		)
	}
}

export const pageQuery = graphql`
	query($slug: String!) {
		mdx(fields: { slug: { eq: $slug } }) {
			id
			timeToRead
			frontmatter {
				author {
					id
					links {
						twitter
					}
				}
				featuredImage
				canonicalLink
				title
				date
				tags
				contributors {
					id
				}
			}
			excerpt
			body
		}
	}
`
