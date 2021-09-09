import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="ja-JP" dir="ltr">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <script>console.log('aa')</script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
