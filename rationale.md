# Structure of ithil/frontend

This document is divided into the following sections:
- Source Structure
- UI Choices
- Deployment Information
- React Individual Choices

## Source Structure
The basic idea is to have pages with a specific `.page.tsx` extension in the `src/pages` directory to differentiate them from component files. A page file can contain a few components, but when the number of components becomes several, they can be stored in separate files based on semantics.

Next.js supports creating pages as folders to facilitate the page -> adjacent component behavior. In this case, a `src/pages/some.page.tsx` file could become `src/pages/some/index.page.tsx`, have the same URL, and serve as the host for their respective side components.

**Only** reusable components should be placed in the `components` directory, as they are intended to be more generic than others.

## UI Choices
Chakra UI is the chosen component library. As a personal rule of thumb, CSS styles should be written using a Tailwind style, with an appropriate extension to sort and deduplicate Tailwind classes (e.g., [Headwind][headwind_link]). It is important to **never** use Chakra's inline `css=({ someStyle: 'red' })` property, as it fragments the styling and offers a [limited number of shortcuts][chakraui_styles].

Global colors are defined in the [global.css][global_css] file for light and dark themes. **Note:** The color values may currently be inconsistent, as they need to reflect the designs. These colors are also linked to Tailwind through the `tailwind.config.js` file, allowing them to be used in Tailwind classes.

In the CSS file, it's important to avoid copy-pasting colors and instead use variable references to prevent numerous small color variations that are hard to track.

Chakra has a [config file][chakra_config] with customized component variants and font styles. The font styles (sm/md/md2/lg, and so on) are an attempt to rationalize them, but it's still a work in progress due to inconsistent designs.

[headwind_link]: https://marketplace.visualstudio.com/items?itemName=heybourn.headwind
[chakraui_styles]: https://chakra-ui.com/docs/styled-system/style-props
[global_css]: src/styles/globals.css
[chakra_config]: src/styles/theme/chakra.ts

## Deployment Information
The [contracts project][ithil_contracts] includes deploy scripts that produce files in the `src/deploy` directory. These files are meant to be included in the git repository, as they should be the same for everyone. They are used to fetch the addresses of deployed contracts.

The files also define the testnet Tenderly network URL. This network will be added on page load if the user is NOT connected to an Arbitrum network (chainId = 42161). This choice is completely arbitrary.

[ithil_contracts]: https://github.com/Ithil-protocol/dev

## React Individual Choices
Tanstack Query's persistent cache is used to store the CoinGecko data, which is fetched only **client-side**. This approach eliminates the need for a CoinGecko key, as the user themselves makes a few requests to fetch the token value. The data is also cached to significantly reduce the number of requests. Note that the CoinGecko data should not be a requirement for the App to work correctly; it should only be a utility for users to display the value in USD.

There is an exception to this rule for the leverage logic. The computation is also based on token price, and the value *could* be read from a more reliable source, such as a Chainlink oracle.

Most on-chain data is fetched using wagmi, which already leverages Tanstack Query. In a specific case, the raw wagmi/multicall has been wrapped with Tanstack Query to allow a large number of values to be read in just 1 RPC call. It is generally a good practice to use multicall to read related data in a single call, instead of many independent wagmi hooks, as they generate a lot of RPC calls.
