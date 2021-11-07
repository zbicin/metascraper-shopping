const got = require("got");
const metascraper = require("metascraper")([require("..")()]);

test("jsonld test", async () => {
  const targetUrl =
    "https://www.caesarstoneus.com/catalog/5131-calacatta-nuvo/";
  const { body: html, url } = await got(targetUrl, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0",
    },
  });

  const metadata = await metascraper({ html, url });
  expect(metadata.name).toBe("Calacatta Nuvo");
  expect(metadata.retailer).toBe("Caesarstone US");
}, 10000);

test("do not stop when first jsonld yields no results", async () => {
  const url =
    "https://localhost";
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title></title>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@graph": [
        {
          "@type": "Organization"
        }
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org/",
      "@type": "Product",
      "offers": {
        "@type": "Offer",
        "price": "3099.00"
      }
    }
    </script>
    
  </head>
  <body>
  </body>
  </html>`;

  const metadata = await metascraper({ html, url });
  expect(metadata.price).toBe(3099);
});