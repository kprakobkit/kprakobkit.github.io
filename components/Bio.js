import React from 'react'
import { rhythm } from 'utils/typography'

class Bio extends React.Component {
  render () {
    return (
      <div>
      <p>
        Hi there! My name's Peter Prakobkit and I'm a software developer working for <a href="https://www.thoughtworks.com" target="_blank">ThoughtWorks</a> in San Francisco.
      </p>
      <p
      style={{
        marginBottom: rhythm(1.75),
      }}
      >I wrote these posts to share my learning and <a href="https://www.urbandictionary.com/define.php?term=pay%20it%20forward" target="_blank">pay it forward</a> and would love to hear from you so please don't hesitate to <a href="mailto:kprakobkit+blog@gmail.com">email me</a>.
      </p>
      </div>
    )
  }
}

export default Bio
