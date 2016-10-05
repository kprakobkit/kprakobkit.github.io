import React from 'react'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
import { TypographyStyle } from 'utils/typography'
import ReactGA from 'react-ga';

const BUILD_TIME = new Date().getTime()

module.exports = React.createClass({
  displayName: 'HTML',
  propTypes: {
    body: React.PropTypes.string,
  },
  render () {
    const { body } = this.props
    const title = DocumentTitle.rewind()

    let css
    if (process.env.NODE_ENV === 'production') {
      css = <style dangerouslySetInnerHTML={{ __html: require('!raw!./public/styles.css') }} />
      ReactGA.initialize('UA-37050244-3');
    }

    let script
    if (process.env.NODE_ENV !== 'production') {
      script = <script src={prefixLink(`/bundle.js?t=${BUILD_TIME}`)} />
    }

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0 maximum-scale=5.0"
          />
          <title>{title}</title>
          <TypographyStyle />
          {css}
        </head>
        <body className="landing-page">
          <div id="react-mount" dangerouslySetInnerHTML={{ __html: body }} />
          {script}
        </body>
      </html>
    )
  },
})
