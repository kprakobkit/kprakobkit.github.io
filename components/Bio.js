import React from 'react'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import { prefixLink } from 'gatsby-helpers'

class Bio extends React.Component {
  render () {
    return (
      <p
        style={{
          marginBottom: rhythm(2.5),
        }}
      >
      I'm a software developer at <a href="https://www.thoughtworks.com" target="_blank">ThoughtWorks</a>, and these are my stories.
      </p>
    )
  }
}

export default Bio
