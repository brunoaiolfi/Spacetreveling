import { AppProps } from 'next/app';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
