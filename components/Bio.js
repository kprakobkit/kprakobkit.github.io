import React from 'react'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import { prefixLink } from 'gatsby-helpers'

class Bio extends React.Component {
  render () {
    return (
      <p
        style={{
          marginBottom: rhythm(1.75)
        }}
      >
      I'm a software developer for <a href="https://www.thoughtworks.com" target="_blank">ThoughtWorks</a>. I wrote these posts to share my learning and to <a href="https://www.urbandictionary.com/define.php?term=pay%20it%20forward" target="_blank">pay it forward</a>.
      </p>
    )
  }
}

export default Bio
