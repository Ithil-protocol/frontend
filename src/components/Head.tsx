import NextHead from "next/head";

const Head = () => {
  return (
    <NextHead>
      <title>Ithil | The Web3 Wizard</title>
      <meta
        name="description"
        content=" Ithil is a financial interoperability layer that connects the whole web3 space facilitating new value creation via crowdlending."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  );
};

export default Head;
