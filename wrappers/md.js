import React from 'react'
import moment from 'moment'
import DocumentTitle from 'react-document-title'
import { rhythm } from 'utils/typography'
import { config } from 'config'

import '../css/zenburn.css'

class MarkdownWrapper extends React.Component {
  render () {
    const { route } = this.props
    const post = route.page.data

    return (
      <DocumentTitle title={`${post.title}`}>
        <div className="markdown">
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
          <em
            style={{
              display: 'block',
              marginBottom: rhythm(2),
            }}
          >
          </em>
        </div>
      </DocumentTitle>
    )
  }
}

MarkdownWrapper.propTypes = {
  route: React.PropTypes.object,
}

export default MarkdownWrapper
