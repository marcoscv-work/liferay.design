/** @jsx jsx */

import { jsx } from 'theme-ui'
import Report from 'pages/2021/report.js'
import ComingSoon from 'pages/2021/comingSoon.js'
import moment from 'moment'

export const TwentyTwentyOne = () => {
	const today = new Date().getTime()

	const publishDate = '2021/12/21'

	const publishOn = new Date(moment(publishDate)).getTime()

	function schedulePage() {
		// if its a production env
		if (process.env.NODE_ENV === 'production') {
			// and if its after the publish date
			// show the report
			if (publishOn < today) {
				return <Report />
			} else {
				return <ComingSoon /> // otherwise show the Coming Soon page
			}
		} else {
			return <Report /> // show the report outside of prod
		}
	}

	return <div>{schedulePage()}</div>
}

export default TwentyTwentyOne
