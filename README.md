# DigiShelf / Dizpro — admin-managed products

The existing design and enhanced colours are retained. Sample product listings and their uploaded cover image have been removed.

## Install
Replace the files in the root of marketer-raja/Dizpro with the contents of this folder. Keep the data and images folders in the same relative locations. Wait for GitHub Pages to finish deployment.

## Add products
1. Open your site's admin.html page.
2. Use repository marketer-raja/Dizpro and the branch used by GitHub Pages (main by default).
3. Sign in with a GitHub fine-grained token that has Contents: Read and write access to this repository.
4. Select Products → Add product. Enter its title, category, buy/download URL, price and description, and upload your cover image.
5. Enable Published, click Save, then Publish to website.
6. Wait for GitHub Pages to update, then refresh the storefront.

The six newest published products populate Top Picks. Published e-books populate My E-books. Category pages and search read the same catalog. Draft or deleted products do not appear. With no published products, sections show a coming-soon message.

Product links use your existing external checkout/download flow. The original placeholder account, cart, wishlist, newsletter and other unrelated site features have not been changed or connected to a backend.

Validation: JavaScript syntax and fixture-based storefront checks cover empty catalog, publishing, drafts, six-item limit, e-book filtering, category search and product links. Live GitHub publishing requires the owner's token and was not performed.
