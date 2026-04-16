import { Container, Flex } from 'components/atoms'
import { MDXRenderer } from "gatsby-plugin-mdx"
import { GlobalMdx } from 'components/molecules'
import { Footer, Navbar } from 'components/organisms'
import { graphql } from 'gatsby'
import React, { Component } from 'react'
import * as styles from './styles.module.scss'

export default class Resources extends Component {
	render() {
		const post = this.props.data.mdx
		const componentStyles = styles || {}

		return (
			<div>
				<Navbar section="Resources" />

				<Flex justify="center" align="center" className={componentStyles.banner}>
					<Flex direction="column" className={componentStyles.bannerContent}>
						<h1>{post.frontmatter.title} </h1>
					</Flex>
				</Flex>
				<div className={componentStyles.markdownContainer}>
					<Container>
						<Flex direction="column" className={componentStyles.wrapper}>
							<GlobalMdx>
								<MDXRenderer>{post.body}</MDXRenderer>
							</GlobalMdx>
						</Flex>
					</Container>
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
				description
				order
			}
				body
		}
	}
`
