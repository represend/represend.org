import NextHead from "next/head"

const Head = ({title}) => {
  return (
    <NextHead>
      <title>{title ? title : "Send Change"}</title>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
      <link rel="shortcut icon" href="/favicon.ico"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    </NextHead>
  )
}

export default Head