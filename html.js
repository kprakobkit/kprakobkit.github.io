import React from 'react'
import DocumentTitle from 'react-document-title'
import { prefixLink } from 'gatsby-helpers'
import { TypographyStyle } from 'utils/typography'

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
           <script dangerouslySetInnerHTML={{__html: `
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            ga('create', 'UA-37050244-3', 'auto');
            ga('send', 'pageview');
          `}} />
        </body>
      </html>
    )
  },
})
