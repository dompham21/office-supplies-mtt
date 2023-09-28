import 'antd/dist/reset.css';
import "@assets/main.css";
import "react-toastify/dist/ReactToastify.css";
import { Hydrate } from "react-query/hydration";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { Suspense, useRef } from "react";
import { appWithTranslation } from "next-i18next";
import DefaultSeo from "@components/ui/default-seo";
import { ReactQueryDevtools } from "react-query/devtools";
import PrivateRoute from "@utils/private-route";
import Loader from '@components/ui/loaders/loader';

const Noop = ({ children }) => <>{children}</>;


const App = ({ Component, pageProps }) => {
  const queryClientRef = useRef(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  const Layout = Component.Layout || Noop;
  const authProps = Component.authenticate;

  return (
    <QueryClientProvider client={queryClientRef.current}>
        <DefaultSeo/>
        <Suspense fallback={<Loader showText={false}/>}>
         <ToastContainer autoClose={2000} theme="colored" />

          {Boolean(authProps) ? (
            <PrivateRoute authProps={authProps}>
              <Layout {...pageProps}>
                <Component {...pageProps} />
              </Layout>
            </PrivateRoute>
          ) : (
              <Layout {...pageProps}>
                <Component {...pageProps} />
              </Layout>
          )}
        </Suspense>
    </QueryClientProvider>
  )
}


export default appWithTranslation(App)