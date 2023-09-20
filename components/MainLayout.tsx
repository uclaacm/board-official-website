import Head from 'next/head';
import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

interface LayoutProps {
  children: JSX.Element;
}
export default function MainLayout(props: LayoutProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="title" content="ACM Board" />
        <meta
          name="description"
          content="Official Website of ACM Board at UCLA"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <title>ACM Board</title>
        <link rel="icon" href="/acm_logo.svg" />
      </Head>
      <Navbar />
      <main>{props.children}</main>
      <Footer />
    </>
  );
}
